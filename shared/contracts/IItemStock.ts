
import type { Identified } from '../tsutils'
import type { IStoreItem } from './IStoreItem'
import type { SerializedDatetime } from './SerializedDatetime'

export interface IItemStock {
    item: Identified<IStoreItem>;
    unit_count: number;
    updated_at: SerializedDatetime.Type;
}
