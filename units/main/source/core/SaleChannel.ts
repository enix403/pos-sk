import { Reference } from '@mikro-orm/core';
import { IpcChannel, MsgDispatch } from "@/channel";

import { MSG } from "@shared/communication";

import { EFORK } from "@/database";
import {
    StoreItem,
} from '@/entities';

import { sleep } from '@shared/commonutils'
import { logger } from '@/logging'


import { Sale, SaleItem } from '@/entities'

export class SaleChannel extends IpcChannel {
    constructor() {
        super();

        this.register(this.newSale);

        this.register(this.demo);
    }

    private demo = new MsgDispatch(MSG.Dummy, async () => {
    });

    private newSale = new MsgDispatch(MSG.Sale.CreateSale, async (payload) => {
        const { cart, metadata } = payload;

        if (cart.length == 0)
            return;

        const em = EFORK();
        const sale = em.create(Sale, {
            customer_name: metadata.customer_name,
            amount_total: 0, /* Calculated later below */
            amount_paid: metadata.amount_paid
        });

        // Preload the required items
        const cartItemIds = cart.map(cartItem => cartItem.item.id);
        const storeItems = await em.find(StoreItem, cartItemIds);

        let totalAmount = 0;

        for (const cartItem of cart) {
            const storeItem = storeItems.find(st => st.id == cartItem.item.id)!;

            const saleItemObject = em.create(SaleItem, {
                item: Reference.create(storeItem),
                item_unit_count: cartItem.unit_count,
                item_unit_price: storeItem.price_per_unit
            });

            totalAmount += saleItemObject.item_unit_count * saleItemObject.item_unit_price;

            sale.cart.add(saleItemObject);
        }

        sale.amount_total = totalAmount;

        await em.persistAndFlush(sale);
    });
}
