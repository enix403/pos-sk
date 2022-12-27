import type { ChannelResponse, Message } from './communication'

// This API is here in shared code instead of the renderer unit because
// preload.ts (from the main unit) needs access to this API

export interface ISystemBackendAPI {
    sendPlainMessage(
        message: any
    ): Promise<ChannelResponse<any>>;

    sendMessage<K>(
        message: Message<any, K>
    ): Promise<ChannelResponse<K>>;
}
