import {
    EntitySchema,
    IdentifiedReference
} from "@mikro-orm/core"

import { CreateEnttRef } from './utils'

import { SimpleEntity } from './SimpleEntity'
import { StoreItem } from './StoreItem'

export class ItemStock extends SimpleEntity {
    public item: IdentifiedReference<StoreItem>;
    public unit_count: number;
    public updated_at: Date;
}

export const ItemStockSchema = new EntitySchema<ItemStock, SimpleEntity>({
    class: ItemStock,
    tableName: 'tbl_item_stocks',
    properties: {
        item: CreateEnttRef(() => StoreItem),
        unit_count: { type: Number, nullable: false },
        updated_at: {
            type: Date,
            nullable: false,
            onCreate: () => new Date(),
            onUpdate: () => new Date()
        }
    }
});
