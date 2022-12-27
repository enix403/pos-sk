import { IterableArrayLike } from '../tsutils';

export interface UnitDescription {
    slug: string;
    title: string;
}

export const availableUnits: UnitDescription[] = [
    { slug: "piece", title: "Piece" },
    { slug: "mt", title: "Meters (m)" },
    { slug: "in", title: "Inches (in)" },
    { slug: "kg", title: "Kilograms (kg)" },
    { slug: "gm", title: "Grams (g)" },
    { slug: "lt", title: "Litres (lt)" },
    { slug: "oz", title: "Ounces (oz)" }
]

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
