import { Identified } from '../tsutils';
import { ITradeItem } from '../contracts/ITradeItem';
import { Message } from './interfaces';

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
    }
};
