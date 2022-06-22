import { RequestBridge } from '@/channel';

import { StockChannel } from './StockChannel';
import { SaleChannel } from './SaleChannel';

export const resolverBridge = new RequestBridge()
    .listenOnChannels([
        new StockChannel(),
        new SaleChannel()
    ])
