import {
    EntitySchema,
    IdentifiedReference,
    Collection
} from "@mikro-orm/core"

import { StoreItemFamily } from '@shared/contracts/IStoreItem'

import { CreateEnttRef, CreateInverseManyEnttRef } from './utils'

import { SimpleEntity } from './SimpleEntity'

export class StoreItem extends SimpleEntity {
    public pcode: string;
    public pcode_std: string;
    public name: string;
    public description: string;

    public family: StoreItemFamily;

    public unit: string;
    public price_per_unit: number;
    public active: boolean;

    public attributes: Collection<StoreItemAttribute>;
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
        pcode: { type: String, nullable: false },
        pcode_std: { type: String, nullable: false },
        name: { type: String, nullable: false },
        description: { type: 'text', nullable: false },

        family: { type: String, nullable: false },

        unit: { type: String, nullable: false },
        price_per_unit: { type: Number, unsigned: false, nullable: false },
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
