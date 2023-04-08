process.env.NODE_ENV = 'development';

import { configureApplicationPaths } from '@/pathutils';
import { createDBConnection, EnttManager, EFORK } from '@/database';
import { initLogging, logger } from '@/logging';
import { Customer } from '@/entities';

let em: EnttManager;

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
}

async function main() {
    configureApplicationPaths(null, false);
    initLogging();

    logger.debug("Connecting to database");
    await createDBConnection();

    em = EFORK();

    await seedCustomers();
}

main()
