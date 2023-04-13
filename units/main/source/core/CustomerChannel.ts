import { IpcChannel, MsgDispatch } from "@/channel";

import { MSG } from "@shared/communication";

import { EFORK } from "@/database";
import {
    Customer,
} from '@/entities';
import { ChannelError } from "@/channel/exceptions";

export class CustomerChannel extends IpcChannel {
    constructor() {
        super();
        this.register(this.addCustomer);
        this.register(this.getCustomers);
    }

    private addCustomer = new MsgDispatch(MSG.Customer.AddCustomer, async ({ name }) => {
        const em = EFORK();

        if (!name)
            throw new ChannelError("Name must not be empty");

        const cust = em.create(Customer, {
            name,
            total_payable: 0
        });

        await em.persistAndFlush(cust);
    });

    private getCustomers = new MsgDispatch(MSG.Customer.GetCustomers, async () => {
        return EFORK().find(Customer, {});
    });
}
