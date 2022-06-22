import type { InventoryItemType } from './InventoryItemType';

export interface IInventoryRecord
{
    inv_id: number;
    item_id: number;
    item_name: string;
    item_type: InventoryItemType;
    unit: "none";
    unit_count: number;
};
