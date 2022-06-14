import path from 'path';
import { OutputOptions, InputOptions } from 'rollup';

import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import ts from "rollup-plugin-ts";
import autoExternal from 'rollup-plugin-auto-external';
import outputManifest from 'rollup-plugin-output-manifest';
import injectProcessEnv from 'rollup-plugin-inject-process-env';
import { terser } from 'rollup-plugin-terser';
import del from 'rollup-plugin-delete';
import filesize from 'rollup-plugin-filesize';
import copy from 'rollup-plugin-copy'
// import commonjs from '@rollup/plugin-commonjs';


import { mergeAndConcat } from 'merge-anything'

import {
    resolveProjectRoot,
    RP_MAIN_UNIT,
    RP_SHARED,
    RP_BUILD_COMPILED_MAIN
} from '@shared/app_paths';

import { readJsonSync } from '../helpers';

/* >>----------------------------------------------------------------<< */
const MAIN_ROOT_PATH = resolveProjectRoot(RP_MAIN_UNIT);

const resolveMainRoot = (...segments: string[]) =>
    path.join(MAIN_ROOT_PATH, ...segments);

const PKG_JSON_PATH = resolveMainRoot('package.json');
const MAIN_TSCONFIG_PATH = resolveMainRoot('tsconfig.json');

export const isProduction = process.env.NODE_ENV === 'production';
const excludedFiles = [
    /* these are *minimatch patterns*, NOT paths (relative or absolute) */
    '**/node_modules/**/*',
];
const pkgJson = readJsonSync(PKG_JSON_PATH);

export const outputDirPath = isProduction ?
    resolveProjectRoot(RP_BUILD_COMPILED_MAIN) :
    resolveMainRoot('dev_build')

const MANIFEST_OUTPUT_PATH = path.join(outputDirPath, 'meta');
const MANIFEST_FILE_NAME = 'files-manifest.json';

const PRELOAD_SCRIPT_ENTRY_NAME = 'preload';

/* >>----------------------------------------------------------------<< */

export const inputOptions: InputOptions = {
    input: {
        main: resolveMainRoot('source', 'electron-main', 'index.ts'),
        [PRELOAD_SCRIPT_ENTRY_NAME]: resolveMainRoot('source', 'preload.ts'),
    },
    watch: {
        exclude: excludedFiles, include: [
            'source/**/*',
            resolveProjectRoot(RP_SHARED) + "/**/*"
        ]
    },
    treeshake: {
        moduleSideEffects: (_id, external) => external
    },
    plugins: [
        /* Clear the build folder */
        del({
            targets: [outputDirPath + '/*'],
            runOnce: true, /* dont keep running in --watch mode */
            force: true
        }),

        /* Allow json imports */
        json({ compact: true }),

        /* Compile typescript */
        ts({
            tsconfig: MAIN_TSCONFIG_PATH,
            browserslist: false,
            transpiler: 'typescript',
            cwd: resolveMainRoot(),
            exclude: excludedFiles,
            transpileOnly: false,

            /* replace the above 'transpileOnly' setting with the one below if --watch mode is slow */
            // transpileOnly: !isProduction
        }),

        /* Tree shake common js files (that use require() and module.exports) */

        /* This plugin modifies process.env to always return the corresponding given values for
         * for the specified keys
         */
        injectProcessEnv({
            NODE_ENV: isProduction ? 'production' : 'development',
            BUNDLE_COMPILED: 'yes'
        }),


        /* Don't inline node_modules into the bundle, instead require() them */
        autoExternal({
            builtins: true,
            dependencies: true,
            packagePath: PKG_JSON_PATH,
            peerDependencies: true,
        }),

        /**
         * Copy the assets to the build folder when building for production.
         *
         * It is application's responsibility to use the actual source folder(s) when
         * running in development since they won't be copied on every dev build due to
         * the obvious performace cost.
         * */
        isProduction && copy({
            targets: [
                { src: [resolveMainRoot('assets')], dest: outputDirPath },
            ]
        }),

        /* Product a json manifest file containing (hashed) bundle names of the entrypoints inputs */
        isProduction && outputManifest({
            fileName: MANIFEST_FILE_NAME,
            publicPath: '',
            outputPath: MANIFEST_OUTPUT_PATH,
            nameWithExt: false,
            isMerge: false,
            serialize: (manifest) => {
                return JSON.stringify(manifest, null, 4);
            }
        }),
    ],

    /*
     * rollup-plugin-auto-external does not read devDependencies, so here we
     * explicity mark them external
     */
    external: Object.keys(pkgJson.devDependencies)
};


export const outputOptions: OutputOptions = {
    dir: outputDirPath,

    entryFileNames: '[name].js',
    chunkFileNames: 'chunk-[hash].js',

    format: 'cjs',
    plugins: [
        isProduction && terser({ format: { ecma: 2020 } })
    ]
};

export const getSecondPassPlugins = () => {
    return [
        replace({
            preventAssignment: false,
            delimiters: ['', ''],
            values: {
                '#__APP_PRE_COMPILED_PRELOAD_SCRIPT_NAME__#':
                    () => {
                        return PRELOAD_SCRIPT_ENTRY_NAME + ".js";
                    }
            }
        }),

        /* Print a summary of the build */
        isProduction && filesize()
    ];
}


const config = mergeAndConcat(
    inputOptions,
    {
        plugins: getSecondPassPlugins()
    },
    {
        output: outputOptions,
    }
);

export default config;
