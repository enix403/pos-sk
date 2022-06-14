import {
    EntitySchema,
} from "@mikro-orm/core";

import { SimpleEntity } from "./SimpleEntity";

export class TradeItem extends SimpleEntity {
    name: String;
    salePrice: Number;
}

export const TradeItemSchema = new EntitySchema<TradeItem, SimpleEntity>({
    class: TradeItem,
    tableName: "tbl_trade_item",
    properties: {
        name: { type: String },
        salePrice: { type: Number },
    }
});

