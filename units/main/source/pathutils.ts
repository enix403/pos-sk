import path from 'path';
import fs from 'fs';
import { IS_RUNNING_DEV } from './utils';
import { resolveProjectRoot, RP_MAIN_UNIT } from '@shared/app_paths';
import {
    app_data_directory_name
} from '@/appconfig.json';

type PathSpec =
    | 'userData'
    | 'data'
    | 'config'
    | 'cache'
    | 'assets';


type RuntimePathsInfo = {
    userDataDir: string,
    appDataDir: string,
    appConfigDir: string,
    appCacheDir: string,
    assetsPath: string,
};

const getFallbackPathInfo = (): RuntimePathsInfo =>
    ({
        userDataDir: __dirname,
        appCacheDir: __dirname,
        appDataDir: __dirname,
        appConfigDir: __dirname,
        assetsPath: __dirname,
    });

const runtimePaths = getFallbackPathInfo();

function createDirectoryIfNotExists(path: string) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
    }
}

export function configureApplicationPaths(osAppDataRoot: string | null, createMissingFolders = true) {
    /**
      * Use a different and easily accessible userdata directory during development
      *
      * In dev mode: units/main/runtime-dev/SysAppData
      * else in production:
      *      On Linux: $XDG_CONFIG_HOME (Usually ~/.config)
      *      On Windows: %APPDATA%
      *      On MacOs: ~/Library/Application
      * */
    let sysData: string;

    if (IS_RUNNING_DEV) {
        let mainUnitDir: string;

        if (process.env.BUNDLE_COMPILED == 'yes')
            mainUnitDir = path.join(__dirname, '..');
        else
            mainUnitDir = resolveProjectRoot(RP_MAIN_UNIT);

        sysData = path.join(mainUnitDir, 'dev_runtime');
    }
    else {
        sysData = osAppDataRoot || __dirname;
    }

    runtimePaths.userDataDir = path.join(sysData, app_data_directory_name);

    runtimePaths.appDataDir = path.join(runtimePaths.userDataDir, 'data');
    runtimePaths.appConfigDir = path.join(runtimePaths.userDataDir, 'config');
    runtimePaths.appCacheDir = path.join(runtimePaths.userDataDir, 'cache');

    if (createMissingFolders) {
        createDirectoryIfNotExists(runtimePaths.appDataDir);
        createDirectoryIfNotExists(runtimePaths.appConfigDir);
        createDirectoryIfNotExists(runtimePaths.appCacheDir);
    }
}

export function configureAssetsPath(isAppPackaged: boolean) {
    if (isAppPackaged) {
        // If the app is packaged than the assets live in the electron-provided resources folder
        // (See toolchain/config/build.ts)
        runtimePaths.assetsPath = path.join(process.resourcesPath, 'assets');
    }
    else if (IS_RUNNING_DEV) {
        // If in development we use the actual assets folder (relative to the dev main.js bundle inside main/dev_build)
        if (process.env.BUNDLE_COMPILED == 'yes')
            runtimePaths.assetsPath = path.join(__dirname, '..', 'assets');
        else
            runtimePaths.assetsPath = resolveProjectRoot(RP_MAIN_UNIT, 'assets');
    }
    else {
        // If it is not packaged and not running in development mode then it must be
        // the unpackaged but bundled app ready to be packaged. In this case the build system
        // places the assets right next to the main.js bundle
        runtimePaths.assetsPath = path.join(__dirname, 'assets');
    }
};

export const getPath = (spec: PathSpec): string => {
    if (spec == 'userData')
        return runtimePaths.userDataDir;
    if (spec == 'data')
        return runtimePaths.appDataDir;
    if (spec == 'config')
        return runtimePaths.appConfigDir;
    if (spec == 'cache')
        return runtimePaths.appCacheDir;
    // if (spec == 'assets')
    return runtimePaths.assetsPath;
}
