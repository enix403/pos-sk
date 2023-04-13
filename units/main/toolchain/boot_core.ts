process.env.NODE_ENV = 'development';

import { configureApplicationPaths } from '@/pathutils';
import { createDBConnection } from '@/database';
import { initLogging, logger } from '@/logging';
import { resolverBridge } from '@/core/active_channels';
import { ChannelResponse, CommResultType, Message } from '@shared/communication';

export function sendMessage<T, K>(msg: Message<T, K>): Promise<ChannelResponse<K>> {
    return resolverBridge.execute(Message.serialize(msg));
}

export async function assertSendMessage<T, K>(msg: Message<T, K>): Promise<ChannelResponse<K>> {
    let res = await sendMessage(msg);

    if (res.type != CommResultType.ChannelResponse) {
        logger.error("assertSendMessage(): " + (res.error || ""));
        process.exit(1);
    }

    return res;
}

export async function bootCore() {
    configureApplicationPaths(null, false);
    initLogging();

    logger.debug("Connecting to database");
    await createDBConnection();

    await resolverBridge.onStart();
}

