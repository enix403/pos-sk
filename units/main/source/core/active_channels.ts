import { RequestBridge } from '@/channel';

import { StockChannel } from './StockChannel';
import { SaleChannel } from './SaleChannel';
import { CustomerChannel } from './CustomerChannel';

export const resolverBridge = new RequestBridge()
    .listenOnChannels([
        new StockChannel(),
        new SaleChannel(),
        new CustomerChannel(),
    ])
