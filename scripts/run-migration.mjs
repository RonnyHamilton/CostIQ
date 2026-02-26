// Verify CostIQ tables exist and have data
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { Client } = require('pg');

const client = new Client({
    host: 'db.qxdvohfgtzpyhdkbegym.supabase.co',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'CostIQ@246$',
    ssl: { rejectUnauthorized: false },
});

await client.connect();
const counts = await client.query(`
  SELECT
    (SELECT COUNT(*) FROM orders) as orders,
    (SELECT COUNT(*) FROM bom_items) as bom_items,
    (SELECT COUNT(*) FROM actual_consumptions) as consumptions,
    (SELECT COUNT(*) FROM inventory_items) as inventory;
`);
console.log('Row counts:', JSON.stringify(counts.rows[0]));
await client.end();
