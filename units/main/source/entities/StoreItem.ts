import {
    EntitySchema,
    IdentifiedReference,
    Collection
} from "@mikro-orm/core"

import { IStoreItem, StoreItemFamily } from '@shared/contracts/IStoreItem'

import { CreateEnttRef, CreateInverseManyEnttRef } from './utils'

import { SimpleEntity } from './SimpleEntity'

export class StoreItem extends SimpleEntity implements IStoreItem {
    public pcode: string | null;
    public pcode_std: string;
    public name: string;
    public description: string;

    public family: StoreItemFamily;

    public unit: string;
    public cost_price: number;
    public retail_price: number;

    public attributes: Collection<StoreItemAttribute>;
    public active: boolean;
}

export class StoreItemAttribute extends SimpleEntity {
    public item: IdentifiedReference<StoreItem>;
    public name: string;
    public value: string;
}

export const StoreItemSchema = new EntitySchema<StoreItem, SimpleEntity>({
    class: StoreItem,
    tableName: 'tbl_store_items',
    properties: {
        pcode: { type: String, nullable: true },
        pcode_std: { type: String, nullable: false },
        name: { type: String, nullable: false },
        description: { type: 'text', nullable: false },

        family: { type: String, nullable: false },

        unit: { type: String, nullable: false },
        cost_price: { type: Number, unsigned: false, nullable: false },
        retail_price: { type: Number, unsigned: false, nullable: false },
        active: { type: Boolean, nullable: false, default: false },

        attributes: CreateInverseManyEnttRef(() => StoreItemAttribute, attibute => attibute.item)
    }
});


export const StoreItemAttributeSchema = new EntitySchema<StoreItemAttribute, SimpleEntity>({
    class: StoreItemAttribute,
    tableName: 'tbl_store_item_attrs',
    properties: {
        item: CreateEnttRef(() => StoreItem),
        name: { type: String, nullable: false },
        value: { type: String, nullable: false },
    }
});
