import type { Collection, IdentifiedReference } from '@mikro-orm/core';
import type { EnhancedBool } from '@shared/tsutils';

import { SimpleEntity, SimpleEntitySchema } from './SimpleEntity';
import { TradeItem, TradeItemSchema } from './TradeItem'
import { Inventory, InventorySchema } from './Inventory'
import { StockUpdate, StockUpdateSchema } from './StockUpdate'

const allEntities = [
  SimpleEntitySchema,

  TradeItemSchema,
  InventorySchema,
  StockUpdateSchema,
];

export { TradeItem, Inventory, StockUpdate };

export default allEntities;

export type ModelRelation<T> = {
  [P in keyof Required<T>]: T[P] extends
  | SimpleEntity
  | Collection<any>
  | IdentifiedReference<any>
  ? P : never
}[keyof T];

// It's kinda ugly to have `['somerelation'] as ModelRelation<SomeEntity>[]` floating everywhere.
export function entt_relation_list<T extends SimpleEntity>(
  ...rels: (ModelRelation<T> | EnhancedBool)[]
): ModelRelation<T>[] {
  return rels.filter(Boolean) as ModelRelation<T>[];
}

export function entt_field_list<T extends SimpleEntity>(
  ...fields: ((keyof T) | EnhancedBool)[]
): (keyof T)[] {
  return fields.filter(Boolean) as (keyof T)[];
}
