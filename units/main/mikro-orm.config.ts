/* MikroORM config */

process.env.NODE_ENV = 'development';

require('tsconfig-paths/register');
require('dotenv/config');

import path from 'path';

import type { MikroORM } from '@mikro-orm/core';
import { configureApplicationPaths } from '@/pathutils';
import { initLogging } from '@/logging';
import { getMDBConfig } from '@/database';

configureApplicationPaths(null, true);
initLogging();

export default {
    ...getMDBConfig(),

    migrations: {
        path: path.join(__dirname, 'migrations'), // path to the folder with migrations
        pattern: /^[\w-]+\d+\.[jt]s$/, // regex pattern for the migration files
        safe: false, // allow to disable table and column dropping
        emit: 'js', // migration generation mode
        dropTables: false, // allow to disable table dropping
        disableForeignKeys: true // wrap statements with `set foreign_key_checks = 0`
    }

} as Parameters<typeof MikroORM.init>[0];
