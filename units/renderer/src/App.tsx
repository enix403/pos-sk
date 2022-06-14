import React from 'react';

import './App.scss';

import { Sidebar } from './components/Sidebar';
import { StatusBar } from './components/StatusBar';

import { Router } from 'react-router-dom';
import { history } from './routing/history'
import { AppRouter } from './routing/approuter';

export const App = () => {
    return (
        <Router history={history}>
            <Sidebar />
            <AppRouter />
            <StatusBar />
        </Router>
    );
};
