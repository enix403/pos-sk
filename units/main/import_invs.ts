process.env.NODE_ENV = 'development';

import fs from 'fs';

import CsvReadableStream from 'csv-reader';

import { configureApplicationPaths } from '@/pathutils';
import { createDBConnection, EFORK } from '@/database';
import { initLogging, logger } from '@/logging';

import { resolveProjectRoot } from '@shared/app_paths';

import { StoreItemFamily, PIECE_UNIT } from '@shared/contracts/IStoreItem';
import { StoreItem, StoreItemAttribute, ItemStock } from '@/entities';

// -- code body

function genUPC() {
    return [...Array(12)].map(_ => Math.random() * 10 | 0).join('');
}

async function main() {
    configureApplicationPaths(null, false);
    initLogging();

    logger.debug("Connecting to database");
    await createDBConnection();

    const em = EFORK();

    const filepath = resolveProjectRoot("assets", "f1.csv");
    let inputStream = fs.createReadStream(filepath, 'utf8');

    let items: ItemStock[] = [];

    inputStream
        .pipe(new CsvReadableStream({
            parseNumbers: true,
            parseBooleans: true,
            delimiter: '|',
            skipEmptyLines: true,
            skipLines: 0,
        }))
        .on('data', function (row) {

            const item = em.create(StoreItem, {
                pcode: genUPC(),
                pcode_std: 'upc',
                family: StoreItemFamily.TradeItem,
                name: row[1],
                description: "",
                unit: PIECE_UNIT,
                cost_price: row[3],
                retail_price: row[4],
                active: true
            });

            item.attributes.add(
                em.create(StoreItemAttribute, { name: "Size", value: row[2] })
            );

            const stockObject = em.create(ItemStock, {
                item: item,
                unit_count: 300
            });

            items.push(stockObject);

        })
        .on('end', async function () {
            // console.log('No more rows!');
            // items.forEach(it => em.persist(it));
            // await em.flush();
        });
}

main()
