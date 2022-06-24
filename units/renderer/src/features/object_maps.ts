import { IStoreItem, StoreItemFamily, availableUnits } from '@shared/contracts/IStoreItem';

export function SItemUnitText(unitSlug: string): string {
    const result = availableUnits.find(unit => unit.slug == unitSlug);
    if (result != undefined)
        return result.title;

    return unitSlug;
}

export function SItemFamilyText(f: StoreItemFamily): string {
    switch(f) {
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
