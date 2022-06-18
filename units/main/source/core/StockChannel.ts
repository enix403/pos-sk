import { IpcChannel, MsgDispatch } from "@/channel";
import { ChannelError } from "@/channel/exceptions";

import { AllMessages } from "@shared/communication";

import { TradeItem, StockUpdate, Inventory } from "@/entities";
import { EFORK } from "@/database";

import { sleep } from '@shared/commonutils'


export class StockChannel extends IpcChannel {

    constructor() {
        super();

        this.register(this.createTradeItem);
        this.register(this.listTradeItems);
        this.register(this.updateStock);
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

        /*
        let item: Inventory;
        try { item = await em.findOneOrFail(Inventory, { id: payload.inventory_item_handle }); }
        catch (e) { console.log(e); throw new ChannelError("Invalid invectory item reference."); }

        const updateObj = em.create(StockUpdate, {
            inventory_item: item,
            delta_units: payload.delta_units,
            description: payload.description
        });

        await em.persistAndFlush(updateObj);
        */
    });
}
