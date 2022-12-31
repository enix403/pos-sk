import './AppBase.scss';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { setupDevSystemApi } from './devapi';

import reportWebVitals from 'reportWebVitals';

export function renderApp(app: JSX.Element, containerID = 'root') {
  setupDevSystemApi();

  const MOUNT_NODE = document.getElementById(containerID) as HTMLElement;

  ReactDOM.render(
      <React.StrictMode>
        {app}
      </React.StrictMode>,
      MOUNT_NODE
  );

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals();
}
