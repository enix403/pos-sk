import path from 'path';
import fs from 'fs';

import commonjs from '@rollup/plugin-commonjs';

import * as rollup from 'rollup';
import {
    inputOptions,
    outputOptions,
    outputDirPath,
    getSecondPassPlugins
} from '../config/rollup.main';


const main = async () => {

    const bundleManager = await rollup.rollup(inputOptions);

    const rawOutputDir = path.join(outputDirPath, 'raw');
    const { output } = await bundleManager.write({
        ...outputOptions,
        dir: rawOutputDir
    });

    await bundleManager.close();

    const chunks: string[] = [];
    const entries: string[] = [];

    for (const chunkOrAsset of output) {
        if (chunkOrAsset.type == 'chunk') {
            if (chunkOrAsset.isEntry) {
                entries.push(path.join(rawOutputDir, chunkOrAsset.fileName));
            }
            else {
                chunks.push(chunkOrAsset.fileName);
            }
        }
    }

    const bundles: Promise<rollup.RollupBuild>[] = [];
    const checkExternal = (source: string) => {
        if (entries.includes(source))
            return false;
        if (chunks.includes(path.basename(source)))
            return false;
        return true;
    };

    const commonConfig = {
        treeshake: {
            moduleSideEffects: true
        },
        external: checkExternal,
        plugins: [
            commonjs({
                ignore: checkExternal,
                ignoreDynamicRequires: true,
                ignoreTryCatch: true
            }),
            ...getSecondPassPlugins()
        ]
    } as rollup.InputOptions;

    for (const ent of entries) {
        bundles.push(
            rollup.rollup({
                input: ent,
                ...commonConfig
            })
        );
    }

    const bundlesResults = await Promise.all(bundles);

    const commonOutConfig = {
        ...outputOptions,
        entryFileNames: '[name].js',
        exports: 'auto'
    } as rollup.OutputOptions;

    await Promise.all(bundlesResults.map(b => b.write(commonOutConfig)));
    await Promise.all(bundlesResults.map(b => b.close()));
    fs.rmSync(rawOutputDir, { recursive: true, force: true });
};

main();
