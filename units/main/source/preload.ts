import { contextBridge, ipcRenderer } from 'electron';

import { Message, CommResultType } from '@shared/communication';

import type { ISystemBackendAPI } from '@shared/system_api';
import type { ChannelResponse } from '@shared/communication';

import { ELECTRON_COMM_CHANNEL_NAME } from './electron-main/info'

async function _sendPlainMessage(message: any): Promise<ChannelResponse<any>> {
    try {
        return await ipcRenderer.invoke(ELECTRON_COMM_CHANNEL_NAME, message);
    }
    catch (e) {
        console.error("CommunicationError:", "Electron IPC communication error");
        return { type: CommResultType.CommunicationError };
    }
}

const electronBackendApi: ISystemBackendAPI = {
    sendPlainMessage: _sendPlainMessage,
    sendMessage: (message) =>
        _sendPlainMessage(Message.serialize(message))
};

contextBridge.exposeInMainWorld('SystemBackend', electronBackendApi);
