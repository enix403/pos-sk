import path from 'path';

import { MikroORM } from '@mikro-orm/core';
import { SqliteDriver } from '@mikro-orm/sqlite';
import type { IDatabaseDriver, Connection } from '@mikro-orm/core';

import { IS_RUNNING_DEV } from '@/utils';
import { getPath } from '@/pathutils';
import { logger } from '@/logging';
import allEntities from './entities';

export let orm: MikroORM<IDatabaseDriver<Connection>>;
export type EnttManager = (typeof orm)['em'];

export const EFORK = () => orm.em.fork();

export function getMDBConfig(): Parameters<typeof MikroORM.init>[0] {
    const storagePath = path.join(getPath('data'), 'storage.sqlite3');
    return {
        driver: SqliteDriver,

        dbName: storagePath,
        entities: allEntities,

        debug: IS_RUNNING_DEV && ['query', 'query-params'],
        // debug: IS_RUNNING_DEV && [],
        logger: msg => logger.verbose(msg),

        cache: { enabled: false },
        discovery: {
            disableDynamicFileAccess: true
        }
    };
}

export async function createDBConnection() {
    orm = await MikroORM.init(getMDBConfig());
    if (!IS_RUNNING_DEV) {
        await orm.getSchemaGenerator().updateSchema();
    }
}
