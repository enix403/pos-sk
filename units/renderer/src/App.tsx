import React from 'react';

import { ScreenClassProvider, setConfiguration as setGridConfiguration } from 'react-grid-system';

import './App.scss';

import { Sidebar } from './components/Sidebar';
import { StatusBar } from './components/StatusBar';

import { Router } from 'react-router-dom';
import { history } from './routing/history'
import { AppRouter } from './routing/approuter';

setGridConfiguration({
  gridColumns: 24,
  gutterWidth: 20,
  maxScreenClass: 'xxl'
});

export const App = () => {
  return (
    <ScreenClassProvider>
      <Router history={history}>
        {/*<Sidebar />*/}
        <AppRouter />
        {/*<StatusBar />*/}
      </Router>
    </ScreenClassProvider>
  );
};
