-- ============================================================
-- CostIQ Hackathon Demo: Comprehensive Seed Data
-- Run this AFTER the migration_dashboard_tables.sql
-- ============================================================

-- Clean existing demo data (safe: cascades through FKs)
TRUNCATE public.actual_consumptions CASCADE;
TRUNCATE public.bom_items CASCADE;
TRUNCATE public.orders CASCADE;
TRUNCATE public.inventory_items CASCADE;
TRUNCATE public.material_inventory CASCADE;
TRUNCATE public.production_logs CASCADE;

-- ============================================================
-- 1. ORDERS  (8 realistic production orders)
-- ============================================================

INSERT INTO public.orders (id, order_number, description, status, created_at) VALUES
  -- Active orders (current production)
  ('a1000000-0000-0000-0000-000000000001', 'PO-2026-001', 'Premium Cotton T-Shirts – 5,000 units',       'active',    '2026-01-15 09:00:00+05:30'),
  ('a1000000-0000-0000-0000-000000000002', 'PO-2026-002', 'Denim Jeans – 3,000 units',                   'active',    '2026-01-18 10:30:00+05:30'),
  ('a1000000-0000-0000-0000-000000000003', 'PO-2026-003', 'Silk Sarees – 1,200 units',                   'active',    '2026-01-22 08:00:00+05:30'),
  ('a1000000-0000-0000-0000-000000000004', 'PO-2026-004', 'Polyester Blended Shirts – 4,000 units',      'active',    '2026-02-01 11:00:00+05:30'),
  ('a1000000-0000-0000-0000-000000000005', 'PO-2026-005', 'Linen Kurtas – 2,500 units',                  'active',    '2026-02-05 09:30:00+05:30'),

  -- Completed orders (historical – for variance analysis)
  ('a1000000-0000-0000-0000-000000000006', 'PO-2025-048', 'Winter Jackets – 2,000 units',                'completed', '2025-11-10 08:00:00+05:30'),
  ('a1000000-0000-0000-0000-000000000007', 'PO-2025-049', 'Formal Trousers – 3,500 units',               'completed', '2025-12-01 09:00:00+05:30'),

  -- Draft order (upcoming)
  ('a1000000-0000-0000-0000-000000000008', 'PO-2026-006', 'Embroidered Cushion Covers – 6,000 units',    'draft',     '2026-02-16 14:00:00+05:30');

-- ============================================================
-- 2. BOM ITEMS  (multiple materials per order)
-- ============================================================

-- PO-2026-001: Premium Cotton T-Shirts
INSERT INTO public.bom_items (id, order_id, item_name, planned_qty, planned_rate, unit, created_at) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Cotton Fabric 60s',     2500,  320,  'meters',  '2026-01-15 09:05:00+05:30'),
  ('b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'Polyester Thread',      150,   85,   'kg',      '2026-01-15 09:06:00+05:30'),
  ('b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', 'Buttons (Pearl)',       25000, 2.50, 'pieces',  '2026-01-15 09:07:00+05:30'),
  ('b1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000001', 'Packaging Material',    5000,  8.00, 'pieces',  '2026-01-15 09:08:00+05:30'),
  ('b1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000001', 'Dye (Reactive Colors)', 80,    450,  'kg',      '2026-01-15 09:09:00+05:30');

-- PO-2026-002: Denim Jeans
INSERT INTO public.bom_items (id, order_id, item_name, planned_qty, planned_rate, unit, created_at) VALUES
  ('b1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000002', 'Denim Fabric 14oz',     4500,  480,  'meters',  '2026-01-18 10:35:00+05:30'),
  ('b1000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000002', 'Rivets (Brass)',        18000, 3.20, 'pieces',  '2026-01-18 10:36:00+05:30'),
  ('b1000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000002', 'Zippers (YKK)',         3000,  15,   'pieces',  '2026-01-18 10:37:00+05:30'),
  ('b1000000-0000-0000-0000-000000000009', 'a1000000-0000-0000-0000-000000000002', 'Indigo Dye',            120,   520,  'kg',      '2026-01-18 10:38:00+05:30'),
  ('b1000000-0000-0000-0000-000000000010', 'a1000000-0000-0000-0000-000000000002', 'Cotton Thread',         200,   72,   'kg',      '2026-01-18 10:39:00+05:30');

-- PO-2026-003: Silk Sarees
INSERT INTO public.bom_items (id, order_id, item_name, planned_qty, planned_rate, unit, created_at) VALUES
  ('b1000000-0000-0000-0000-000000000011', 'a1000000-0000-0000-0000-000000000003', 'Pure Silk Yarn',        600,   2800, 'kg',      '2026-01-22 08:05:00+05:30'),
  ('b1000000-0000-0000-0000-000000000012', 'a1000000-0000-0000-0000-000000000003', 'Zari Thread (Gold)',    180,   1650, 'kg',      '2026-01-22 08:06:00+05:30'),
  ('b1000000-0000-0000-0000-000000000013', 'a1000000-0000-0000-0000-000000000003', 'Natural Dyes',          45,    780,  'kg',      '2026-01-22 08:07:00+05:30');

-- PO-2026-004: Polyester Blended Shirts
INSERT INTO public.bom_items (id, order_id, item_name, planned_qty, planned_rate, unit, created_at) VALUES
  ('b1000000-0000-0000-0000-000000000014', 'a1000000-0000-0000-0000-000000000004', 'Poly-Cotton Blend',     3200,  220,  'meters',  '2026-02-01 11:05:00+05:30'),
  ('b1000000-0000-0000-0000-000000000015', 'a1000000-0000-0000-0000-000000000004', 'Interlining Fabric',    800,   95,   'meters',  '2026-02-01 11:06:00+05:30'),
  ('b1000000-0000-0000-0000-000000000016', 'a1000000-0000-0000-0000-000000000004', 'Buttons (Plastic)',     20000, 1.50, 'pieces',  '2026-02-01 11:07:00+05:30'),
  ('b1000000-0000-0000-0000-000000000017', 'a1000000-0000-0000-0000-000000000004', 'Labels & Tags',         4000,  4.00, 'pieces',  '2026-02-01 11:08:00+05:30');

-- PO-2026-005: Linen Kurtas
INSERT INTO public.bom_items (id, order_id, item_name, planned_qty, planned_rate, unit, created_at) VALUES
  ('b1000000-0000-0000-0000-000000000018', 'a1000000-0000-0000-0000-000000000005', 'Pure Linen Fabric',     2000,  560,  'meters',  '2026-02-05 09:35:00+05:30'),
  ('b1000000-0000-0000-0000-000000000019', 'a1000000-0000-0000-0000-000000000005', 'Shell Buttons',         12500, 5.00, 'pieces',  '2026-02-05 09:36:00+05:30'),
  ('b1000000-0000-0000-0000-000000000020', 'a1000000-0000-0000-0000-000000000005', 'Embroidery Thread',     60,    320,  'kg',      '2026-02-05 09:37:00+05:30');

-- PO-2025-048: Winter Jackets (completed – shows savings)
INSERT INTO public.bom_items (id, order_id, item_name, planned_qty, planned_rate, unit, created_at) VALUES
  ('b1000000-0000-0000-0000-000000000021', 'a1000000-0000-0000-0000-000000000006', 'Fleece Fabric',         3000,  410,  'meters',  '2025-11-10 08:05:00+05:30'),
  ('b1000000-0000-0000-0000-000000000022', 'a1000000-0000-0000-0000-000000000006', 'Nylon Zipper (Heavy)',  2000,  28,   'pieces',  '2025-11-10 08:06:00+05:30'),
  ('b1000000-0000-0000-0000-000000000023', 'a1000000-0000-0000-0000-000000000006', 'Polyester Lining',      2400,  150,  'meters',  '2025-11-10 08:07:00+05:30'),
  ('b1000000-0000-0000-0000-000000000024', 'a1000000-0000-0000-0000-000000000006', 'Snap Buttons (Metal)',  8000,  6.50, 'pieces',  '2025-11-10 08:08:00+05:30');

-- PO-2025-049: Formal Trousers (completed – shows cost overrun)
INSERT INTO public.bom_items (id, order_id, item_name, planned_qty, planned_rate, unit, created_at) VALUES
  ('b1000000-0000-0000-0000-000000000025', 'a1000000-0000-0000-0000-000000000007', 'Worsted Wool Blend',    3500,  640,  'meters',  '2025-12-01 09:05:00+05:30'),
  ('b1000000-0000-0000-0000-000000000026', 'a1000000-0000-0000-0000-000000000007', 'Pocket Lining',         3500,  45,   'meters',  '2025-12-01 09:06:00+05:30'),
  ('b1000000-0000-0000-0000-000000000027', 'a1000000-0000-0000-0000-000000000007', 'Belt Hooks',            3500,  8.00, 'pieces',  '2025-12-01 09:07:00+05:30'),
  ('b1000000-0000-0000-0000-000000000028', 'a1000000-0000-0000-0000-000000000007', 'Waistband Elastic',     1800,  35,   'meters',  '2025-12-01 09:08:00+05:30');

-- PO-2026-006: Embroidered Cushion Covers (draft – BOMs only)
INSERT INTO public.bom_items (id, order_id, item_name, planned_qty, planned_rate, unit, created_at) VALUES
  ('b1000000-0000-0000-0000-000000000029', 'a1000000-0000-0000-0000-000000000008', 'Canvas Fabric',         4800,  180,  'meters',  '2026-02-16 14:05:00+05:30'),
  ('b1000000-0000-0000-0000-000000000030', 'a1000000-0000-0000-0000-000000000008', 'Embroidery Thread Mix', 90,    380,  'kg',      '2026-02-16 14:06:00+05:30');

-- ============================================================
-- 3. ACTUAL CONSUMPTIONS  (realistic variances per BOM item)
--    variance = (actual - planned). + means overrun, - means saving
-- ============================================================

-- PO-2026-001: Cotton T-Shirts  →  slight overrun on fabric (market price rose)
INSERT INTO public.actual_consumptions (bom_item_id, actual_qty, actual_rate, reason, notes, consumed_at) VALUES
  -- Cotton Fabric: planned 2500m × ₹320 = ₹800,000. Actual: higher rate + 3% wastage
  ('b1000000-0000-0000-0000-000000000001', 1200, 338, 'market_fluctuation', 'Cotton prices increased 5.6% in Jan',       '2026-01-22 14:00:00+05:30'),
  ('b1000000-0000-0000-0000-000000000001', 1380, 345, 'market_fluctuation', 'Second lot – supplier raised price again',   '2026-02-03 10:00:00+05:30'),

  -- Polyester Thread: exactly on budget
  ('b1000000-0000-0000-0000-000000000002', 148, 85, 'normal', NULL, '2026-01-25 11:00:00+05:30'),

  -- Buttons: small saving (negotiated bulk discount)
  ('b1000000-0000-0000-0000-000000000003', 24800, 2.30, 'normal', 'Bulk discount from Surat supplier', '2026-01-28 09:00:00+05:30'),

  -- Packaging: on track
  ('b1000000-0000-0000-0000-000000000004', 3200, 8.00, 'normal', 'Partial delivery', '2026-02-01 16:00:00+05:30'),

  -- Dye: emergency purchase at premium
  ('b1000000-0000-0000-0000-000000000005', 85, 520, 'emergency', 'Original supplier delayed; emergency purchase from alternate vendor at premium', '2026-02-05 08:00:00+05:30');

-- PO-2026-002: Denim Jeans  →  major overrun on denim fabric
INSERT INTO public.actual_consumptions (bom_item_id, actual_qty, actual_rate, reason, notes, consumed_at) VALUES
  -- Denim Fabric: price surge + higher wastage
  ('b1000000-0000-0000-0000-000000000006', 2200, 510, 'market_fluctuation', 'Denim prices surged due to raw cotton shortage', '2026-01-28 10:00:00+05:30'),
  ('b1000000-0000-0000-0000-000000000006', 2500, 525, 'scope_change',       'Added pre-wash process – higher fabric consumption', '2026-02-08 14:00:00+05:30'),

  -- Rivets: minor overrun
  ('b1000000-0000-0000-0000-000000000007', 18200, 3.40, 'normal', 'Slight defect rate in first batch', '2026-02-02 09:00:00+05:30'),

  -- Zippers: on budget
  ('b1000000-0000-0000-0000-000000000008', 2950, 15, 'normal', NULL, '2026-02-04 11:00:00+05:30'),

  -- Indigo Dye: slight saving
  ('b1000000-0000-0000-0000-000000000009', 115, 495, 'normal', 'Better dye penetration reduced quantity needed', '2026-02-06 08:00:00+05:30'),

  -- Cotton Thread: on budget
  ('b1000000-0000-0000-0000-000000000010', 195, 72, 'normal', NULL, '2026-02-07 10:00:00+05:30');

-- PO-2026-003: Silk Sarees  →  high variance on silk yarn (imported material)
INSERT INTO public.actual_consumptions (bom_item_id, actual_qty, actual_rate, reason, notes, consumed_at) VALUES
  -- Silk Yarn: imported price volatile
  ('b1000000-0000-0000-0000-000000000011', 320, 3050, 'market_fluctuation', 'Import duties increased; exchange rate unfavorable', '2026-02-01 09:00:00+05:30'),
  ('b1000000-0000-0000-0000-000000000011', 300, 3120, 'supplier_delay',     'Original supplier delayed; had to source from alternative', '2026-02-12 10:00:00+05:30'),

  -- Zari Thread: on par
  ('b1000000-0000-0000-0000-000000000012', 90, 1680, 'normal', NULL, '2026-02-03 11:00:00+05:30'),

  -- Natural Dyes: slight saving
  ('b1000000-0000-0000-0000-000000000013', 42, 760, 'normal', 'Used optimized dyeing process', '2026-02-05 14:00:00+05:30');

-- PO-2026-004: Polyester Shirts  →  savings from negotiation
INSERT INTO public.actual_consumptions (bom_item_id, actual_qty, actual_rate, reason, notes, consumed_at) VALUES
  -- Poly-Cotton Blend: saving due to long-term contract
  ('b1000000-0000-0000-0000-000000000014', 3100, 205, 'normal', 'Long-term contract pricing activated', '2026-02-08 10:00:00+05:30'),

  -- Interlining: on budget
  ('b1000000-0000-0000-0000-000000000015', 790, 95, 'normal', NULL, '2026-02-09 11:00:00+05:30'),

  -- Buttons: bulk deal
  ('b1000000-0000-0000-0000-000000000016', 19800, 1.35, 'normal', 'Bulk pricing from local manufacturer', '2026-02-10 09:00:00+05:30'),

  -- Labels: on track
  ('b1000000-0000-0000-0000-000000000017', 4000, 4.00, 'normal', NULL, '2026-02-11 10:00:00+05:30');

-- PO-2026-005: Linen Kurtas  →  mixed results
INSERT INTO public.actual_consumptions (bom_item_id, actual_qty, actual_rate, reason, notes, consumed_at) VALUES
  -- Linen Fabric: overrun (imported flax prices up)
  ('b1000000-0000-0000-0000-000000000018', 1050, 595, 'market_fluctuation', 'European flax prices up 6%', '2026-02-10 09:00:00+05:30'),
  ('b1000000-0000-0000-0000-000000000018', 980,  610, 'supplier_delay',     'Alternate supplier – higher rate', '2026-02-15 14:00:00+05:30'),

  -- Shell Buttons: exact match
  ('b1000000-0000-0000-0000-000000000019', 6200, 5.00, 'normal', 'Partial delivery', '2026-02-12 10:00:00+05:30'),

  -- Embroidery Thread: slight saving
  ('b1000000-0000-0000-0000-000000000020', 58, 305, 'normal', 'Discovered more efficient stitch pattern', '2026-02-13 11:00:00+05:30');

-- PO-2025-048: Winter Jackets (completed)  →  overall saving of ~5%
INSERT INTO public.actual_consumptions (bom_item_id, actual_qty, actual_rate, reason, notes, consumed_at) VALUES
  ('b1000000-0000-0000-0000-000000000021', 2900, 395, 'normal', 'Seasonal discount on fleece', '2025-11-25 10:00:00+05:30'),
  ('b1000000-0000-0000-0000-000000000022', 1980, 26,  'normal', 'Good batch quality – fewer rejects', '2025-12-02 09:00:00+05:30'),
  ('b1000000-0000-0000-0000-000000000023', 2350, 145, 'normal', 'Negotiated better rate', '2025-12-05 11:00:00+05:30'),
  ('b1000000-0000-0000-0000-000000000024', 7800, 6.20, 'normal', NULL, '2025-12-08 10:00:00+05:30');

-- PO-2025-049: Formal Trousers (completed)  →  8% cost overrun
INSERT INTO public.actual_consumptions (bom_item_id, actual_qty, actual_rate, reason, notes, consumed_at) VALUES
  ('b1000000-0000-0000-0000-000000000025', 3600, 695, 'market_fluctuation', 'Wool prices spiked due to winter demand + scarcity', '2025-12-15 10:00:00+05:30'),
  ('b1000000-0000-0000-0000-000000000026', 3600, 48,  'scope_change',       'Added extra pocket – more lining needed', '2025-12-18 09:00:00+05:30'),
  ('b1000000-0000-0000-0000-000000000027', 3600, 8.50, 'normal', 'Slight price increase', '2025-12-20 11:00:00+05:30'),
  ('b1000000-0000-0000-0000-000000000028', 1900, 38,  'normal', NULL, '2025-12-22 10:00:00+05:30');

-- ============================================================
-- 4. INVENTORY ITEMS  (15 raw materials tracked in the system)
-- ============================================================

INSERT INTO public.inventory_items (id, item_name, current_stock, minimum_stock, safety_stock, daily_consumption, lead_time_days, unit, updated_at) VALUES
  -- CRITICAL: stock below reorder level
  ('c1000000-0000-0000-0000-000000000001', 'Cotton Fabric 60s',     180,  500,  200, 45,  7,  'meters',  now() - interval '2 hours'),
  ('c1000000-0000-0000-0000-000000000002', 'Pure Silk Yarn',        25,   100,  40,  12,  14, 'kg',      now() - interval '1 hour'),
  ('c1000000-0000-0000-0000-000000000003', 'Indigo Dye',            8,    30,   15,  4,   10, 'kg',      now() - interval '30 minutes'),

  -- WARNING: approaching reorder level
  ('c1000000-0000-0000-0000-000000000004', 'Denim Fabric 14oz',     650,  800,  300, 55,  7,  'meters',  now() - interval '3 hours'),
  ('c1000000-0000-0000-0000-000000000005', 'Pure Linen Fabric',     280,  400,  150, 30,  10, 'meters',  now() - interval '4 hours'),
  ('c1000000-0000-0000-0000-000000000006', 'Zari Thread (Gold)',    35,   60,   25,  5,   12, 'kg',      now() - interval '5 hours'),

  -- SAFE: well stocked
  ('c1000000-0000-0000-0000-000000000007', 'Polyester Thread',      850,  200,  100, 20,  5,  'kg',      now() - interval '6 hours'),
  ('c1000000-0000-0000-0000-000000000008', 'Buttons (Pearl)',       45000, 10000, 5000, 800, 3, 'pieces', now() - interval '1 day'),
  ('c1000000-0000-0000-0000-000000000009', 'Buttons (Plastic)',     62000, 15000, 8000, 1200, 3, 'pieces', now() - interval '1 day'),
  ('c1000000-0000-0000-0000-000000000010', 'Zippers (YKK)',         4200,  1000,  500, 100, 5,  'pieces',  now() - interval '12 hours'),
  ('c1000000-0000-0000-0000-000000000011', 'Packaging Material',    12000, 3000,  1500, 350, 3,  'pieces',  now() - interval '8 hours'),
  ('c1000000-0000-0000-0000-000000000012', 'Poly-Cotton Blend',     2800,  800,   400, 80,  7,  'meters',  now() - interval '10 hours'),
  ('c1000000-0000-0000-0000-000000000013', 'Interlining Fabric',    1600,  400,   200, 25,  5,  'meters',  now() - interval '1 day'),
  ('c1000000-0000-0000-0000-000000000014', 'Dye (Reactive Colors)', 120,   50,    30,  6,   8,  'kg',      now() - interval '6 hours'),
  ('c1000000-0000-0000-0000-000000000015', 'Embroidery Thread',     200,   80,    40,  8,   6,  'kg',      now() - interval '2 days');

-- ============================================================
-- 5. MATERIAL INVENTORY  (for the Overview dashboard donut/KPIs)
--    Simpler table: just material_name, current_stock, reorder_level
-- ============================================================

INSERT INTO public.material_inventory (material_name, current_stock, reorder_level) VALUES
  ('Cotton Fabric 60s',     180,  515),
  ('Denim Fabric 14oz',     650,  685),
  ('Pure Silk Yarn',         25,  208),
  ('Pure Linen Fabric',     280,  450),
  ('Poly-Cotton Blend',     2800, 960),
  ('Polyester Thread',       850,  200),
  ('Zari Thread (Gold)',     35,   85),
  ('Indigo Dye',              8,   55),
  ('Dye (Reactive Colors)',  120,   78),
  ('Buttons (Pearl)',       45000, 7400),
  ('Buttons (Plastic)',     62000, 11600),
  ('Zippers (YKK)',          4200, 1000),
  ('Packaging Material',    12000, 2550),
  ('Embroidery Thread',      200,   88),
  ('Interlining Fabric',    1600,  325);

-- ============================================================
-- 6. PRODUCTION LOGS  (30 days of daily records for charts)
--    These power the Variance Trend, Spend Composition, Burn Rate
-- ============================================================

INSERT INTO public.production_logs (created_at, planned_cost, actual_cost, quantity_used, material_name) VALUES
  -- Day 1-5: Jan 20 – Jan 24
  ('2026-01-20 17:00:00+05:30', 45000,  47250,  140, 'Cotton Fabric 60s'),
  ('2026-01-20 17:00:00+05:30', 28000,  27500,   60, 'Denim Fabric 14oz'),
  ('2026-01-21 17:00:00+05:30', 48000,  49800,  150, 'Cotton Fabric 60s'),
  ('2026-01-21 17:00:00+05:30', 32000,  33600,   65, 'Denim Fabric 14oz'),
  ('2026-01-21 17:00:00+05:30', 33600,  36600,   12, 'Pure Silk Yarn'),
  ('2026-01-22 17:00:00+05:30', 44000,  46200,  135, 'Cotton Fabric 60s'),
  ('2026-01-22 17:00:00+05:30', 30000,  31500,   62, 'Denim Fabric 14oz'),
  ('2026-01-22 17:00:00+05:30', 33600,  37200,   12, 'Pure Silk Yarn'),
  ('2026-01-23 17:00:00+05:30', 46000,  48300,  142, 'Cotton Fabric 60s'),
  ('2026-01-23 17:00:00+05:30', 28800,  30960,   60, 'Denim Fabric 14oz'),
  ('2026-01-24 17:00:00+05:30', 50000,  53000,  155, 'Cotton Fabric 60s'),
  ('2026-01-24 17:00:00+05:30', 31200,  33540,   65, 'Denim Fabric 14oz'),
  ('2026-01-24 17:00:00+05:30', 30800,  33300,   11, 'Pure Silk Yarn'),

  -- Day 6-10: Jan 25 – Jan 29
  ('2026-01-25 17:00:00+05:30', 47000,  50000,  145, 'Cotton Fabric 60s'),
  ('2026-01-25 17:00:00+05:30', 33600,  36120,   70, 'Denim Fabric 14oz'),
  ('2026-01-26 17:00:00+05:30', 44800,  47600,  140, 'Cotton Fabric 60s'),
  ('2026-01-26 17:00:00+05:30', 30000,  31800,   62, 'Denim Fabric 14oz'),
  ('2026-01-26 17:00:00+05:30', 36400,  39000,   13, 'Pure Silk Yarn'),
  ('2026-01-27 17:00:00+05:30', 48000,  50400,  148, 'Cotton Fabric 60s'),
  ('2026-01-27 17:00:00+05:30', 31200,  33800,   65, 'Denim Fabric 14oz'),
  ('2026-01-28 17:00:00+05:30', 46400,  49100,  144, 'Cotton Fabric 60s'),
  ('2026-01-28 17:00:00+05:30', 34800,  37600,   72, 'Denim Fabric 14oz'),
  ('2026-01-28 17:00:00+05:30', 28000,  29400,   10, 'Pure Silk Yarn'),
  ('2026-01-29 17:00:00+05:30', 50000,  52500,  155, 'Cotton Fabric 60s'),
  ('2026-01-29 17:00:00+05:30', 33600,  36960,   70, 'Denim Fabric 14oz'),

  -- Day 11-15: Jan 30 – Feb 3  (poly-cotton and linen join)
  ('2026-01-30 17:00:00+05:30', 48000,  50400,  150, 'Cotton Fabric 60s'),
  ('2026-01-30 17:00:00+05:30', 31200,  34320,   65, 'Denim Fabric 14oz'),
  ('2026-01-30 17:00:00+05:30', 33600,  36900,   12, 'Pure Silk Yarn'),
  ('2026-01-31 17:00:00+05:30', 45000,  46800,  140, 'Cotton Fabric 60s'),
  ('2026-01-31 17:00:00+05:30', 28800,  31400,   60, 'Denim Fabric 14oz'),
  ('2026-02-01 17:00:00+05:30', 46000,  47500,  143, 'Cotton Fabric 60s'),
  ('2026-02-01 17:00:00+05:30', 30000,  32700,   62, 'Denim Fabric 14oz'),
  ('2026-02-01 17:00:00+05:30', 17600,  16400,   80, 'Poly-Cotton Blend'),
  ('2026-02-02 17:00:00+05:30', 48000,  50400,  148, 'Cotton Fabric 60s'),
  ('2026-02-02 17:00:00+05:30', 33600,  36700,   70, 'Denim Fabric 14oz'),
  ('2026-02-02 17:00:00+05:30', 17600,  16200,   80, 'Poly-Cotton Blend'),
  ('2026-02-03 17:00:00+05:30', 44000,  46200,  138, 'Cotton Fabric 60s'),
  ('2026-02-03 17:00:00+05:30', 31200,  34000,   65, 'Denim Fabric 14oz'),
  ('2026-02-03 17:00:00+05:30', 17600,  16000,   80, 'Poly-Cotton Blend'),
  ('2026-02-03 17:00:00+05:30', 33600,  37100,   12, 'Pure Silk Yarn'),

  -- Day 16-20: Feb 4 – Feb 8
  ('2026-02-04 17:00:00+05:30', 46000,  48800,  142, 'Cotton Fabric 60s'),
  ('2026-02-04 17:00:00+05:30', 30000,  32400,   62, 'Denim Fabric 14oz'),
  ('2026-02-04 17:00:00+05:30', 17600,  16100,   80, 'Poly-Cotton Blend'),
  ('2026-02-05 17:00:00+05:30', 50000,  53500,  155, 'Cotton Fabric 60s'),
  ('2026-02-05 17:00:00+05:30', 34800,  37800,   72, 'Denim Fabric 14oz'),
  ('2026-02-05 17:00:00+05:30', 16800,  17850,   30, 'Pure Linen Fabric'),
  ('2026-02-06 17:00:00+05:30', 48000,  50100,  148, 'Cotton Fabric 60s'),
  ('2026-02-06 17:00:00+05:30', 33600,  36500,   70, 'Denim Fabric 14oz'),
  ('2026-02-06 17:00:00+05:30', 16800,  18060,   30, 'Pure Linen Fabric'),
  ('2026-02-06 17:00:00+05:30', 17600,  16300,   80, 'Poly-Cotton Blend'),
  ('2026-02-07 17:00:00+05:30', 45000,  47500,  140, 'Cotton Fabric 60s'),
  ('2026-02-07 17:00:00+05:30', 31200,  33800,   65, 'Denim Fabric 14oz'),
  ('2026-02-07 17:00:00+05:30', 16800,  18200,   30, 'Pure Linen Fabric'),
  ('2026-02-08 17:00:00+05:30', 47000,  49600,  145, 'Cotton Fabric 60s'),
  ('2026-02-08 17:00:00+05:30', 33600,  36400,   70, 'Denim Fabric 14oz'),
  ('2026-02-08 17:00:00+05:30', 16800,  18400,   30, 'Pure Linen Fabric'),
  ('2026-02-08 17:00:00+05:30', 17600,  16000,   80, 'Poly-Cotton Blend'),

  -- Day 21-25: Feb 9 – Feb 13
  ('2026-02-09 17:00:00+05:30', 46000,  48700,  142, 'Cotton Fabric 60s'),
  ('2026-02-09 17:00:00+05:30', 30000,  32700,   62, 'Denim Fabric 14oz'),
  ('2026-02-09 17:00:00+05:30', 16800,  17500,   30, 'Pure Linen Fabric'),
  ('2026-02-10 17:00:00+05:30', 48000,  50600,  148, 'Cotton Fabric 60s'),
  ('2026-02-10 17:00:00+05:30', 33600,  36200,   70, 'Denim Fabric 14oz'),
  ('2026-02-10 17:00:00+05:30', 16800,  18300,   30, 'Pure Linen Fabric'),
  ('2026-02-10 17:00:00+05:30', 17600,  16100,   80, 'Poly-Cotton Blend'),
  ('2026-02-11 17:00:00+05:30', 50000,  53200,  155, 'Cotton Fabric 60s'),
  ('2026-02-11 17:00:00+05:30', 34800,  38000,   72, 'Denim Fabric 14oz'),
  ('2026-02-11 17:00:00+05:30', 33600,  36800,   12, 'Pure Silk Yarn'),
  ('2026-02-12 17:00:00+05:30', 46000,  48300,  142, 'Cotton Fabric 60s'),
  ('2026-02-12 17:00:00+05:30', 31200,  33900,   65, 'Denim Fabric 14oz'),
  ('2026-02-12 17:00:00+05:30', 16800,  18600,   30, 'Pure Linen Fabric'),
  ('2026-02-13 17:00:00+05:30', 44000,  46200,  135, 'Cotton Fabric 60s'),
  ('2026-02-13 17:00:00+05:30', 30000,  32400,   62, 'Denim Fabric 14oz'),
  ('2026-02-13 17:00:00+05:30', 17600,  15800,   80, 'Poly-Cotton Blend'),

  -- Day 26-30: Feb 14 – Feb 18  (most recent)
  ('2026-02-14 17:00:00+05:30', 48000,  50800,  148, 'Cotton Fabric 60s'),
  ('2026-02-14 17:00:00+05:30', 33600,  36700,   70, 'Denim Fabric 14oz'),
  ('2026-02-14 17:00:00+05:30', 16800,  18100,   30, 'Pure Linen Fabric'),
  ('2026-02-14 17:00:00+05:30', 17600,  16200,   80, 'Poly-Cotton Blend'),
  ('2026-02-15 17:00:00+05:30', 47000,  49700,  145, 'Cotton Fabric 60s'),
  ('2026-02-15 17:00:00+05:30', 31200,  34100,   65, 'Denim Fabric 14oz'),
  ('2026-02-15 17:00:00+05:30', 33600,  37500,   12, 'Pure Silk Yarn'),
  ('2026-02-16 17:00:00+05:30', 50000,  53500,  155, 'Cotton Fabric 60s'),
  ('2026-02-16 17:00:00+05:30', 34800,  38200,   72, 'Denim Fabric 14oz'),
  ('2026-02-16 17:00:00+05:30', 16800,  18500,   30, 'Pure Linen Fabric'),
  ('2026-02-17 17:00:00+05:30', 46000,  48900,  142, 'Cotton Fabric 60s'),
  ('2026-02-17 17:00:00+05:30', 33600,  36400,   70, 'Denim Fabric 14oz'),
  ('2026-02-17 17:00:00+05:30', 17600,  16000,   80, 'Poly-Cotton Blend'),
  ('2026-02-17 17:00:00+05:30', 33600,  37200,   12, 'Pure Silk Yarn'),
  ('2026-02-18 12:00:00+05:30', 44000,  46800,  138, 'Cotton Fabric 60s'),
  ('2026-02-18 12:00:00+05:30', 30000,  32700,   62, 'Denim Fabric 14oz'),
  ('2026-02-18 12:00:00+05:30', 16800,  18400,   30, 'Pure Linen Fabric'),
  ('2026-02-18 12:00:00+05:30', 17600,  15900,   80, 'Poly-Cotton Blend');

-- ============================================================
-- DONE: You now have:
--   8 orders (5 active, 2 completed, 1 draft)
--   30 BOM items across all orders
--   32 actual consumption records with realistic variances
--   15 inventory items (3 critical, 3 warning, 9 safe)
--   15 material inventory entries
--   88 production log entries spanning 30 days
-- ============================================================
