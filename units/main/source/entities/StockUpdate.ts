import { IdentifiedReference, EntitySchema } from "@mikro-orm/core";

import { CreateEnttRef } from './utils'

import { SimpleEntity } from "./SimpleEntity";
import { ItemStock } from "./ItemStock";

export class StockUpdate extends SimpleEntity {
    stock: IdentifiedReference<ItemStock>;
    delta_units: number;
    description: string;
    created_at: Date;
}

export const StockUpdateSchema = new EntitySchema<StockUpdate, SimpleEntity>({
    class: StockUpdate,
    tableName: "tbl_stock_updates",
    properties: {
        stock: CreateEnttRef(() => ItemStock),
        delta_units: { type: Number, nullable: false },
        description: { type: String, nullable: false },
        created_at: { type: Date, nullable: false, onCreate: () => new Date() }
    }
});
