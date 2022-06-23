import {
    // AppChannel,
    CommResultType,
    MSG,
    Message
} from "@shared/communication";

import type { ChannelResponse } from "@shared/communication";

export function setupDevSystemApi() {
    if (process.env.NODE_ENV !== 'development')
        return

    window['MSG'] = MSG;

    if (window.SystemBackend && typeof window.SystemBackend == 'object')
        return

    const _sendPlainMessage = async (message: any): Promise<ChannelResponse<any>> => {
        try {
            // TODO: get the port out of an env variable instead of hardcoding it
            const rawResponse = await fetch('http://localhost:4201', {
                method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify(message)
            });
            return await rawResponse.json();
        }
        catch (e) {
            console.error("CommunicationError:", "Http request send/receive error", e);
            return { type: CommResultType.CommunicationError };
        }
    }

    window.SystemBackend = {
        sendPlainMessage: _sendPlainMessage,
        sendMessage: (message) =>
            _sendPlainMessage(Message.serialize(message))
    };
}
