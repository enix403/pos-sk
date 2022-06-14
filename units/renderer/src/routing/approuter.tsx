import * as React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { appRoutes, devAppRoutes } from './route_list';

import { NotFoundView } from '@/components/NotFoundView';

import { HomeView } from '@/features/home/HomeView'
import { ManageTradeItems } from '@/features/stock/ManageTradeItems'

import { ScratchPlace } from '@/features/_scratch/scratch-place';

export const AppRouter: React.FC<{}> = React.memo(_ => {
    return (
        <React.Fragment>
            <Switch>
                <Redirect exact from="/" to={appRoutes.home.path} />

                <Route path={appRoutes.home.path} component={HomeView} />
                <Route path={appRoutes.stock.tradeItems.path} component={ManageTradeItems} />

                <Route path={devAppRoutes.scratch.path} component={ScratchPlace} />

                <Route component={NotFoundView} />
            </Switch>
        </React.Fragment>
    );
});
