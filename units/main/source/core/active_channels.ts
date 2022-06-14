import { RequestBridge } from '@/channel';

import { StockChannel } from './StockChannel';

export const resolverBridge = new RequestBridge()
    .listenOnChannels([
        new StockChannel()
    ])
