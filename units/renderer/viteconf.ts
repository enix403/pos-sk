import path from 'path';
import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";

import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";


import tsconfigPaths from 'vite-tsconfig-paths';

import { resolveProjectRoot, RP_BUILD_COMPILED_RENDERER } from '@shared/app_paths';

export default defineConfig(({ mode }) => {
    const isDevelopment = mode == 'development';

    return {
        base: './',

        resolve: { alias: { '@': path.resolve(__dirname, 'src') } },

        plugins: [
            tsconfigPaths({ loose: true }),
            react(),
            // For wasm
            wasm(),
            topLevelAwait()
        ],

        build: {
            outDir: resolveProjectRoot(RP_BUILD_COMPILED_RENDERER),
            assetsDir: '.',
            emptyOutDir: true,
            target: "modules",
            sourcemap: isDevelopment,
            minify: !isDevelopment && 'esbuild',
            chunkSizeWarningLimit: 1000,

            rollupOptions: {
                input: {
                    bundle_system: 'index_system.html',
                    bundle_pos: 'index_pos.html'
                },
            },

        },

        server: {
            port: 4200,
            strictPort: true,
            cors: true,
            fs: { strict: false }
        },

        optimizeDeps: {
            keepNames: false,
            exclude: [
                "@syntect/wasm"
            ]
        },

        json: {
            namedExports: true
        },

        css: {
            modules: {
                generateScopedName: isDevelopment ?
                    "[local]__mod_[hash:base64:4]" :
                    "_[hash:base64:8]_[md5:contenthash:6]_",
            }
        },

        envDir: '.',
        envPrefix: 'VITE_'
    };
});
