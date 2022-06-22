import { Identified } from '../tsutils';
import { ITradeItem } from '../contracts/ITradeItem';
import { Message } from './interfaces';
import { InventoryItemType } from '@shared/contracts/InventoryItemType';
import { IInventoryRecord } from '@shared/contracts/IInventoryRecord';

abstract class SimpleMessage<T, K> extends Message<T, K> {
    constructor(payload: T) {
        super();
        this.payload = payload;
    }
}

export interface SimpleMessageFactory<T, K> {
    new(payload: T): SimpleMessage<T, K>;
};

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
                item_type: InventoryItemType = InventoryItemType.Trade /* Temporary default value */
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
