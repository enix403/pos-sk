import path from 'path';
import { app } from 'electron';
import { app_name, electron_data_directory_name } from '@/appconfig.json';

app.setName(app_name);

// We will use our own custom data directory and give the default system data directory to
// electron because electron clutters that up with its cache.
// See: https://github.com/electron/electron/issues/8124
app.setPath('userData', path.join(app.getPath('appData'), electron_data_directory_name));

import { configureApplicationPaths, configureAssetsPath } from '@/pathutils';
import { IS_RUNNING_DEV } from '@/utils';
import { initApp } from './boot';

import { logger, initLogging } from '@/logging';

configureApplicationPaths(app.getPath('appData'));
configureAssetsPath(app.isPackaged);

initLogging();

if (IS_RUNNING_DEV) {
    logger.debug("Application is running with NODE_ENV=development. Development features are enabled");
    require('electron-debug')({ showDevTools: false });
}

initApp();
