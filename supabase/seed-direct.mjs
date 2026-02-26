/**
 * CostIQ: Direct Postgres Seeder (bypasses RLS)
 * Run: node supabase/seed-direct.mjs
 */
import pg from "pg";
const { Client } = pg;

const client = new Client({
  host: "db.qxdvohfgtzpyhdkbegym.supabase.co",
  port: 5432,
  database: "postgres",
  user: "postgres",
  password: "CostIQ@246$",
  ssl: { rejectUnauthorized: false },
});

async function seed() {
  await client.connect();
  console.log("🌱 CostIQ Direct Database Seeder");
  console.log("═".repeat(50));

  const run = async (q) => client.query(q);

  // ── 1. Clean ──────────────────────────────────────
  console.log("\n🗑️  Cleaning existing data...");
  await run("DELETE FROM actual_consumptions"); console.log("  ✓ actual_consumptions");
  await run("DELETE FROM bom_items"); console.log("  ✓ bom_items");
  await run("DELETE FROM orders"); console.log("  ✓ orders");
  await run("DELETE FROM inventory_items"); console.log("  ✓ inventory_items");
  await run("DELETE FROM material_inventory"); console.log("  ✓ material_inventory");
  await run("DELETE FROM production_logs"); console.log("  ✓ production_logs");

  // ── 2. ORDERS ─────────────────────────────────────
  console.log("\n📦 Seeding orders...");
  await run(`INSERT INTO orders (id, order_number, description, status, created_at) VALUES
    ('a1000000-0000-0000-0000-000000000001','PO-2026-001','Premium Cotton T-Shirts - 5000 units','active','2026-01-15T09:00:00+05:30'),
    ('a1000000-0000-0000-0000-000000000002','PO-2026-002','Denim Jeans - 3000 units','active','2026-01-18T10:30:00+05:30'),
    ('a1000000-0000-0000-0000-000000000003','PO-2026-003','Silk Sarees - 1200 units','active','2026-01-22T08:00:00+05:30'),
    ('a1000000-0000-0000-0000-000000000004','PO-2026-004','Polyester Blended Shirts - 4000 units','active','2026-02-01T11:00:00+05:30'),
    ('a1000000-0000-0000-0000-000000000005','PO-2026-005','Linen Kurtas - 2500 units','active','2026-02-05T09:30:00+05:30'),
    ('a1000000-0000-0000-0000-000000000006','PO-2025-048','Winter Jackets - 2000 units','completed','2025-11-10T08:00:00+05:30'),
    ('a1000000-0000-0000-0000-000000000007','PO-2025-049','Formal Trousers - 3500 units','completed','2025-12-01T09:00:00+05:30'),
    ('a1000000-0000-0000-0000-000000000008','PO-2026-006','Embroidered Cushion Covers - 6000 units','draft','2026-02-16T14:00:00+05:30')`);
  console.log("  ✓ 8 orders");

  // ── 3. BOM ITEMS ──────────────────────────────────
  console.log("\n📋 Seeding BOM items...");
  await run(`INSERT INTO bom_items (id, order_id, item_name, planned_qty, planned_rate, unit) VALUES
    ('b1000000-0000-0000-0000-000000000001','a1000000-0000-0000-0000-000000000001','Cotton Fabric 60s',2500,320,'meters'),
    ('b1000000-0000-0000-0000-000000000002','a1000000-0000-0000-0000-000000000001','Polyester Thread',150,85,'kg'),
    ('b1000000-0000-0000-0000-000000000003','a1000000-0000-0000-0000-000000000001','Buttons (Pearl)',25000,2.50,'pieces'),
    ('b1000000-0000-0000-0000-000000000004','a1000000-0000-0000-0000-000000000001','Packaging Material',5000,8,'pieces'),
    ('b1000000-0000-0000-0000-000000000005','a1000000-0000-0000-0000-000000000001','Dye (Reactive Colors)',80,450,'kg'),
    ('b1000000-0000-0000-0000-000000000006','a1000000-0000-0000-0000-000000000002','Denim Fabric 14oz',4500,480,'meters'),
    ('b1000000-0000-0000-0000-000000000007','a1000000-0000-0000-0000-000000000002','Rivets (Brass)',18000,3.20,'pieces'),
    ('b1000000-0000-0000-0000-000000000008','a1000000-0000-0000-0000-000000000002','Zippers (YKK)',3000,15,'pieces'),
    ('b1000000-0000-0000-0000-000000000009','a1000000-0000-0000-0000-000000000002','Indigo Dye',120,520,'kg'),
    ('b1000000-0000-0000-0000-000000000010','a1000000-0000-0000-0000-000000000002','Cotton Thread',200,72,'kg'),
    ('b1000000-0000-0000-0000-000000000011','a1000000-0000-0000-0000-000000000003','Pure Silk Yarn',600,2800,'kg'),
    ('b1000000-0000-0000-0000-000000000012','a1000000-0000-0000-0000-000000000003','Zari Thread (Gold)',180,1650,'kg'),
    ('b1000000-0000-0000-0000-000000000013','a1000000-0000-0000-0000-000000000003','Natural Dyes',45,780,'kg'),
    ('b1000000-0000-0000-0000-000000000014','a1000000-0000-0000-0000-000000000004','Poly-Cotton Blend',3200,220,'meters'),
    ('b1000000-0000-0000-0000-000000000015','a1000000-0000-0000-0000-000000000004','Interlining Fabric',800,95,'meters'),
    ('b1000000-0000-0000-0000-000000000016','a1000000-0000-0000-0000-000000000004','Buttons (Plastic)',20000,1.50,'pieces'),
    ('b1000000-0000-0000-0000-000000000017','a1000000-0000-0000-0000-000000000004','Labels and Tags',4000,4.00,'pieces'),
    ('b1000000-0000-0000-0000-000000000018','a1000000-0000-0000-0000-000000000005','Pure Linen Fabric',2000,560,'meters'),
    ('b1000000-0000-0000-0000-000000000019','a1000000-0000-0000-0000-000000000005','Shell Buttons',12500,5.00,'pieces'),
    ('b1000000-0000-0000-0000-000000000020','a1000000-0000-0000-0000-000000000005','Embroidery Thread',60,320,'kg'),
    ('b1000000-0000-0000-0000-000000000021','a1000000-0000-0000-0000-000000000006','Fleece Fabric',3000,410,'meters'),
    ('b1000000-0000-0000-0000-000000000022','a1000000-0000-0000-0000-000000000006','Nylon Zipper (Heavy)',2000,28,'pieces'),
    ('b1000000-0000-0000-0000-000000000023','a1000000-0000-0000-0000-000000000006','Polyester Lining',2400,150,'meters'),
    ('b1000000-0000-0000-0000-000000000024','a1000000-0000-0000-0000-000000000006','Snap Buttons (Metal)',8000,6.50,'pieces'),
    ('b1000000-0000-0000-0000-000000000025','a1000000-0000-0000-0000-000000000007','Worsted Wool Blend',3500,640,'meters'),
    ('b1000000-0000-0000-0000-000000000026','a1000000-0000-0000-0000-000000000007','Pocket Lining',3500,45,'meters'),
    ('b1000000-0000-0000-0000-000000000027','a1000000-0000-0000-0000-000000000007','Belt Hooks',3500,8.00,'pieces'),
    ('b1000000-0000-0000-0000-000000000028','a1000000-0000-0000-0000-000000000007','Waistband Elastic',1800,35,'meters'),
    ('b1000000-0000-0000-0000-000000000029','a1000000-0000-0000-0000-000000000008','Canvas Fabric',4800,180,'meters'),
    ('b1000000-0000-0000-0000-000000000030','a1000000-0000-0000-0000-000000000008','Embroidery Thread Mix',90,380,'kg')`);
  console.log("  ✓ 30 BOM items");

  // ── 4. CONSUMPTIONS ───────────────────────────────
  console.log("\n💰 Seeding actual consumptions...");
  await run(`INSERT INTO actual_consumptions (bom_item_id, actual_qty, actual_rate, reason, notes, consumed_at) VALUES
    ('b1000000-0000-0000-0000-000000000001',1200,338,'market_fluctuation','Cotton prices increased 5.6%','2026-01-22T14:00:00+05:30'),
    ('b1000000-0000-0000-0000-000000000001',1380,345,'market_fluctuation','Second lot price increase','2026-02-03T10:00:00+05:30'),
    ('b1000000-0000-0000-0000-000000000002',148,85,'normal',NULL,'2026-01-25T11:00:00+05:30'),
    ('b1000000-0000-0000-0000-000000000003',24800,2.30,'normal','Bulk discount Surat','2026-01-28T09:00:00+05:30'),
    ('b1000000-0000-0000-0000-000000000004',3200,8.00,'normal','Partial delivery','2026-02-01T16:00:00+05:30'),
    ('b1000000-0000-0000-0000-000000000005',85,520,'emergency','Emergency alternate vendor','2026-02-05T08:00:00+05:30'),
    ('b1000000-0000-0000-0000-000000000006',2200,510,'market_fluctuation','Denim price surge','2026-01-28T10:00:00+05:30'),
    ('b1000000-0000-0000-0000-000000000006',2500,525,'scope_change','Added pre-wash process','2026-02-08T14:00:00+05:30'),
    ('b1000000-0000-0000-0000-000000000007',18200,3.40,'normal','Defect rate in batch','2026-02-02T09:00:00+05:30'),
    ('b1000000-0000-0000-0000-000000000008',2950,15,'normal',NULL,'2026-02-04T11:00:00+05:30'),
    ('b1000000-0000-0000-0000-000000000009',115,495,'normal','Better dye penetration','2026-02-06T08:00:00+05:30'),
    ('b1000000-0000-0000-0000-000000000010',195,72,'normal',NULL,'2026-02-07T10:00:00+05:30'),
    ('b1000000-0000-0000-0000-000000000011',320,3050,'market_fluctuation','Import duties increased','2026-02-01T09:00:00+05:30'),
    ('b1000000-0000-0000-0000-000000000011',300,3120,'supplier_delay','Alternative supplier','2026-02-12T10:00:00+05:30'),
    ('b1000000-0000-0000-0000-000000000012',90,1680,'normal',NULL,'2026-02-03T11:00:00+05:30'),
    ('b1000000-0000-0000-0000-000000000013',42,760,'normal','Optimized dyeing','2026-02-05T14:00:00+05:30'),
    ('b1000000-0000-0000-0000-000000000014',3100,205,'normal','Contract pricing','2026-02-08T10:00:00+05:30'),
    ('b1000000-0000-0000-0000-000000000015',790,95,'normal',NULL,'2026-02-09T11:00:00+05:30'),
    ('b1000000-0000-0000-0000-000000000016',19800,1.35,'normal','Bulk pricing','2026-02-10T09:00:00+05:30'),
    ('b1000000-0000-0000-0000-000000000017',4000,4.00,'normal',NULL,'2026-02-11T10:00:00+05:30'),
    ('b1000000-0000-0000-0000-000000000018',1050,595,'market_fluctuation','European flax up 6%','2026-02-10T09:00:00+05:30'),
    ('b1000000-0000-0000-0000-000000000018',980,610,'supplier_delay','Alternate supplier','2026-02-15T14:00:00+05:30'),
    ('b1000000-0000-0000-0000-000000000019',6200,5.00,'normal','Partial delivery','2026-02-12T10:00:00+05:30'),
    ('b1000000-0000-0000-0000-000000000020',58,305,'normal','Efficient stitch pattern','2026-02-13T11:00:00+05:30'),
    ('b1000000-0000-0000-0000-000000000021',2900,395,'normal','Seasonal discount','2025-11-25T10:00:00+05:30'),
    ('b1000000-0000-0000-0000-000000000022',1980,26,'normal','Good quality batch','2025-12-02T09:00:00+05:30'),
    ('b1000000-0000-0000-0000-000000000023',2350,145,'normal','Negotiated rate','2025-12-05T11:00:00+05:30'),
    ('b1000000-0000-0000-0000-000000000024',7800,6.20,'normal',NULL,'2025-12-08T10:00:00+05:30'),
    ('b1000000-0000-0000-0000-000000000025',3600,695,'market_fluctuation','Wool price spike','2025-12-15T10:00:00+05:30'),
    ('b1000000-0000-0000-0000-000000000026',3600,48,'scope_change','Extra pocket added','2025-12-18T09:00:00+05:30'),
    ('b1000000-0000-0000-0000-000000000027',3600,8.50,'normal','Slight price increase','2025-12-20T11:00:00+05:30'),
    ('b1000000-0000-0000-0000-000000000028',1900,38,'normal',NULL,'2025-12-22T10:00:00+05:30')`);
  console.log("  ✓ 32 consumption records");

  // ── 5. INVENTORY ITEMS ────────────────────────────
  console.log("\n📦 Seeding inventory items...");
  await run(`INSERT INTO inventory_items (item_name, current_stock, minimum_stock, safety_stock, daily_consumption, lead_time_days, unit) VALUES
    ('Cotton Fabric 60s',180,500,200,45,7,'meters'),
    ('Pure Silk Yarn',25,100,40,12,14,'kg'),
    ('Indigo Dye',8,30,15,4,10,'kg'),
    ('Denim Fabric 14oz',650,800,300,55,7,'meters'),
    ('Pure Linen Fabric',280,400,150,30,10,'meters'),
    ('Zari Thread (Gold)',35,60,25,5,12,'kg'),
    ('Polyester Thread',850,200,100,20,5,'kg'),
    ('Buttons (Pearl)',45000,10000,5000,800,3,'pieces'),
    ('Buttons (Plastic)',62000,15000,8000,1200,3,'pieces'),
    ('Zippers (YKK)',4200,1000,500,100,5,'pieces'),
    ('Packaging Material',12000,3000,1500,350,3,'pieces'),
    ('Poly-Cotton Blend',2800,800,400,80,7,'meters'),
    ('Interlining Fabric',1600,400,200,25,5,'meters'),
    ('Dye (Reactive Colors)',120,50,30,6,8,'kg'),
    ('Embroidery Thread',200,80,40,8,6,'kg')`);
  console.log("  ✓ 15 inventory items");

  // ── 6. MATERIAL INVENTORY ─────────────────────────
  console.log("\n🔬 Seeding material inventory...");
  await run(`INSERT INTO material_inventory (material_name, current_stock, reorder_level) VALUES
    ('Cotton Fabric 60s',180,515),
    ('Denim Fabric 14oz',650,685),
    ('Pure Silk Yarn',25,208),
    ('Pure Linen Fabric',280,450),
    ('Poly-Cotton Blend',2800,960),
    ('Polyester Thread',850,200),
    ('Zari Thread (Gold)',35,85),
    ('Indigo Dye',8,55),
    ('Dye (Reactive Colors)',120,78),
    ('Buttons (Pearl)',45000,7400),
    ('Buttons (Plastic)',62000,11600),
    ('Zippers (YKK)',4200,1000),
    ('Packaging Material',12000,2550),
    ('Embroidery Thread',200,88),
    ('Interlining Fabric',1600,325)`);
  console.log("  ✓ 15 material inventory entries");

  // ── 7. PRODUCTION LOGS ────────────────────────────
  console.log("\n📊 Seeding production logs...");
  await run(`INSERT INTO production_logs (created_at, planned_cost, actual_cost, quantity_used, material_name) VALUES
    ('2026-01-20T17:00:00+05:30',45000,47250,140,'Cotton Fabric 60s'),
    ('2026-01-20T17:00:00+05:30',28000,27500,60,'Denim Fabric 14oz'),
    ('2026-01-21T17:00:00+05:30',48000,49800,150,'Cotton Fabric 60s'),
    ('2026-01-21T17:00:00+05:30',32000,33600,65,'Denim Fabric 14oz'),
    ('2026-01-21T17:00:00+05:30',33600,36600,12,'Pure Silk Yarn'),
    ('2026-01-22T17:00:00+05:30',44000,46200,135,'Cotton Fabric 60s'),
    ('2026-01-22T17:00:00+05:30',30000,31500,62,'Denim Fabric 14oz'),
    ('2026-01-22T17:00:00+05:30',33600,37200,12,'Pure Silk Yarn'),
    ('2026-01-23T17:00:00+05:30',46000,48300,142,'Cotton Fabric 60s'),
    ('2026-01-23T17:00:00+05:30',28800,30960,60,'Denim Fabric 14oz'),
    ('2026-01-24T17:00:00+05:30',50000,53000,155,'Cotton Fabric 60s'),
    ('2026-01-24T17:00:00+05:30',31200,33540,65,'Denim Fabric 14oz'),
    ('2026-01-24T17:00:00+05:30',30800,33300,11,'Pure Silk Yarn'),
    ('2026-01-25T17:00:00+05:30',47000,50000,145,'Cotton Fabric 60s'),
    ('2026-01-25T17:00:00+05:30',33600,36120,70,'Denim Fabric 14oz'),
    ('2026-01-26T17:00:00+05:30',44800,47600,140,'Cotton Fabric 60s'),
    ('2026-01-26T17:00:00+05:30',30000,31800,62,'Denim Fabric 14oz'),
    ('2026-01-26T17:00:00+05:30',36400,39000,13,'Pure Silk Yarn'),
    ('2026-01-27T17:00:00+05:30',48000,50400,148,'Cotton Fabric 60s'),
    ('2026-01-27T17:00:00+05:30',31200,33800,65,'Denim Fabric 14oz'),
    ('2026-01-28T17:00:00+05:30',46400,49100,144,'Cotton Fabric 60s'),
    ('2026-01-28T17:00:00+05:30',34800,37600,72,'Denim Fabric 14oz'),
    ('2026-01-28T17:00:00+05:30',28000,29400,10,'Pure Silk Yarn')`);
  console.log("  ✓ Batch 1 (Jan 20-28): 23 logs");

  await run(`INSERT INTO production_logs (created_at, planned_cost, actual_cost, quantity_used, material_name) VALUES
    ('2026-01-29T17:00:00+05:30',50000,52500,155,'Cotton Fabric 60s'),
    ('2026-01-29T17:00:00+05:30',33600,36960,70,'Denim Fabric 14oz'),
    ('2026-01-30T17:00:00+05:30',48000,50400,150,'Cotton Fabric 60s'),
    ('2026-01-30T17:00:00+05:30',31200,34320,65,'Denim Fabric 14oz'),
    ('2026-01-30T17:00:00+05:30',33600,36900,12,'Pure Silk Yarn'),
    ('2026-01-31T17:00:00+05:30',45000,46800,140,'Cotton Fabric 60s'),
    ('2026-01-31T17:00:00+05:30',28800,31400,60,'Denim Fabric 14oz'),
    ('2026-02-01T17:00:00+05:30',46000,47500,143,'Cotton Fabric 60s'),
    ('2026-02-01T17:00:00+05:30',30000,32700,62,'Denim Fabric 14oz'),
    ('2026-02-01T17:00:00+05:30',17600,16400,80,'Poly-Cotton Blend'),
    ('2026-02-02T17:00:00+05:30',48000,50400,148,'Cotton Fabric 60s'),
    ('2026-02-02T17:00:00+05:30',33600,36700,70,'Denim Fabric 14oz'),
    ('2026-02-02T17:00:00+05:30',17600,16200,80,'Poly-Cotton Blend'),
    ('2026-02-03T17:00:00+05:30',44000,46200,138,'Cotton Fabric 60s'),
    ('2026-02-03T17:00:00+05:30',31200,34000,65,'Denim Fabric 14oz'),
    ('2026-02-03T17:00:00+05:30',17600,16000,80,'Poly-Cotton Blend'),
    ('2026-02-03T17:00:00+05:30',33600,37100,12,'Pure Silk Yarn'),
    ('2026-02-04T17:00:00+05:30',46000,48800,142,'Cotton Fabric 60s'),
    ('2026-02-04T17:00:00+05:30',30000,32400,62,'Denim Fabric 14oz'),
    ('2026-02-04T17:00:00+05:30',17600,16100,80,'Poly-Cotton Blend'),
    ('2026-02-05T17:00:00+05:30',50000,53500,155,'Cotton Fabric 60s'),
    ('2026-02-05T17:00:00+05:30',34800,37800,72,'Denim Fabric 14oz'),
    ('2026-02-05T17:00:00+05:30',16800,17850,30,'Pure Linen Fabric')`);
  console.log("  ✓ Batch 2 (Jan 29 - Feb 5): 23 logs");

  await run(`INSERT INTO production_logs (created_at, planned_cost, actual_cost, quantity_used, material_name) VALUES
    ('2026-02-06T17:00:00+05:30',48000,50100,148,'Cotton Fabric 60s'),
    ('2026-02-06T17:00:00+05:30',33600,36500,70,'Denim Fabric 14oz'),
    ('2026-02-06T17:00:00+05:30',16800,18060,30,'Pure Linen Fabric'),
    ('2026-02-06T17:00:00+05:30',17600,16300,80,'Poly-Cotton Blend'),
    ('2026-02-07T17:00:00+05:30',45000,47500,140,'Cotton Fabric 60s'),
    ('2026-02-07T17:00:00+05:30',31200,33800,65,'Denim Fabric 14oz'),
    ('2026-02-07T17:00:00+05:30',16800,18200,30,'Pure Linen Fabric'),
    ('2026-02-08T17:00:00+05:30',47000,49600,145,'Cotton Fabric 60s'),
    ('2026-02-08T17:00:00+05:30',33600,36400,70,'Denim Fabric 14oz'),
    ('2026-02-08T17:00:00+05:30',16800,18400,30,'Pure Linen Fabric'),
    ('2026-02-08T17:00:00+05:30',17600,16000,80,'Poly-Cotton Blend'),
    ('2026-02-09T17:00:00+05:30',46000,48700,142,'Cotton Fabric 60s'),
    ('2026-02-09T17:00:00+05:30',30000,32700,62,'Denim Fabric 14oz'),
    ('2026-02-09T17:00:00+05:30',16800,17500,30,'Pure Linen Fabric'),
    ('2026-02-10T17:00:00+05:30',48000,50600,148,'Cotton Fabric 60s'),
    ('2026-02-10T17:00:00+05:30',33600,36200,70,'Denim Fabric 14oz'),
    ('2026-02-10T17:00:00+05:30',16800,18300,30,'Pure Linen Fabric'),
    ('2026-02-10T17:00:00+05:30',17600,16100,80,'Poly-Cotton Blend'),
    ('2026-02-11T17:00:00+05:30',50000,53200,155,'Cotton Fabric 60s'),
    ('2026-02-11T17:00:00+05:30',34800,38000,72,'Denim Fabric 14oz'),
    ('2026-02-11T17:00:00+05:30',33600,36800,12,'Pure Silk Yarn'),
    ('2026-02-12T17:00:00+05:30',46000,48300,142,'Cotton Fabric 60s'),
    ('2026-02-12T17:00:00+05:30',31200,33900,65,'Denim Fabric 14oz'),
    ('2026-02-12T17:00:00+05:30',16800,18600,30,'Pure Linen Fabric')`);
  console.log("  ✓ Batch 3 (Feb 6-12): 24 logs");

  await run(`INSERT INTO production_logs (created_at, planned_cost, actual_cost, quantity_used, material_name) VALUES
    ('2026-02-13T17:00:00+05:30',44000,46200,135,'Cotton Fabric 60s'),
    ('2026-02-13T17:00:00+05:30',30000,32400,62,'Denim Fabric 14oz'),
    ('2026-02-13T17:00:00+05:30',17600,15800,80,'Poly-Cotton Blend'),
    ('2026-02-14T17:00:00+05:30',48000,50800,148,'Cotton Fabric 60s'),
    ('2026-02-14T17:00:00+05:30',33600,36700,70,'Denim Fabric 14oz'),
    ('2026-02-14T17:00:00+05:30',16800,18100,30,'Pure Linen Fabric'),
    ('2026-02-14T17:00:00+05:30',17600,16200,80,'Poly-Cotton Blend'),
    ('2026-02-15T17:00:00+05:30',47000,49700,145,'Cotton Fabric 60s'),
    ('2026-02-15T17:00:00+05:30',31200,34100,65,'Denim Fabric 14oz'),
    ('2026-02-15T17:00:00+05:30',33600,37500,12,'Pure Silk Yarn'),
    ('2026-02-16T17:00:00+05:30',50000,53500,155,'Cotton Fabric 60s'),
    ('2026-02-16T17:00:00+05:30',34800,38200,72,'Denim Fabric 14oz'),
    ('2026-02-16T17:00:00+05:30',16800,18500,30,'Pure Linen Fabric'),
    ('2026-02-17T17:00:00+05:30',46000,48900,142,'Cotton Fabric 60s'),
    ('2026-02-17T17:00:00+05:30',33600,36400,70,'Denim Fabric 14oz'),
    ('2026-02-17T17:00:00+05:30',17600,16000,80,'Poly-Cotton Blend'),
    ('2026-02-17T17:00:00+05:30',33600,37200,12,'Pure Silk Yarn'),
    ('2026-02-18T12:00:00+05:30',44000,46800,138,'Cotton Fabric 60s'),
    ('2026-02-18T12:00:00+05:30',30000,32700,62,'Denim Fabric 14oz'),
    ('2026-02-18T12:00:00+05:30',16800,18400,30,'Pure Linen Fabric'),
    ('2026-02-18T12:00:00+05:30',17600,15900,80,'Poly-Cotton Blend')`);
  console.log("  ✓ Batch 4 (Feb 13-18): 21 logs");

  // ── Summary ───────────────────────────────────────
  console.log("\n" + "═".repeat(50));
  console.log("✅ ALL 6 TABLES SEEDED!");
  console.log("   • 8 orders  • 30 BOM items  • 32 consumptions");
  console.log("   • 15 inventory  • 15 material_inventory  • 91 production_logs");
  console.log("\n🎯 Refresh http://localhost:3000/overview");

  await client.end();
}

seed().catch(async (err) => {
  console.error("❌ Seed failed:", err.message);
  await client.end();
  process.exit(1);
});
