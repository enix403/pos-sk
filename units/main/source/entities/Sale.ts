import {
    EntitySchema,
    IdentifiedReference,
    Collection
} from "@mikro-orm/core"

import { SaleMethod } from '@shared/contracts/ISale'

import { CreateEnttRef, CreateInverseManyEnttRef } from './utils'

import { SimpleEntity } from './SimpleEntity'
import { StoreItem } from './StoreItem'
import { Customer } from './Customer'

export class Sale extends SimpleEntity {
    // Weather the customer paid money to complete the sale, or added cost to their credit
    public method: SaleMethod;

    // The credit customer, null if method is SaleMethod.Direct
    public customer: IdentifiedReference<Customer> | null;

    public cart: Collection<SaleItem>;

    public amount_total: number; // without discount
    public discount: number;
    public amount_payable: number; // total - discount

    public created_at: Date;
}

export class SaleItem extends SimpleEntity {
    public sale: IdentifiedReference<Sale>;
    public item: IdentifiedReference<StoreItem>;

    public qty_uniy_slug: number;
    public qty_effective_val: number;

    public item_cost_price: number;
    public item_retail_price: number;

    public subtotal: number;
}

export const SaleSchema = new EntitySchema<Sale, SimpleEntity>({
    class: Sale,
    tableName: "tbl_sales",
    properties: {
        method: { type: String, nullable: false },
        customer: CreateEnttRef(() => Customer, { nullable: true }),
        cart: CreateInverseManyEnttRef(() => SaleItem, saleItem => saleItem.sale),
        amount_total: { type: Number, unsigned: false, nullable: false },
        discount: { type: Number, unsigned: false, nullable: false },
        amount_payable: { type: Number, unsigned: false, nullable: false },
        created_at: { type: Date, nullable: false, onCreate: () => new Date() },
    }
});

export const SaleItemSchema = new EntitySchema<SaleItem, SimpleEntity>({
    class: SaleItem,
    tableName: "tbl_sale_items",
    properties: {
        sale: CreateEnttRef(() => Sale),
        item: CreateEnttRef(() => StoreItem),
        qty_uniy_slug: { type: String, nullable: false },
        qty_effective_val: { type: Number, unsigned: false, nullable: false },
        item_cost_price: { type: Number, unsigned: false, nullable: false },
        item_retail_price: { type: Number, unsigned: false, nullable: false },
        subtotal: { type: Number, unsigned: false, nullable: false },
    }
});
