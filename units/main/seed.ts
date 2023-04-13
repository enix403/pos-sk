process.env.NODE_ENV = 'development';

import { EnttManager, EFORK } from '@/database';
import { Customer } from '@/entities';
import { MSG } from '@shared/communication';
import { StoreItemFamily } from '@shared/contracts/IStoreItem';
import { Units } from '@shared/contracts/unit';

import { assertSendMessage, bootCore, sendMessage } from './toolchain/boot_core';

let em: EnttManager;

async function seedCustomers() {

    await assertSendMessage(new MSG.Customer.AddCustomer({ name: "Customer 1" }));
    await assertSendMessage(new MSG.Customer.AddCustomer({ name: "Customer 2" }));
    await assertSendMessage(new MSG.Customer.AddCustomer({ name: "Customer 3" }));
    await assertSendMessage(new MSG.Customer.AddCustomer({ name: "Customer 4" }));
    await assertSendMessage(new MSG.Customer.AddCustomer({ name: "Customer 5" }));
    await assertSendMessage(new MSG.Customer.AddCustomer({ name: "Customer 6" }));

    await assertSendMessage(new MSG.Stock.CreateStoreItem({
        pcode: "111",
        pcode_std: 'upc',
        family: StoreItemFamily.TradeItem,
        name: "Wheat",
        description: "",
        unit: Units.fromId("#kg")!.slug,
        cost_price: 170,
        retail_price: 210,
        active: true,
        attributes: []
    }));
}

async function main() {
    await bootCore();
    em = EFORK();
    await seedCustomers();
}

main();
