import path from 'path';

// "AP_" = absolute path, "RP_" = relative path from the project root (AP_PROJECT_ROOT)

export const AP_PROJECT_ROOT = path.resolve(__dirname, '..');

export const RP_SHARED = path.join('shared');
export const RP_UNITS = path.join('units');

export const RP_MAIN_UNIT = path.join(RP_UNITS, 'main');
export const RP_RENDERER_UNIT = path.join(RP_UNITS, 'renderer');

export const RP_APP_BUILD = path.join('build');
export const RP_BUILD_COMPILED = path.join(RP_APP_BUILD, 'compiled');
export const RP_BUILD_RELEASE = path.join(RP_APP_BUILD, 'release');

export const RP_BUILD_COMPILED_MAIN = path.join(RP_BUILD_COMPILED, 'main');
export const RP_BUILD_COMPILED_RENDERER = path.join(RP_BUILD_COMPILED, 'renderer');

export const resolveProjectRoot = (...relSegments: string[]) =>
    path.join(AP_PROJECT_ROOT, ...relSegments);
