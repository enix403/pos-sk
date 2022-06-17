import React, { useEffect, useState, useCallback } from 'react';
import type { UnpackedCollection } from '@shared/tsutils';
import {
    ChannelResponse,
    Message,
} from '@shared/communication';
import { formatResponseErrorLog, isResponseSuccessful } from '@/utils';

// Use wisely. This hook only more like a helper for development when you'd want to re-fetch
// some data from api insteads of reloading page
export function useRefreshableEffect(callback: React.EffectCallback, deps: React.DependencyList) {
    const [updateCount, setUpdateCount] = useState(0);
    useEffect(callback, deps.concat([updateCount]));

    return useCallback(() => setUpdateCount(c => (c + 1) % 15), []);
}

export function useTrackedEffectFunc(
    callback: () => Promise<any>,
    blockWhileLoading: boolean = true
) {
    const [loading, setIsLoading] = React.useState(false);

    const effectFunc = () => {
        if (blockWhileLoading && loading)
            return

        setIsLoading(true);

        callback().finally(() => setIsLoading(false));
    };

    return [effectFunc, loading] as const;
};

export function useMessageEffect<T, K>(
    message: Message<T, K>,
    onLoad?: (data: K) => void,
    isResultArray?: boolean
) {
    const initialValue = !isResultArray ? undefined : [] as any;

    // const [data, setData] = React.useState<K | undefined>(initialValue);

    const [effectObj, loading] = useTrackedEffectFunc(async () => {
        // setData(initialValue);

        return window.SystemBackend.sendMessage(message)
            .then(res => {
                if (isResponseSuccessful(res)) {
                    // setData(res.data!);
                    onLoad?.(res.data!);
                }
                else {
                    // setData(initialValue);
                    onLoad?.(initialValue);
                    console.error("Failed to send message:", formatResponseErrorLog(res));
                }
            })
    });

    const refreshData = useRefreshableEffect(effectObj, []);

    // return [data, loading, refreshData] as const;
    return [loading, refreshData] as const;
}

export function useAppMessage<K>(
    message: Message<any, K>,
    onResponse: (response: ChannelResponse<K>) => void
) {

    const memCallback = React.useCallback(onResponse, []);

    const [effectObj, loading] = useTrackedEffectFunc(async () => {
        return window.SystemBackend.sendMessage(message)
            .then(res => {
                if (!isResponseSuccessful(res)) {
                    console.error("useAppMessage(): Failed to send message:", formatResponseErrorLog(res));
                }
                memCallback(res);
            })
    });

    const refresh = useRefreshableEffect(effectObj, []);
    return [loading, refresh] as const;
}
