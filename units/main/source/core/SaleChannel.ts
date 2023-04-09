import { Reference } from '@mikro-orm/core';
import { IpcChannel, MsgDispatch } from "@/channel";
import { ChannelError } from "@/channel/exceptions";

import { MSG } from "@shared/communication";
import { SaleMethod } from "@shared/contracts/ISale";

import { EFORK } from "@/database";
import {
    StoreItem,
} from '@/entities';

import { sleep } from '@shared/commonutils'
import { logger } from '@/logging'

import { Sale, SaleItem, Customer, ItemStock } from '@/entities'
import { Quantity } from '@/../../../shared/contracts/unit';

export class SaleChannel extends IpcChannel {
    constructor() {
        super();

        this.register(this.newSale);
    }

    private newSale = new MsgDispatch(MSG.Sale.CreateSale, async ({ cart, meta }) => {
        // TODO: Check if there are enough units of each item to proceed with the sale

        if (cart.length == 0)
            return;

        if (meta.discount < 0)
            throw new ChannelError("Discount not valid");


        const em = EFORK();

        const sale = em.create(Sale, {
            method: meta.method,
        });

        let customer: Customer | null = null;
        // Record the customer if the sale is a credit sale
        if (meta.method == SaleMethod.Credit) {
            try {
                customer = await em.findOneOrFail(Customer, { id: meta.customer_id });
            }
            catch (e) {
                throw new ChannelError("Invalid customer reference.");
            }

            sale.customer = Reference.create(customer);
        }
        else {
            sale.customer = customer = null;
        }

        // Preload the required items
        const cartItemIds: number[] = cart.map(cartItem => cartItem.item_id);
        const storeItems = await em.find(StoreItem, cartItemIds);

        let totalAmount = 0;

        for (const cartItem of cart) {
            const storeItem = storeItems.find(st => st.id == cartItem.item_id)!;
            const qty = Quantity.fromPacked(cartItem.quantity)!;

            let subtotal = qty.applyPrice(storeItem.retail_price);

            const saleItemObject = em.create(SaleItem, {
                item: Reference.create(storeItem),
                qty_uniy_slug: qty.unit.slug,
                qty_effective_val: qty.effectiveValue(),
                item_cost_price: storeItem.cost_price,
                item_retail_price: storeItem.retail_price,
                subtotal: subtotal,
            });

            totalAmount += subtotal;

            sale.cart.add(saleItemObject);
        }

        sale.amount_total = totalAmount;
        sale.discount = meta.discount;
        sale.amount_payable = totalAmount - meta.discount;

        if (meta.method == SaleMethod.Direct) {
            if (meta.amount_paid < totalAmount) {
                throw new ChannelError("Not enough amount paid.");
            }
        }
        else {
            // TODO: add the pending balance to the customer's payable 
            let cust = customer!;
            cust.total_payable += sale.amount_payable;
            em.persist(cust);
        }

        // TODO: remove these now sold items from the stock 

        em.persist(sale);

        await em.flush();
    });
}
