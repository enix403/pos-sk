import { ChannelError } from './exceptions';
import { CommResultType } from "@shared/communication"

import type {
    Message,
    MessageFactory,
    ChannelResponse,
    SerializedMessage,
    ExtractMsgPayload,
    ExtractMsgResult
} from '@shared/communication';

import { logger } from '@/logging';

type HMap = Record<string, MessageHandler<Message<any, any>>>;
export type MessageHandler<M extends Message<any, any>> = (payload: ExtractMsgPayload<M>) => Promise<ExtractMsgResult<M>>

export class IpcChannel {
    private handlers: HMap = {};

    public getHandlers = () => this.handlers;

    protected register<T, K>(
        factory: MessageFactory<T, K>,
        handler: (payload: T) => Promise<K>
    ): void {
        const actionName = (factory as any as typeof Message).ACTION_NAME;
        this.handlers[actionName] = handler.bind(this);
    }
}

export class RequestBridge {
    private handlers: HMap = {};

    public listenOnChannels(channels: IpcChannel[]) {
        this.handlers = Object.assign({}, ...channels.map(c => c.getHandlers()))
        return this;
    }

    async handle(message: SerializedMessage<any> | void) {
        if (!message)
            throw new Error("Invalid message.");

        const reg = this.handlers[message.action || ''];

        if (reg)
            return reg(message.payload || {});

        throw new Error("Invalid action.");
    }


    async execute(
        message: object
    ): Promise<ChannelResponse> {
        try {
            return {
                type: CommResultType.ChannelResponse,
                // @ts-ignore
                data: await this.handle(message)
            };
        }
        catch (err: any) {
            if (err instanceof ChannelError) {
                return {
                    type: CommResultType.ChannelError,
                    error: err.message
                };
            }
            logger.error("RequestBridge::execute => SysError: %s", err.message);
            return { type: CommResultType.SystemError };
        }
    }
}
