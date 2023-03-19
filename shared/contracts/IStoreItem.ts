import { IterableArrayLike } from '../tsutils';

export interface UnitDescription {
    slug: string;
    title: string;
    subUnit: string | null;
}

export const PIECE_UNIT = 'pc';

export const availableUnits: UnitDescription[] = [
    { slug: PIECE_UNIT, subUnit: null, title: "Piece" },
    { slug: "lt", subUnit: 'ml', title: "Litres (lt)" },
    { slug: "kg", subUnit: 'gm', title: "Kilograms (kg)" },
    { slug: "gm", subUnit: null, title: "Grams (g)" },
];

export function fromSlug(s: string): UnitDescription | null {
    return availableUnits.find(u => u.slug == s) || null;
}

export function applySubUnit(_unit: UnitDescription, su: number): number {
    // *A very terrible hack*.
    // Currently all sub units are a 1000th (thousandth) part of their (parent) unit
    // So *urrently* just divide by 1000 to get the quantity in actual unit
    //
    // TODO: handle different convertion functions

    return su / 1000;
}

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
