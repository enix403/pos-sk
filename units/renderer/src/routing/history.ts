import { createHashHistory } from 'history';

export const history = createHashHistory();
if (process.env.NODE_ENV == 'development')
    window['app_history'] = history;
