import {
    ChannelResponse,
    Message,
} from '@shared/communication'
import { isResponseSuccessful, formatResponseErrorLog } from '@/utils';


export namespace MessageTracker {
    export type State = {
        loading: boolean;
    };
    export type ResponseHandler<K> = (response: ChannelResponse<K> | null, msgState: State) => void;
    export type HandlerAlias<T> = T extends MessageTracker<any, infer K> ? ResponseHandler<K> : never;
    export type FromFactory<F> = F extends Message<infer T, infer K> ? MessageTracker<T, K> : never;
}
export class MessageTracker<T = any, K = any>
{
    private currentState: MessageTracker.State;
    private responseFunc: MessageTracker.ResponseHandler<K>;
    private message: Message<T, K> | null;

    constructor(message?: Message<T, K>) {
        this.message = message ?? null;
        this.currentState = {
            loading: false
        }
    }

    public getState() {
        return this.currentState;
    }

    private handleResponse = (res: ChannelResponse<K>) => {
        this.currentState.loading = false;
        if (!isResponseSuccessful(res)) {
            console.error("MessageTracker::handleResponse(): Failed to complete message:", formatResponseErrorLog(res));
        }
        this.responseFunc(res, this.currentState);
    }

    public setMessage(message: Message<T, K>) {
        this.message = message;
    }

    public sendMessage() {
        this.currentState.loading = true;
        this.responseFunc(null, this.currentState);
        window.SystemBackend.sendMessage(this.message!).then(this.handleResponse);
    }

    public watch(func: MessageTracker.ResponseHandler<K>, init = true) {
        this.responseFunc = func;
        if (init)
            this.sendMessage();
    }

    public static empty<M extends Message>(): MessageTracker.FromFactory<M> {
        return new MessageTracker() as any;
    }
}
