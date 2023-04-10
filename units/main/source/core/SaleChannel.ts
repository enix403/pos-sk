import { Reference } from '@mikro-orm/core';
import { IpcChannel, MsgDispatch } from "@/channel";
import { ChannelError } from "@/channel/exceptions";

import { MSG } from "@shared/communication";
import { ISaleCartItem, SaleMethod } from "@shared/contracts/ISale";

import { EFORK } from "@/database";

import { sleep } from '@shared/commonutils'
import { logger } from '@/logging'

import { Sale, SaleItem, Customer, ItemStock } from '@/entities'
import { Quantity } from '@shared/contracts/unit';

const { SaleResult, to_sale_completion } = MSG.Sale;
type OutStockItem = MSG.Sale.OutStockItem;

export class SaleChannel extends IpcChannel {
    constructor() {
        super();

        this.register(this.newSale);
    }

    private newSale = new MsgDispatch(MSG.Sale.CreateSale, async ({ cart, meta }) => {

        // TODO: Check if there are enough units of each item to proceed with the sale

        if (cart.length == 0)
            return to_sale_completion(SaleResult.EmptyCart);

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
        const dbStocks = await em.find(ItemStock,
            { item: { id: { $in: cartItemIds } } },
            { populate: ['item'] }
        );

        type HydratedCartItems = {
            dbStock: ItemStock,
            userCartItem: ISaleCartItem
        };

        const hydratedStocks: HydratedCartItems[] = dbStocks.map(stock => ({
            dbStock: stock,
            userCartItem: cart.find(it => it.item_id == stock.item.id)!
        }));


        let totalAmount = 0;

        let out_of_stock = false;
        const out_items: OutStockItem[] = [];

        for (const stock of hydratedStocks) {
            const { dbStock, userCartItem } = stock;
            const storeItem = dbStock.item.getEntity();

            const qty = Quantity.fromPacked(userCartItem.quantity)!;
            let efv = qty.effectiveValue();

            // unit_count is already "effective"
            if (false && efv > dbStock.unit_count) {
                out_of_stock = true;
                out_items.push({
                    item: storeItem,
                    available: dbStock.unit_count,
                    requested: efv
                });
            }

            let subtotal = qty.applyPrice(storeItem.retail_price);

            totalAmount += subtotal;

            if (out_of_stock)
                continue;

            // dbStock.unit_count -= efv;

            const saleItemObject = em.create(SaleItem, {
                item: Reference.create(storeItem),
                qty_uniy_slug: qty.unit.slug,
                qty_effective_val: qty.effectiveValue(),
                item_cost_price: storeItem.cost_price,
                item_retail_price: storeItem.retail_price,
                subtotal: subtotal,
            });

            sale.cart.add(saleItemObject);
        }

        // If any items are out of stock, immediately error out
        if (out_of_stock) {
            return {
                result: SaleResult.ItemsOutOfStock,
                out_stock_items: out_items
            };
        }

        sale.amount_total = totalAmount;
        sale.discount = meta.discount;
        sale.amount_payable = totalAmount - meta.discount;

        if (meta.method == SaleMethod.Direct) {
            if (meta.amount_paid < sale.amount_payable) {
                throw new ChannelError("Not enough amount paid.");
            }
        }
        else {
            let cust = customer!;
            cust.total_payable += sale.amount_payable;
            em.persist(cust);
        }

        // TODO: remove these now sold items from the stock

        em.persist(sale);

        await em.flush();

        return to_sale_completion(SaleResult.Success);
    });
}
