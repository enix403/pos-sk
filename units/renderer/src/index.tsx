import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppSystem } from './AppSystem';
import { setupDevSystemApi } from './devapi';

import reportWebVitals from 'reportWebVitals';

setupDevSystemApi();

const MOUNT_NODE = document.getElementById('root') as HTMLElement;

ReactDOM.render(
    <React.StrictMode>
      <AppSystem />
    </React.StrictMode>,
    MOUNT_NODE
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
