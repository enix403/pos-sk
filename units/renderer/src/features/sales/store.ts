import { createContext } from 'react'
import { makeAutoObservable, makeObservable, observable } from 'mobx'

import type { Identified } from '@shared/tsutils'
import type { IStoreItem } from '@shared/contracts/IStoreItem'
import { SaleMethod } from '@shared/contracts/ISale'

import { DUMMY_ITEMS } from './temp_items'
import type { CustomerResource } from './CreditCustomerSelect';

type ItemResource = Identified<IStoreItem>;

export class CartItem {
    store: CartStore
    itemResource: ItemResource;
    quantity: number;
    price: number;

    constructor(store: CartStore, item: ItemResource) {
        this.store = store;
        this.itemResource = item;
        this.price = item.retail_price;
        this.quantity = 1;

        makeAutoObservable(this, {
            store: false,
            itemResource: false
        });
    }

    setQuantity(qty: number) {
        if (!isNaN(qty))
            this.quantity = Math.floor(qty);
    }

    quantityInc() {
        ++this.quantity;
    }

    quantityDec() {
        if (this.quantity > 1)
            --this.quantity;
    }

    remove() {
        this.store.removeItem(this);
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
    InvalidQuantity,
    InvalidDiscount,
    InsufficientCash,
    CustomerNotSelected
}

class CartStore {
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

        makeAutoObservable(this);
    }

    addItem(storeItem: ItemResource) {
        let old = this.items.find(t => t.itemResource.id == storeItem.id);
        if (!old)
            this.items.push(new CartItem(this, storeItem));
        else
            old.quantity++;
    }

    removeItem(item: CartItem) {
        let index = this.items.findIndex(t => t.itemResource.id == item.itemResource.id);
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
        return this.items.reduce((acc, item) => acc + item.quantity, 0);
    }

    get billAmount(): number {
        return this.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
    }

    get payable(): number {
        return this.billAmount - this.discount;
    }

    get cashChange(): number {
        return this.amountPaid - this.payable;
    }

    get health(): CartHealth {

        if (this.items.some(itm => itm.quantity <= 0))
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
        switch (this.health) {
            case CartHealth.Ok: return 'OK';
            case CartHealth.InvalidQuantity: return 'Some item(s) have invalid specified quantity';
            case CartHealth.InvalidDiscount: return 'Invalid Discount';
            case CartHealth.InsufficientCash: return 'Insufficient Cash';
            case CartHealth.CustomerNotSelected: return 'Customer Not Selected';
        }
    }
}

export const cartStore = new CartStore();
// @ts-ignore
window.store = cartStore;
// @ts-ignore
window.di = DUMMY_ITEMS;


cartStore.addItem(DUMMY_ITEMS[0]);
cartStore.addItem(DUMMY_ITEMS[0]);
cartStore.addItem(DUMMY_ITEMS[1]);
cartStore.addItem(DUMMY_ITEMS[2]);
cartStore.addItem(DUMMY_ITEMS[2]);
cartStore.addItem(DUMMY_ITEMS[1]);
cartStore.addItem(DUMMY_ITEMS[3]);
cartStore.addItem(DUMMY_ITEMS[0]);


export const CartStoreContext = createContext<CartStore | undefined>(undefined);
