import type { CommResultType } from './constants';

export type ChannelResponse<T = any> = {
    type: CommResultType,
    data?: T | undefined,
    error?: string
};

export type SerializedMessage<T> = { action: string; payload: T };

export abstract class Message<T = void, K = void> {
    // This field is here only to make typescript *remember* the given generic argument
    // that is later used for typechecking of message response
    //
    // @ts-ignore
    protected readonly __ResultType!: K;

    // The action name for this message
    //
    // Must be unique across all message classes
    public static readonly ACTION_NAME: string;

    // The above ACTION_NAME static field must be copied into its own non-static field because
    // when any object, including this Message object, is passed through electron preload's
    // contextBridge, it looses its prototype chain. As a result all methods and static members are
    // lost. So any static ACTION_NAME is not availble once this object reaches the electron
    // main process. The static version is also required because some code depends on it.
    public readonly actionName: string;

    // The actual data to send
    public payload: T | null = null;

    constructor() {
        // Copy the static action name into a non-static field to survive prototype loss
        this.actionName = (this.constructor as typeof Message).ACTION_NAME;
    }

    public static serialize<U>(
        message: Message<U, any>
    ): SerializedMessage<U | null> {
        return {
            action: message.actionName,
            payload: message.payload,
        };
    }
};

export interface MessageFactory<T, K> {
    new(...args: any[]): Message<T, K>;
};

export type ExtractMsgPayload<T> = T extends Message<infer R, any> ? R : never;
export type ExtractMsgResult<T> = T extends Message<any, infer R> ? R : never;
