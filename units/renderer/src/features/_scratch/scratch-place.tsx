import { Card } from '@blueprintjs/core';
import { NavPageView } from '@/layout/views';

import { MyTable } from './table-example';

export const ScratchPlace = () => {
    return (
        <NavPageView title="Manage Customers">
            <Card elevation={2} style={{ margin: "15px 25px" }}>
                <MyTable />
                {/*<div style={{ margin: "15px 0" }}>*/}
                {/*</div>*/}
            </Card>
        </NavPageView>
    );
};
