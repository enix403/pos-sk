import path from "path";
import { URL } from 'url';

import { BrowserWindow, shell } from "electron";
import { IS_RUNNING_DEV } from '@/utils';
import { logger } from '@/logging';

import {
    RP_BUILD_COMPILED_MAIN,
    RP_BUILD_COMPILED_RENDERER
} from '@shared/app_paths';

import {
    default_win_title
} from '@/appconfig.json';

export let mainWindow: BrowserWindow | null = null;

const getPreloadScriptPath = (): string => {
    let preloadName: string;
    if (process.env.BUNDLE_COMPILED === 'yes')
        // the string below will be replaced by the build system with the actual preload file name
        preloadName = '#__APP_PRE_COMPILED_PRELOAD_SCRIPT_NAME__#';
    else
        preloadName = path.join('..', 'preload_mask.js');

    return path.join(__dirname, preloadName);
}

export const createWindow = async () => {
    mainWindow = new BrowserWindow({
        show: false,
        width: 1024,
        height: 728,
        title: default_win_title,
        backgroundColor: '#fff',
        webPreferences: {
            nodeIntegration: false,
            preload: getPreloadScriptPath(),
            devTools: IS_RUNNING_DEV
        },
    });

    mainWindow.loadURL(resolveHtmlPath("index.html"));


    mainWindow.webContents.on("did-finish-load", () => {
        if (!mainWindow) {
            throw new Error('"mainWindow" is not defined');
        }
        mainWindow.show();
        mainWindow.focus();
    });

    mainWindow.on('page-title-updated', (evt) => {
        evt.preventDefault();
    });

    mainWindow.on("closed", () => {
        logger.debug("Main window closed");
        mainWindow = null;
    });

    // Open urls in the user's browser
    mainWindow.webContents.on("new-window", (event, url) => {
        event.preventDefault();
        shell.openExternal(url);
    });
};

export const recreateWindow = () => {
    if (mainWindow === null) {
        createWindow();
    }
};



function resolveHtmlPath(htmlFileName: string): string {
    if (IS_RUNNING_DEV) {
        const port = process.env.FRONTEND_PORT;

        if (!port) {
            logger.error("No FRONTEND_PORT specified. Cannot connect to frontend server");
            process.exit(1);
        }

        const url = new URL(`http://localhost:${port}`);
        url.pathname = htmlFileName;
        return url.href;
    }

    const filepath = path.resolve(
        __dirname,
        path.relative(RP_BUILD_COMPILED_MAIN, RP_BUILD_COMPILED_RENDERER),
        htmlFileName
    )
    return `file://${filepath}`;

}
