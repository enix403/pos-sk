import { Identified } from '../tsutils';

export interface ITradeItem {
    name: String;
    salePrice: Number;
}

export type IdentifiedTradeItem = Identified<ITradeItem>
