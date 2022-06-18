import { IdentifiedReference, EntitySchema } from "@mikro-orm/core";
import { SimpleEntity } from "./SimpleEntity";
import { Inventory } from "./Inventory";

export class StockUpdate extends SimpleEntity {
    inventory_item: IdentifiedReference<Inventory>;
    delta_units: number;
    description: string;
    created_at: Date;
}

export const StockUpdateSchema = new EntitySchema<StockUpdate, SimpleEntity>({
    class: StockUpdate,
    tableName: "tbl_stock_updates",
    properties: {
        inventory_item: {
            reference: 'm:1',
            entity: () => Inventory,
            wrappedReference: true,
            nullable: false
        },
        delta_units: { type: Number },
        description: { type: String },
        created_at: { type: Date, onCreate: () => new Date() }
    }
});
