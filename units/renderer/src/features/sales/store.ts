import { createContext } from 'react'
import { makeAutoObservable, makeObservable, observable } from 'mobx'

import type { Identified } from '@shared/tsutils'
import type { IStoreItem } from '@shared/contracts/IStoreItem'
import { SaleMethod } from '@shared/contracts/ISale'

import { DUMMY_ITEMS } from './temp_items'

type ItemResource = Identified<IStoreItem>;

export class CartItem {
    itemResource: ItemResource;
    quantity: number;
    store: CartStore

    constructor(store: CartStore, item: ItemResource) {
        this.store = store;
        this.itemResource = item;
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

class CartStore {
    items: Array<CartItem>;

    constructor() {
        this.items = [];

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

    get itemCount() {
        return this.items.reduce((acc, item) => acc + item.quantity, 0);
    }
}


export const cartStore = new CartStore();
// @ts-ignore
window.store = cartStore;
// @ts-ignore
window.di = DUMMY_ITEMS;

export const CartStoreContext = createContext<CartStore | undefined>(undefined);
