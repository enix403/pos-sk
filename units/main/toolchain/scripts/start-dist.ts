import path from 'path';
import { spawnSync } from 'child_process';
import { resolveProjectRoot, RP_BUILD_COMPILED_MAIN } from '@shared/app_paths';


spawnSync(
    'yarn',
    ['electron', path.join(resolveProjectRoot(RP_BUILD_COMPILED_MAIN, 'main.js'))],
    {
        stdio: 'inherit'
    }
);
