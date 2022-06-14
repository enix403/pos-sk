import { EntitySchema } from '@mikro-orm/core';

export class SimpleEntity {
    id!: number;
}

export const SimpleEntitySchema = new EntitySchema<SimpleEntity>({
    class: SimpleEntity,
    abstract: true,
    properties: {
        id: { type: Number, primary: true }
    }
});
