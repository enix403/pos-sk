import { createContext } from 'react'
import { makeAutoObservable, makeObservable, observable } from 'mobx'

import type { Identified } from '@shared/tsutils'
import { ISaleCartItem, SaleMethod } from '@shared/contracts/ISale'
import { IItemStock } from '@shared/contracts/IItemStock'

import { DUMMY_ITEMS } from './temp_items'
import type { CustomerResource } from './CreditCustomerSelect';

import { MessageTracker } from '@/features/MessageTracker';
import { simpleErrorAlert, isResponseSuccessful, formatResponseErrorLog } from '@/utils';
import { MSG } from '@shared/communication';
import { Units, Quantity } from '@shared/contracts/unit'

export type ItemResource = Identified<IItemStock>;

export class CartItem {
    store: CartStore
    itemResource: ItemResource;
    quantity: Quantity;
    price: number;

    constructor(store: CartStore, item: ItemResource) {
        this.store = store;
        this.itemResource = item;
        this.price = item.item.retail_price;

        let unit = Units.fromSlug(item.item.unit);

        if (unit == null) {
            throw new Error(`Unit "${this.rawItem.unit}" not found`);
        }

        this.quantity = new Quantity(unit, 1, 0);
        makeObservable(this.quantity, { base: true, fractional: true });

        makeAutoObservable(this, {
            store: false,
            itemResource: false,
            rawItem: false,
            pack: false,
        });
    }

    get rawItem() {
        return this.itemResource.item;
    }

    setQuantity(qty: number) {
        if (!isNaN(qty))
            this.quantity.base = Math.floor(qty);
    }

    setSubQuantity(qty: number) {
        if (!isNaN(qty))
            this.quantity.fractional = Math.floor(qty);
    }

    get realQuantity(): number {
        return this.quantity.effectiveValue();
    }

    get subtotal(): number {
        return this.quantity.applyPrice(this.price);
    }

    quantityInc() {
        ++this.quantity.base;
    }

    quantityDec() {
        --this.quantity.base;
    }

    remove() {
        this.store.removeItem(this);
    }

    pack(): ISaleCartItem {
        return {
            item_id: this.rawItem.id,
            quantity: this.quantity.pack()
        };
    }
};

export enum POSStage {
    // Cart can be editied, items can be added or removed etc
    Idle,
    // Cart is finalized and non-editable, (possibly) a confirmation window
    // is shown and is awaiting user confirmation
    Checkout,
    // System is busy performing the sale (storing/writing it in system's database)
    PostCheckout
}

// Todo: Make it a bitmask or array to handle more than one errors at a time
export enum CartHealth {
    Ok,
    Empty,
    InvalidQuantity,
    InvalidDiscount,
    InsufficientCash,
    CustomerNotSelected
}

const _gHealthStringMap = {
    [CartHealth.Ok]: "OK",
    [CartHealth.Empty]: "No Items Added",
    [CartHealth.InvalidQuantity]: "Some item(s) have invalid specified quantity",
    [CartHealth.InvalidDiscount]: "Invalid Discount",
    [CartHealth.InsufficientCash]: "Insufficient Cash",
    [CartHealth.CustomerNotSelected]: "Customer Not Selected",
};

export class CartStore {
    stage: POSStage;
    items: Array<CartItem>;

    // Financials/Money
    method: SaleMethod;
    discount: number;
    amountPaid: number;
    customer: CustomerResource | null;

    constructor() {
        this.stage = POSStage.Idle;
        this.items = [];

        this.method = SaleMethod.Direct;
        this.discount = 0;
        this.amountPaid = 0;
        this.customer = null;

        makeAutoObservable(this, {
            healthString: false
        });
    }

    addItem(storeItem: ItemResource) {
        let old = this.items.find(t => t.rawItem.id == storeItem.item.id);
        if (!old)
            this.items.push(new CartItem(this, storeItem));
        else
            old.quantityInc();
    }

    removeItem(item: CartItem) {
        let index = this.items.findIndex(t => t.rawItem.id == item.rawItem.id);
        if (index != -1)
            this.items.splice(index, 1);
    }

    clear() {
        this.items.splice(0, this.items.length);
    }

    setStage(stage: POSStage) {
        this.stage = stage;
    }

    get itemCount(): number {
        return this.items
            .map((t) => {
                let qty = t.quantity;
                let value = qty.effectiveValue();
                if (value == 0)
                    return 0;

                if (qty.unit.isPiece())
                    return value;
                else
                    return 1;
            }).reduce((a, b) => a + b, 0);
    }

    get billAmount(): number {
        return this.items.reduce((acc, item) => acc + item.subtotal, 0);
    }

    get payable(): number {
        return this.billAmount - this.discount;
    }

    get cashChange(): number {
        return this.amountPaid - this.payable;
    }

    get health(): CartHealth {
        if (this.items.length == 0)
            return CartHealth.Empty;

        if (this.items.some(itm => itm.realQuantity <= 0))
            return CartHealth.InvalidQuantity;

        if (this.discount < 0 || this.discount > this.billAmount)
            return CartHealth.InvalidDiscount;

        if (this.method == SaleMethod.Direct) {
            if (this.amountPaid < this.billAmount)
                return CartHealth.InsufficientCash;
        } else {
            if (this.customer == null)
                return CartHealth.CustomerNotSelected
        }

        return CartHealth.Ok;
    }

    get healthString(): string {
        return _gHealthStringMap[this.health];
    }
}

class InventoryStore {
    loading: boolean;
    allItems: ItemResource[];

    constructor() {
        this.allItems = [];
        this.loading = true;
        makeAutoObservable(this, {
            allItems: observable.shallow
        });
    }

    fetchAvailableItems() {
        this.loading = true;
        let _this = this;

        return window.SystemBackend.sendMessage(new MSG.Stock.GetStocks()).then(res => {
            _this.loading = false;

            if (!isResponseSuccessful(res)) {
                console.error("InventoryStore::fetchAvailableItems(): Failed to complete message:", formatResponseErrorLog(res));
                simpleErrorAlert("Could not fetch available items");
                return;
            }

            _this.allItems = res.data!;
        });
    }
};

export async function MakeSale(store: CartStore): Promise<void> {
    console.log("Making sale");
}

export const cartStore = new CartStore();
export const invStore = new InventoryStore();

export const rootStore = {
    cartStore,
    invStore
};

// @ts-ignore
window.cartStore = cartStore;
// @ts-ignore
window.invStore = invStore;
// @ts-ignore
window.di = DUMMY_ITEMS;

export const CartStoreContext = createContext<typeof rootStore | undefined>(undefined);
