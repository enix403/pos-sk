import { IpcChannel, MsgDispatch } from "@/channel";
import { ChannelError } from "@/channel/exceptions";

import { AllMessages } from "@shared/communication";

import { TradeItem, StockUpdate, Inventory } from "@/entities";
import { EFORK } from "@/database";

import { sleep } from '@shared/commonutils'
import { InventoryItemType } from "@shared/contracts/InventoryItemType";
import { IInventoryRecord } from "@shared/contracts/IInventoryRecord";


export class StockChannel extends IpcChannel {

    constructor() {
        super();

        this.register(this.createTradeItem);
        this.register(this.listTradeItems);
        this.register(this.updateStock);
        this.register(this.listInventory);
    }

    private createTradeItem = new MsgDispatch(AllMessages.Stock.CreateTradeItem, async (payload) => {
        if (!payload.name)
            throw new ChannelError("Invalid name");

        if (payload.salePrice <= 0)
            throw new ChannelError("Invalid sale price");

        const em = EFORK();

        const item = em.create(TradeItem, payload);
        await em.persistAndFlush(item);

        return item;
    });

    private listTradeItems = new MsgDispatch(AllMessages.Stock.GetTradeItems, async () => {
        // Gotta test the loading animations for now :}
        return sleep(500).then(() => EFORK().find(TradeItem, {}));
    })

    private updateStock = new MsgDispatch(AllMessages.Stock.Update, async (payload) => {

        const em = EFORK();

        // For now payload.inventory_item_handle always refers to a trade item

        let tradeItem: TradeItem;
        try { tradeItem = await em.findOneOrFail(TradeItem, { id: payload.inventory_item_handle }); }
        catch (e) { throw new ChannelError("Invalid inventory item reference."); }

        let item = await em.findOne(Inventory, {
            item_type: InventoryItemType.Trade,
            item_handle: tradeItem.id
        });

        if (item == null) {
            item = em.create(Inventory, {
                item_type: InventoryItemType.Trade,
                item_handle: tradeItem.id,
                units: 0
            });
        }

        item.units += payload.delta_units;
        em.persist(item);

        const updateObj = em.create(StockUpdate, {
            inventory_item: item,
            delta_units: payload.delta_units,
            description: payload.description
        });

        em.persist(updateObj);

        em.flush();
    });

    private listInventory = new MsgDispatch(AllMessages.Stock.GetInventory, async () => {
        const em = EFORK();
        const rows = await em.find(Inventory, {});

        const processed: IInventoryRecord[] = [];

        for (const row of rows) {
            const item = await em.findOneOrFail(TradeItem, { id: row.item_handle });
            processed.push({
                inv_id: row.id,
                item_id: item.id,
                item_name: item.name,
                item_type: row.item_type,
                unit: "none",
                unit_count: row.units
            });
        }

        return processed;
    });
}
