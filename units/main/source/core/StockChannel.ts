import { Reference } from '@mikro-orm/core';

import { IpcChannel, MsgDispatch } from "@/channel";
import { ChannelError } from "@/channel/exceptions";

import { MSG } from "@shared/communication";

import { EFORK } from "@/database";
import {
    entt_relation_list,
    StoreItem,
    StoreItemAttribute,
    ItemStock,
    StockUpdate
} from '@/entities';

import { sleep } from '@shared/commonutils'

export class StockChannel extends IpcChannel {
    constructor() {
        super();

        this.register(this.listStoreItems);
        this.register(this.createStoreItem);
        this.register(this.updateStock);
    }

    private serializeItem = (item: StoreItem) => ({
        ...item,
        attributes: item.attributes.getItems()
    });

    private listStoreItems = new MsgDispatch(MSG.Stock.GetStoreItems, async () => {
        const em = EFORK();

        const items = await em.find(StoreItem,
            {}, { populate: entt_relation_list<StoreItem>('attributes') });

        return items.map(this.serializeItem);
    });

    private createStoreItem = new MsgDispatch(MSG.Stock.CreatetStoreItem, async (payload) => {
        const em = EFORK();

        const { attributes, ...restPayload } = payload;

        const item = em.create(StoreItem, restPayload);

        for (const attrData of attributes) {
            const attr = em.create(StoreItemAttribute, attrData);
            item.attributes.add(attr);
        }

        await em.persistAndFlush(item);
        return this.serializeItem(item);
    });

    private updateStock = new MsgDispatch(MSG.Stock.UpdateStock, async (payload) => {
        const em = EFORK();

        let storeItem: StoreItem;
        try { storeItem = await em.findOneOrFail(StoreItem, { id: payload.store_item_id }); }
        catch (e) { throw new ChannelError("Invalid store item reference."); }

        let stockObject = await em.findOne(ItemStock, { item: storeItem });

        if (stockObject == null) {
            stockObject = em.create(ItemStock, {
                item: storeItem,
                unit_count: 0
            });
        }

        stockObject.unit_count += payload.body.delta_units;
        await em.persistAndFlush(stockObject);

        const updateObject = em.create(StockUpdate, {
            stock: Reference.create(stockObject),
            delta_units: payload.body.delta_units,
            description: payload.body.description
        });

        em.persist(updateObject);

        await em.flush();
    });
}
