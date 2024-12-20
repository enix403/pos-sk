import { IpcChannel } from "@/channel";
import { ChannelError } from "@/channel/exceptions";
import type { MessageHandler } from "@/channel";

import { AllMessages } from "@shared/communication";

import { TradeItem } from "@/entities";
import { EFORK } from "@/database";

import { sleep } from '@shared/commonutils'

export class StockChannel extends IpcChannel {

    constructor()
    {
        super();

        this.register(AllMessages.Stock.CreateTradeItem, this.createTradeItem);
        this.register(AllMessages.Stock.GetTradeItems, this.listTradeItems);
    }

    private createTradeItem: MessageHandler<AllMessages.Stock.CreateTradeItem> = async (payload) => {

        if (!payload.name)
            throw new ChannelError("Invalid name");

        if (payload.salePrice <= 0)
            throw new ChannelError("Invalid sale price");

        const em = EFORK()

        const item = em.create(TradeItem, payload);
        await em.persistAndFlush(item);

        return item;
    }

    private listTradeItems: MessageHandler<AllMessages.Stock.GetTradeItems> = async () => sleep(500).then(() => EFORK().find(TradeItem, {}));
}
