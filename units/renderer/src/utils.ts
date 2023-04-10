import React from 'react';

import type { ChannelResponse } from '@shared/communication/interfaces';
import { CommResultType } from '@shared/communication/constants';
import { AppToaster } from './toaster';

// The below if-checks are used A LOT in the application
// So they are wrapped in their own tiny functions for convenience

export const isResponseFatalError = (response: ChannelResponse<any>) =>
    response.type == CommResultType.SystemError ||
    response.type == CommResultType.CommunicationError

export const isResponseChannelError = (response: ChannelResponse<any>) =>
    response.type == CommResultType.ChannelError;

export const isResponseSuccessful = (response: ChannelResponse<any>) =>
    response.type == CommResultType.ChannelResponse;


// Can't really show 'Cannot access property "name" of undefined' to the user....
const SYS_ERROR_MESSAGE = 'A system error has occured. Please see the logs and contact tech support';

export const formatResponseErrorUser = (response: ChannelResponse<any>): string => {
    if (isResponseFatalError(response))
        return SYS_ERROR_MESSAGE;
    else
        return response.error || 'An error occured [ERR_CHANNEL_ERROR]';
}
/*
const LOG_ERROR_MESSAGES = {
    [CommResultType.CommunicationError]: "CommunicationError: A communication error has occured",
    [CommResultType.SystemError]: "SystemError: A system error has occured",
    [CommResultType.ChannelError]: "ChannelError: A channel error occured",
};
 */
const LOG_ERROR_MESSAGES = {
    [CommResultType.CommunicationError]: "CommunicationError",
    [CommResultType.SystemError]: "SystemError",
    [CommResultType.ChannelError]: "ChannelError",
};


export const formatResponseErrorLog = (response: ChannelResponse<any>): string => {
    return (LOG_ERROR_MESSAGES[response.type] || "formatResponseErrorLog()") + ": " + response.error;
}
// LOG_ERROR_MESSAGES[response.type]

export const simpleErrorAlert = (message: string) => {
    AppToaster.show({
        intent: 'danger',
        message: message,
        icon: 'error'
    });
};
export const simpleSuccessAlert = (message: any) => {
    AppToaster.show({
        icon: "build",
        message,
        intent: "success"
    });
};


// Hehe :)
export function blurAllInputs() {
    var tmp = document.createElement("input");
    document.body.appendChild(tmp);
    tmp.focus();
    document.body.removeChild(tmp);
}


type MessageResponseCallback<K> = (response: ChannelResponse<K>) => void

export function createMessageCallback<K>(callback: MessageResponseCallback<K>) {
    return React.useCallback(callback, []);
}
