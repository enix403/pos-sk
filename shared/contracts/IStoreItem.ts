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
    pcode: string;
    pcode_std: string;

    family: StoreItemFamily;

    name: string;
    description: string;

    unit: string;
    price_per_unit: number;
    active: boolean;

    attributes: IterableArrayLike<IStoreItemAttribute>;
}
