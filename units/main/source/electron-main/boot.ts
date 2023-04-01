import { app, ipcMain } from 'electron';
import {
    createWindow,
    recreateWindow
} from './window';
import { getPath } from '@/pathutils';
import { createDBConnection } from '@/database';

import { logger } from '@/logging';

import { resolverBridge } from '@/core/active_channels'
import { ELECTRON_COMM_CHANNEL_NAME } from './info';

export const initApp = async () => {
    await createDBConnection();

    await resolverBridge.onStart();

    // setup ipc communication channel
    ipcMain.handle(ELECTRON_COMM_CHANNEL_NAME, (_event, arg) => resolverBridge.execute(arg));

    /**
     * Add event listeners...
     */
    app.on("window-all-closed", () => {
        // Respect the OSX convention of having the application in memory even
        // after all windows have been closed
        if (process.platform !== "darwin") {
            app.quit();
            app.exit(0);
        }
    });

    try {
        await app.whenReady();
        logger.info("Application Ready [Electron]");

        logger.info("Asset Path:   %s ", getPath('assets'));
        logger.info("Data Path:    %s ", getPath('data'));
        logger.info("Config Path:  %s ", getPath('config'));
        logger.info("Cache Path:   %s ", getPath('cache'));

        logger.debug("Creating main window");
        createWindow();
    }
    catch (err) {
        logger.error("Unable to start app");
        logger.error(err);
        process.exit(1);
    }

    app.on("activate", () => {
        recreateWindow();
    });
}
