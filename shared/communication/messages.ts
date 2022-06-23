// @ts-nocheck
// This file contains a lot of complex typechecking that slows down my text editor :)

import { Identified } from '../tsutils';
import { Message } from './interfaces';
import { IStoreItem } from '../contracts/IStoreItem';
import { IStockUpdatePayload } from '@shared/contracts/IStockUpdate';
import { IItemStock } from '@shared/contracts/IItemStock';

abstract class SimpleMessage<T, K> extends Message<T, K> {
    constructor(payload: T) {
        super();
        this.payload = payload;
    }
}

export namespace MSG {

    export class Dummy extends SimpleMessage<any, any>
    { static ACTION_NAME = "msg::demo" }

    export namespace Stock {

        /* =========================== */

        export class GetStoreItems extends SimpleMessage<void, Array<Identified<IStoreItem>>> { static ACTION_NAME = 'stk:itm:list'; }

        /* =========================== */

        export class CreateStoreItem
            extends SimpleMessage<IStoreItem, Identified<IStoreItem>>
        { static ACTION_NAME = 'stk:itm:create'; }

        /* =========================== */

        interface UpdateStockCapture {
            store_item_id: number;
            body: IStockUpdatePayload;
        }

        export class UpdateStock extends Message<UpdateStockCapture, void> {
            static ACTION_NAME = 'stk:itm:update';
            constructor(storeItem: Identified<Partial<IStoreItem>>, payload: IStockUpdatePayload) {
                super();
                this.payload = { store_item_id: storeItem.id, body: payload };
            }
        }

        /* =========================== */

        export class GetStocks extends SimpleMessage<void, Array<Identified<IItemStock>>>
        { static ACTION_NAME = 'stk:list'; }
    }

    /* ============================================ */
    /* ============================================ */

    export namespace Sale {

        /* =========================== */

        namespace CreateSaleX {
            export interface MetaData {
                customer_name: string | null;
                amount_paid: number;
            }
            export interface CartItem {
                item: Identified<Partial<IStoreItem>>,
                unit_count: number;
            }

            export interface Capture { cart: CartItem[], metadata: MetaData };
        }

        export class CreateSale extends Message<CreateSaleX.Capture, void> {
            static ACTION_NAME = "sale:new";
            constructor(cart: CreateSaleX.CartItem[], metadata: CreateSaleX.MetaData) {
                super();
                this.payload = { cart, metadata };
            }
        }

        /* =========================== */
    }

    /* ============================================ */
    /* ============================================ */

}
