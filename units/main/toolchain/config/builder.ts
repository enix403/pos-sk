import path from 'path';
import {
    resolveProjectRoot,
    RP_APP_BUILD,
    RP_BUILD_COMPILED,
    RP_BUILD_COMPILED_MAIN,
    RP_BUILD_RELEASE,
    RP_MAIN_UNIT
} from '@shared/app_paths';

import {
    app_id
} from './buildconfig.json';
import {
    app_name,
    app_name_long
} from "@/appconfig.json";

const mainFile = path.join(
    path.relative(RP_APP_BUILD, RP_BUILD_COMPILED_MAIN),
    'main.js'
)

const config = {
    asar: false,
    asarUnpack: "**\\*.{node,dll}",
    publish: null,
    npmRebuild: false,

    appId: app_id,
    productName: app_name_long,

    extraMetadata: {
        name: app_name,
        main: mainFile
    },
    directories: {
        app: resolveProjectRoot(RP_MAIN_UNIT),
        output: resolveProjectRoot(RP_BUILD_RELEASE),
        buildResources: "./assets"
    },
    extraResources: [
        "./assets/**/*"
    ],
    files: [
        "package.json", // it is copied anyway, but it's better to be explicit
        {
            from: resolveProjectRoot(RP_BUILD_COMPILED),
            to: path.basename(RP_BUILD_COMPILED),
            filter: ["**/*", "!**/asset-manifest.json"]
        },
        "**/node_modules/**/*",

        "!**/node_modules/*/{CHANGELOG.md,README.md,README,readme.md,readme}",
        "!**/node_modules/*/{test,__tests__,tests,powered-test,example,examples}",
        "!**/node_modules/*.d.ts",
        "!**/node_modules/.bin",
        "!**/*.{iml,o,hprof,orig,pyc,pyo,rbc,swp,csproj,sln,xproj}",
        "!.editorconfig",
        "!**/._*",
        "!**/{.DS_Store,.git,.hg,.svn,CVS,RCS,SCCS,.gitignore,.gitattributes}",
        "!**/{__pycache__,thumbs.db,.flowconfig,.idea,.vs,.nyc_output}",
        "!**/{appveyor.yml,.travis.yml,circle.yml}",
        "!**/{npm-debug.log,yarn.lock,.yarn-integrity,.yarn-metadata.json}"
    ],

    linux: {
        artifactName: `${app_name}-v\${version}-\${os}-\${arch}.\${ext}`,
        executableName: app_name,
        target: [
            "AppImage",
        ],
        compression: "normal",
        category: "Office",
    },

    win: {
        artifactName: `${app_name}-v\${version}-\${os}-\${arch}_Setup.\${ext}`,
        compression: "normal",
        target: ['nsis']
    },
    nsis: {
        oneClick: false,
        allowToChangeInstallationDirectory: true
    }
};

export default config;
