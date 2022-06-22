import type { SerializedDatetime } from './SerializedDatetime';

export interface IStockUpdatePayload {
    delta_units: number;
    description: string;
    created_at?: SerializedDatetime.Type;
}
