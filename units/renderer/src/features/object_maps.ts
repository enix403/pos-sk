import { IStoreItem, StoreItemFamily } from '@shared/contracts/IStoreItem';
import { Units } from '@shared/contracts/unit';

/**
 * Converts an item-unit to its string representation
 * */
export function SItemUnitText(unitSlug: string): string {
    const result = Units.fromSlug(unitSlug);
    if (result != undefined)
        return result.name;

    return unitSlug;
}

/**
 * Converts StoreItemFamily to its string representation
 * */
export function SItemFamilyText(f: StoreItemFamily): string {
    switch (f) {
        case StoreItemFamily.TradeItem: return 'Trade Item'
        case StoreItemFamily.SelfBrand: return 'Self Branded'

        default: return "--" // Unreachable
    }
}

export function SItemAttrListText(item: IStoreItem) {
    const attrs = item.attributes;

    if (attrs.length == 0)
        return "-none-";

    const text: string[] = [];

    for (const a of attrs) {
        text.push(`${a.name}: ${a.value}`);
    }

    return text.join(", ");
}
