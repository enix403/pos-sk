import { IterableArrayLike } from '../tsutils';

export enum StoreItemFamily {
    TradeItem = 'trade_item',
    SelfBrand = 'self_brand'
}

export interface IStoreItemAttribute {
    name: string;
    value: string;
}

export interface IStoreItem {
    pcode: string | null;
    pcode_std: string;

    family: StoreItemFamily;

    name: string;
    description: string;

    unit: string;
    cost_price: number;
    retail_price: number;

    active: boolean;

    attributes: IterableArrayLike<IStoreItemAttribute>;
}
