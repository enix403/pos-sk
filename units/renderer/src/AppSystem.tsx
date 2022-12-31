import React from 'react';

import { ScreenClassProvider, setConfiguration as setGridConfiguration } from 'react-grid-system';

import { Sidebar } from './components/Sidebar';
import { StatusBar } from './components/StatusBar';

import { Router } from 'react-router-dom';
import { history } from './routing/history'
import { AppRouter } from './routing/approuter';

import { renderApp } from './AppBase';

setGridConfiguration({
  gridColumns: 24,
  gutterWidth: 20,
  maxScreenClass: 'xxl'
});

const AppSystem = () => {
  return (
    <ScreenClassProvider>
      <Router history={history}>
        <Sidebar />
        <AppRouter />
        <StatusBar />
      </Router>
    </ScreenClassProvider>
  );
};

renderApp(<AppSystem />);
