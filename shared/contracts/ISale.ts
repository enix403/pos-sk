import type { PackedQuantity } from "./unit";

export enum SaleMethod {
    Direct = "direct",
    Credit = "credit"
}

export interface ISaleCartItem {
    item_id: number;
    quantity: PackedQuantity;
}