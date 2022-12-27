import { Reference } from '@mikro-orm/core';
import { IpcChannel, MsgDispatch } from "@/channel";

import { MSG } from "@shared/communication";

import { EFORK } from "@/database";
import {
    Customer,
} from '@/entities';

import { sleep } from '@shared/commonutils'
import { logger } from '@/logging'

import { Sale, SaleItem } from '@/entities'

export class CustomerChannel extends IpcChannel {
    constructor() {
        super();
        this.register(this.addCustomer);
    }

    private addCustomer = new MsgDispatch(MSG.Customer.AddCustomer, async ({ name }) => {
        const em = EFORK();
        const cust = em.create(Customer, {
            name,
            total_payable: 0
        });

        await em.persistAndFlush(cust);
    });
}
