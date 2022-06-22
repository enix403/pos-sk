import { Identified } from '../tsutils';
import { Message } from './interfaces';
// import { ITradeItem } from '../contracts/ITradeItem';
// import { InventoryItemType } from '@shared/contracts/InventoryItemType';
// import { IInventoryRecord } from '@shared/contracts/IInventoryRecord';
import { IStoreItem } from '../contracts/IStoreItem';
import { IStockUpdatePayload } from '@shared/contracts/IStockUpdate';

abstract class SimpleMessage<T, K> extends Message<T, K> {
    constructor(payload: T) {
        super();
        this.payload = payload;
    }
}

export interface SimpleMessageFactory<T, K> {
    new(payload: T): SimpleMessage<T, K>;
};
/*
export namespace AllMessages {
    export namespace Stock {
        export class CreateTradeItem
            extends SimpleMessage<ITradeItem, Identified<ITradeItem>>
        { static ACTION_NAME = 'stk:ti:create'; }

        export class GetTradeItems
            extends SimpleMessage<void, Array<Identified<ITradeItem>>>
        { static ACTION_NAME = 'stk:ti:list'; }


        interface UpdatePayload {
            inventory_item_handle: number;
            delta_units: number;
            description: string;
            item_type: InventoryItemType;
        }
        export class Update extends Message<UpdatePayload, void> {
            static ACTION_NAME = "stk:inv:update";
            constructor(
                handle: number,
                delta: number,
                desc: string,
                item_type: InventoryItemType = InventoryItemType.Trade // Temporary default value
            ) {
                super();
                this.payload = { inventory_item_handle: handle, delta_units: delta, description: desc, item_type };
            }
        }

        export class GetInventory
            extends SimpleMessage<void, Array<IInventoryRecord>>
        { static ACTION_NAME = 'stk:inv:list'; }
    }
};
*/

export namespace MSG {
    export namespace Stock {
        export class GetStoreItems extends SimpleMessage<void, Array<Identified<IStoreItem>>> { static ACTION_NAME = 'stk:itm:list'; }

        export class CreatetStoreItem
            extends SimpleMessage<IStoreItem, Identified<IStoreItem>>
        { static ACTION_NAME = 'stk:itm:create'; }

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
    }
}
