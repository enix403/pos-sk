import {
    EntitySchema,
} from "@mikro-orm/core";

import { InventoryItemType } from "@shared/contracts/InventoryItemType";
import { SimpleEntity } from "./SimpleEntity";

export class Inventory extends SimpleEntity {
    item_type: InventoryItemType;
    item_handle: number;
    units: number;
}

export const InventorySchema = new EntitySchema<Inventory, SimpleEntity>({
    class: Inventory,
    tableName: "tbl_inv",
    properties: {
        item_type: { type: String },
        item_handle: { type: Number },
        units: { type: Number },
    }
});

