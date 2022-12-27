import {
    EntitySchema,
} from "@mikro-orm/core"

import { SimpleEntity } from './SimpleEntity'

export class Customer extends SimpleEntity {
    public name: string | null;
    public total_payable: number;
}

export const CustomerSchema = new EntitySchema<Customer, SimpleEntity>({
    class: Customer,
    tableName: "tbl_customers",
    properties: {
        name: { type: String, nullable: true },
        total_payable: { type: Number, unsigned: false, nullable: false },
    }
});

