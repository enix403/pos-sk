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

export class MsgDispatch<T, K>
{
    constructor(
        public readonly msgKlass: MessageFactory<T, K>,
        public readonly handler: MessageHandler<Message<T, K>>
    ) {}
}

export class IpcChannel {
    private handlers: HMap = {};

    public getHandlers = () => this.handlers;

    public async onStart(): Promise<void> {}

    protected register<T, K>(
        dispatch: MsgDispatch<T, K>
    ): void {
        const actionName = (dispatch.msgKlass as any as typeof Message).ACTION_NAME;
        this.handlers[actionName] = dispatch.handler.bind(this);
    }
}

export class RequestBridge {
    private handlers: HMap = {};
    private channels: IpcChannel[];

    public listenOnChannels(channels: IpcChannel[]) {
        this.channels = channels;
        this.handlers = Object.assign({}, ...channels.map(c => c.getHandlers()))
        return this;
    }

    public async onStart() {
        for (let i = 0; i < this.channels.length; ++i) {
            await this.channels[i].onStart();
        }
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
