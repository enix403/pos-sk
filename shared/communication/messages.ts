// @ts-nocheck
// This file contains a lot of complex typechecking that slows down my text editor :)

import { Identified } from '../tsutils';
import { Message } from './interfaces';
import { IStoreItem } from '../contracts/IStoreItem';
import { IStockUpdatePayload } from '@shared/contracts/IStockUpdate';
import { IItemStock } from '@shared/contracts/IItemStock';
import { SaleMethod } from '@shared/contracts/ISale';

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
            export interface Capture {
                meta: {
                    method: SaleMethod,
                    customer_id: number | null, /* TODO: Devise a proper mechanism for transferring ids of entities */
                    amount_paid: number
                };
                cart: CartItems[];
            };
        };

        export class CreateSale extends SimpleMessage<CreateSaleX.Capture, void>
        { static ACTION_NAME = "sale:new"; }

        /* =========================== */
    }

    /* ============================================ */
    /* ============================================ */

    export namespace Customer {
        export class AddCustomer extends SimpleMessage<{ name: string }, void>
        { static ACTION_NAME = 'cust:add'; }
    }

    /* ============================================ */
    /* ============================================ */

}
