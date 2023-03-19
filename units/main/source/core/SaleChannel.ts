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

export class SaleChannel extends IpcChannel {
    constructor() {
        super();

        this.register(this.newSale);
    }

    private newSale = new MsgDispatch(MSG.Sale.CreateSale, async (payload) => {
        // **TODO**: Check if there are enough units of each item to proceed with the sale

        const { cart, meta } = payload;

        if (cart.length == 0)
            return;

        const em = EFORK();

        const sale = em.create(Sale, {
            method: meta.method,
        });

        // Record the customer if the sale is a credit sale
        if (meta.method == SaleMethod.Credit) {
            let customer: Customer;
            try {
                customer = await em.findOneOrFail(Customer, { id: meta.customer_id });
            }
            catch (e) {
                throw new ChannelError("Invalid customer reference.");
            }

            sale.customer = Reference.create(customer);
        }
        else {
            sale.customer = null;
        }

        // Preload the required items
        const cartItemIds: number[] = cart.map(cartItem => cartItem.item.id);
        const storeItems = await em.find(StoreItem, cartItemIds);

        let totalAmount = 0;

        for (const cartItem of cart) {
            const storeItem = storeItems.find(st => st.id == cartItem.item.id)!;

            const saleItemObject = em.create(SaleItem, {
                item: Reference.create(storeItem),
                item_unit_count: cartItem.unit_count,
                item_cost_price: storeItem.cost_price,
                item_retail_price: storeItem.retail_price,
            });

            totalAmount += saleItemObject.item_unit_count * saleItemObject.item_retail_price;

            sale.cart.add(saleItemObject);
        }

        sale.amount_total = totalAmount;

        await em.persistAndFlush(sale);
    });
}
