export class Unit {
    public readonly id: string;
    public readonly slug: string;
    public readonly shortName: string;
    public readonly longName: string;

    private isFrac: boolean = false;;
    private fracName: string;
    private fracParts: number;

    constructor(id: string, slug: string, shortName: string, longName: string) {
        this.id = id;
        this.slug = slug;
        this.shortName = shortName;
        this.longName = longName;
    }

    setFractional(name: string, parts: number): Unit {
        this.isFrac = true;
        this.fracName = name;
        this.fracParts = parts;

        return this;
    }

    isFractional(): boolean { return this.isFrac; }
    getFractionalParts(): number { return this.fracParts; }
    getFractionalName(): string { return this.fracName; }
    isPiece(): boolean { return this.id == "#pc"; }
}

export interface PackedQuantity {
    base: number;
    fractional: number;
    unitId: string;
}

export class Quantity {
    constructor(
        public readonly unit: Unit,
        public base: number,
        public fractional: number,
    ) { }

    static fromPacked(packed: PackedQuantity): Quantity | null {
        let unit = Units.fromId(packed.unitId);
        if (unit == null)
            return null;

        return new Quantity(unit, packed.base, packed.fractional);
    }

    clone_unit(): Quantity {
        return new Quantity(this.unit, 0, 0);
    }

    absoluteValue(): number {
        let value = this.base;
        if (this.unit.isFractional())
            value += Math.max(0, this.fractional) / this.unit.getFractionalParts();

        return value;
    }

    effectiveValue(): number {
        let value = this.base;
        if (this.unit.isFractional()) {
            value *= this.unit.getFractionalParts()
            value += Math.max(0, this.fractional);
        }

        return value;
    }

    setEffectiveVal(v: number): Quantity {
        v = Math.max(0, v);
        if (this.unit.isFractional()) {
            let parts = this.unit.getFractionalParts();
            this.base = Math.floor(v / parts);
            this.fractional = Math.floor(v % parts);
        }
        else {
            this.base = v;
        }

        return this;
    }

    applyPrice(price: number): number {
        let parts = this.unit.getFractionalParts();
        let fracContribution = !this.unit.isFractional() ? 0 : this.fractional / parts;
        return price * (this.base + fracContribution);
    }

    pack(): PackedQuantity {
        return {
            base: this.base,
            fractional: this.fractional,
            unitId: this.unit.id
        }
    }
}

export namespace Units {
    export const PIECE_UNIT = new Unit("#pc", "pc", "PCs", "Pieces");
    const _all = [
        PIECE_UNIT,
        new Unit("#kg", "kg", "Kg", "Kilogram").setFractional("gm", 1000)
    ];
    export function all(): Readonly<Unit[]> { return _all; }

    export function fromSlug(s: string): Unit | null {
        return _all.find(u => u.slug == s) || null;
    }
    export function fromId(id: string): Unit | null {
        return _all.find(u => u.id == id) || null;
    }
};