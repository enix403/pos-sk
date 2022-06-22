import {
    EntitySchema,
    IdentifiedReference,
    Collection
} from "@mikro-orm/core"

import { CreateEnttRef, CreateInverseManyEnttRef } from './utils'

import { SimpleEntity } from './SimpleEntity'
import { StoreItem } from './StoreItem'

export class Sale extends SimpleEntity {
    public customer_name: string | null;
    public created_at: Date;

    public amount_total: number;
    public amount_paid: number;

    public cart: Collection<SaleItem>;
}

export class SaleItem extends SimpleEntity {
    public sale: IdentifiedReference<Sale>;
    public item: IdentifiedReference<StoreItem>;

    public item_unit_count: number;
    public item_unit_price: number;
}

export const SaleSchema = new EntitySchema<Sale, SimpleEntity>({
    class: Sale,
    tableName: "tbl_sales",
    properties: {
        customer_name: { type: String, nullable: true },
        created_at: { type: Date, nullable: false, onCreate: () => new Date() },
        amount_total: { type: Number, unsigned: false, nullable: false },
        amount_paid: { type: Number, unsigned: false, nullable: false },
        cart: CreateInverseManyEnttRef(() => SaleItem, saleItem => saleItem.sale)
    }
});

export const SaleItemSchema = new EntitySchema<SaleItem, SimpleEntity>({
    class: SaleItem,
    tableName: "tbl_sale_items",
    properties: {
        sale: CreateEnttRef(() => Sale),
        item: CreateEnttRef(() => StoreItem),
        item_unit_count: { type: Number, unsigned: false, nullable: false },
        item_unit_price: { type: Number, unsigned: false, nullable: false }
    }
});
