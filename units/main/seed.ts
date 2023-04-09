process.env.NODE_ENV = 'development';

import { configureApplicationPaths } from '@/pathutils';
import { createDBConnection, EnttManager, EFORK } from '@/database';
import { initLogging, logger } from '@/logging';
import { Customer, StoreItem } from '@/entities';
import { RequestBridge } from '@/channel';
import { resolverBridge } from '@/core/active_channels';
import { Message, MSG } from '@shared/communication';
import { StoreItemFamily } from '@shared/contracts/IStoreItem';
import { Unit, Units } from '@shared/contracts/unit';

let em: EnttManager;

function exe(msg: any): any {
    return resolverBridge.execute(Message.serialize(msg));
}

async function seedCustomers() {

    let res: Customer[] = [];

    res.push(em.create(Customer, { name: "Customer 1", total_payable: 0 }));
    res.push(em.create(Customer, { name: "Customer 2", total_payable: 0 }));
    res.push(em.create(Customer, { name: "Customer 3", total_payable: 0 }));
    res.push(em.create(Customer, { name: "Customer 4", total_payable: 0 }));
    res.push(em.create(Customer, { name: "Customer 5", total_payable: 0 }));
    res.push(em.create(Customer, { name: "Customer 6", total_payable: 0 }));

    res.forEach(c => em.persist(c));

    await em.flush();

    exe(new MSG.Stock.CreateStoreItem({
        pcode: "111111111111",
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
    configureApplicationPaths(null, false);
    initLogging();

    logger.debug("Connecting to database");
    await createDBConnection();

    await resolverBridge.onStart();
    em = EFORK();

    await seedCustomers();
}

main()
