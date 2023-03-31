import type { Identified } from '@shared/tsutils';
import type { IStoreItem } from '@shared/contracts/IStoreItem';
import { StoreItemFamily } from '@shared/contracts/IStoreItem';
import { IItemStock } from '@shared/contracts/IItemStock';


export const DUMMY_ITEMS: Array<Identified<IItemStock>> = [
    {
        id: 1,
        item: {
            id: 1,
            pcode: null,
            pcode_std: 'none',

            family: StoreItemFamily.TradeItem,

            name: "Wheat",
            description: "",

            unit: "kg",
            cost_price: 343,
            retail_price: 400,

            active: true,

            attributes: [
                { name: 'Size', value: '112L' },
                { name: 'Color', value: 'Magenta' },
            ],
        },
        unit_count: 1053,
        updated_at: "",
    },
    {
        id: 2,
        item: {
            id: 2,
            pcode: null,
            pcode_std: 'none',

            family: StoreItemFamily.TradeItem,

            name: "Rio Chocolate",
            description: "",

            unit: "pc",
            cost_price: 347,
            retail_price: 377,

            active: true,

            attributes: [
                { name: 'Size', value: '112L' },
                { name: 'Color', value: 'Magenta' },
            ],
        },
        unit_count: 1053,
        updated_at: "",
    },
    {
        id: 3,
        item: {
            id: 3,
            pcode: null,
            pcode_std: 'none',

            family: StoreItemFamily.TradeItem,

            name: "Rio Strawberry",
            description: "",

            unit: "pc",
            cost_price: 351,
            retail_price: 381,

            active: true,

            attributes: [
                { name: 'Size', value: '112L' },
                { name: 'Color', value: 'Magenta' },
            ],
        },
        unit_count: 1053,
        updated_at: "",
    },
    {
        id: 4,
        item: {
            id: 4,
            pcode: null,
            pcode_std: 'none',

            family: StoreItemFamily.TradeItem,

            name: "Rice",
            description: "",

            unit: "kg",
            cost_price: 355,
            retail_price: 385,

            active: true,

            attributes: [
                { name: 'Size', value: '112L' },
                { name: 'Color', value: 'Magenta' },
            ],
        },
        unit_count: 1053,
        updated_at: "",
    },
    {
        id: 5,
        item: {
            id: 5,
            pcode: null,
            pcode_std: 'none',

            family: StoreItemFamily.TradeItem,

            name: "Item 5",
            description: "",

            unit: "kg",
            cost_price: 359,
            retail_price: 389,

            active: true,

            attributes: [
                { name: 'Size', value: '112L' },
                { name: 'Color', value: 'Magenta' },
            ],
        },
        unit_count: 1053,
        updated_at: "",
    },
    {
        id: 6,
        item: {
            id: 6,
            pcode: null,
            pcode_std: 'none',

            family: StoreItemFamily.TradeItem,

            name: "Item 6",
            description: "",

            unit: "kg",
            cost_price: 363,
            retail_price: 394,

            active: true,

            attributes: [
                { name: 'Size', value: '112L' },
                { name: 'Color', value: 'Magenta' },
            ],
        },
        unit_count: 1053,
        updated_at: "",
    },
    {
        id: 7,
        item: {
            id: 7,
            pcode: null,
            pcode_std: 'none',

            family: StoreItemFamily.TradeItem,

            name: "Item 7",
            description: "",

            unit: "kg",
            cost_price: 367,
            retail_price: 398,

            active: true,

            attributes: [
                { name: 'Size', value: '112L' },
                { name: 'Color', value: 'Magenta' },
            ],
        },
        unit_count: 1053,
        updated_at: "",
    },
    {
        id: 8,
        item: {
            id: 8,
            pcode: null,
            pcode_std: 'none',

            family: StoreItemFamily.TradeItem,

            name: "Item 8",
            description: "",

            unit: "kg",
            cost_price: 371,
            retail_price: 402,

            active: true,

            attributes: [
                { name: 'Size', value: '112L' },
                { name: 'Color', value: 'Magenta' },
            ],
        },
        unit_count: 1053,
        updated_at: "",
    },
];

