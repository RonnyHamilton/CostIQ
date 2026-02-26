-- ============================================================
-- CostIQ: Seed Data for ronnyhamilton189@gmail.com
-- Run this in the Supabase SQL Editor
-- ============================================================

DO $$
DECLARE
  uid uuid;
BEGIN
  -- Look up the user ID
  SELECT id INTO uid FROM auth.users WHERE email = 'ronnyhamilton189@gmail.com';

  IF uid IS NULL THEN
    RAISE EXCEPTION 'User ronnyhamilton189@gmail.com not found in auth.users. Please sign up first.';
  END IF;

  -- ==========================================================
  -- 1. ORDERS
  -- ==========================================================
  INSERT INTO public.orders (id, order_number, description, status, user_id, created_at) VALUES
    ('c2000000-0000-0000-0000-000000000001', 'PO-2026-101', 'Organic Cotton Polo Shirts – 3,000 units',   'active',    uid, '2026-01-20 09:00:00+05:30'),
    ('c2000000-0000-0000-0000-000000000002', 'PO-2026-102', 'Bamboo Fiber Socks – 10,000 pairs',          'active',    uid, '2026-01-25 10:30:00+05:30'),
    ('c2000000-0000-0000-0000-000000000003', 'PO-2026-103', 'Recycled Polyester Jackets – 1,500 units',   'active',    uid, '2026-02-01 08:00:00+05:30'),
    ('c2000000-0000-0000-0000-000000000004', 'PO-2026-104', 'Hemp Canvas Tote Bags – 8,000 units',        'active',    uid, '2026-02-05 11:00:00+05:30'),
    ('c2000000-0000-0000-0000-000000000005', 'PO-2026-105', 'Silk-Blend Scarves – 2,000 units',           'active',    uid, '2026-02-10 09:30:00+05:30'),
    ('c2000000-0000-0000-0000-000000000006', 'PO-2025-090', 'Merino Wool Sweaters – 1,800 units',         'completed', uid, '2025-11-15 08:00:00+05:30'),
    ('c2000000-0000-0000-0000-000000000007', 'PO-2025-091', 'Modal Fabric Dresses – 2,200 units',         'completed', uid, '2025-12-10 09:00:00+05:30'),
    ('c2000000-0000-0000-0000-000000000008', 'PO-2026-106', 'Tencel Bed Sheets – 5,000 sets',             'draft',     uid, '2026-02-17 14:00:00+05:30');

  -- ==========================================================
  -- 2. BOM ITEMS
  -- ==========================================================

  -- PO-2026-101: Organic Cotton Polo Shirts
  INSERT INTO public.bom_items (id, order_id, item_name, planned_qty, planned_rate, unit, user_id, created_at) VALUES
    ('d2000000-0000-0000-0000-000000000001', 'c2000000-0000-0000-0000-000000000001', 'Organic Cotton Fabric',  1500, 380, 'meters',  uid, '2026-01-20 09:05:00+05:30'),
    ('d2000000-0000-0000-0000-000000000002', 'c2000000-0000-0000-0000-000000000001', 'Cotton Thread',           90,  95,  'kg',      uid, '2026-01-20 09:06:00+05:30'),
    ('d2000000-0000-0000-0000-000000000003', 'c2000000-0000-0000-0000-000000000001', 'Buttons (Coconut Shell)', 15000, 3.80, 'pieces', uid, '2026-01-20 09:07:00+05:30'),
    ('d2000000-0000-0000-0000-000000000004', 'c2000000-0000-0000-0000-000000000001', 'Eco Packaging',          3000, 12,  'pieces',  uid, '2026-01-20 09:08:00+05:30');

  -- PO-2026-102: Bamboo Fiber Socks
  INSERT INTO public.bom_items (id, order_id, item_name, planned_qty, planned_rate, unit, user_id, created_at) VALUES
    ('d2000000-0000-0000-0000-000000000005', 'c2000000-0000-0000-0000-000000000002', 'Bamboo Fiber Yarn',   800,  520,  'kg',      uid, '2026-01-25 10:35:00+05:30'),
    ('d2000000-0000-0000-0000-000000000006', 'c2000000-0000-0000-0000-000000000002', 'Elastic Band',        2000, 18,   'meters',  uid, '2026-01-25 10:36:00+05:30'),
    ('d2000000-0000-0000-0000-000000000007', 'c2000000-0000-0000-0000-000000000002', 'Sock Packaging',      10000, 5,   'pieces',  uid, '2026-01-25 10:37:00+05:30');

  -- PO-2026-103: Recycled Polyester Jackets
  INSERT INTO public.bom_items (id, order_id, item_name, planned_qty, planned_rate, unit, user_id, created_at) VALUES
    ('d2000000-0000-0000-0000-000000000008', 'c2000000-0000-0000-0000-000000000003', 'Recycled Polyester',   2200, 290, 'meters',  uid, '2026-02-01 08:05:00+05:30'),
    ('d2000000-0000-0000-0000-000000000009', 'c2000000-0000-0000-0000-000000000003', 'Metal Zippers',        1500, 22,  'pieces',  uid, '2026-02-01 08:06:00+05:30'),
    ('d2000000-0000-0000-0000-000000000010', 'c2000000-0000-0000-0000-000000000003', 'Down Fill (Synthetic)', 300,  650, 'kg',      uid, '2026-02-01 08:07:00+05:30'),
    ('d2000000-0000-0000-0000-000000000011', 'c2000000-0000-0000-0000-000000000003', 'Jacket Labels',        1500, 8,   'pieces',  uid, '2026-02-01 08:08:00+05:30');

  -- PO-2026-104: Hemp Canvas Tote Bags
  INSERT INTO public.bom_items (id, order_id, item_name, planned_qty, planned_rate, unit, user_id, created_at) VALUES
    ('d2000000-0000-0000-0000-000000000012', 'c2000000-0000-0000-0000-000000000004', 'Hemp Canvas Fabric',  3200, 210, 'meters',  uid, '2026-02-05 11:05:00+05:30'),
    ('d2000000-0000-0000-0000-000000000013', 'c2000000-0000-0000-0000-000000000004', 'Cotton Handles',      16000, 4.50, 'pieces', uid, '2026-02-05 11:06:00+05:30'),
    ('d2000000-0000-0000-0000-000000000014', 'c2000000-0000-0000-0000-000000000004', 'Screen Print Ink',     40,  380, 'kg',      uid, '2026-02-05 11:07:00+05:30');

  -- PO-2026-105: Silk-Blend Scarves
  INSERT INTO public.bom_items (id, order_id, item_name, planned_qty, planned_rate, unit, user_id, created_at) VALUES
    ('d2000000-0000-0000-0000-000000000015', 'c2000000-0000-0000-0000-000000000005', 'Silk-Blend Fabric',   1200, 720, 'meters',  uid, '2026-02-10 09:35:00+05:30'),
    ('d2000000-0000-0000-0000-000000000016', 'c2000000-0000-0000-0000-000000000005', 'Natural Dye Set',      50,  580, 'kg',      uid, '2026-02-10 09:36:00+05:30'),
    ('d2000000-0000-0000-0000-000000000017', 'c2000000-0000-0000-0000-000000000005', 'Gift Box Packaging',  2000, 25,  'pieces',  uid, '2026-02-10 09:37:00+05:30');

  -- PO-2025-090: Merino Wool Sweaters (completed)
  INSERT INTO public.bom_items (id, order_id, item_name, planned_qty, planned_rate, unit, user_id, created_at) VALUES
    ('d2000000-0000-0000-0000-000000000018', 'c2000000-0000-0000-0000-000000000006', 'Merino Wool Yarn',    1400, 890, 'kg',      uid, '2025-11-15 08:05:00+05:30'),
    ('d2000000-0000-0000-0000-000000000019', 'c2000000-0000-0000-0000-000000000006', 'Knitting Needles',     200, 45,  'pieces',  uid, '2025-11-15 08:06:00+05:30'),
    ('d2000000-0000-0000-0000-000000000020', 'c2000000-0000-0000-0000-000000000006', 'Sweater Tags',        1800, 6,   'pieces',  uid, '2025-11-15 08:07:00+05:30');

  -- PO-2025-091: Modal Fabric Dresses (completed)
  INSERT INTO public.bom_items (id, order_id, item_name, planned_qty, planned_rate, unit, user_id, created_at) VALUES
    ('d2000000-0000-0000-0000-000000000021', 'c2000000-0000-0000-0000-000000000007', 'Modal Fabric',        3300, 410, 'meters',  uid, '2025-12-10 09:05:00+05:30'),
    ('d2000000-0000-0000-0000-000000000022', 'c2000000-0000-0000-0000-000000000007', 'Lace Trim',           4400, 35,  'meters',  uid, '2025-12-10 09:06:00+05:30'),
    ('d2000000-0000-0000-0000-000000000023', 'c2000000-0000-0000-0000-000000000007', 'Dress Hangers',       2200, 15,  'pieces',  uid, '2025-12-10 09:07:00+05:30');

  -- ==========================================================
  -- 3. ACTUAL CONSUMPTIONS (correct columns: consumed_at, reason, notes)
  -- ==========================================================

  -- PO-2026-101 actuals (slight overrun on fabric)
  INSERT INTO public.actual_consumptions (id, bom_item_id, actual_qty, actual_rate, reason, notes, consumed_at, user_id) VALUES
    ('e2000000-0000-0000-0000-000000000001', 'd2000000-0000-0000-0000-000000000001', 1620, 395, 'normal', 'Fabric cut waste higher than expected',     '2026-02-10 16:00:00+05:30', uid),
    ('e2000000-0000-0000-0000-000000000002', 'd2000000-0000-0000-0000-000000000002', 88,  100,  'normal', 'Thread usage within tolerance',              '2026-02-10 16:01:00+05:30', uid),
    ('e2000000-0000-0000-0000-000000000003', 'd2000000-0000-0000-0000-000000000003', 14200, 3.90, 'normal', 'Button breakage during pressing',          '2026-02-10 16:02:00+05:30', uid),
    ('e2000000-0000-0000-0000-000000000004', 'd2000000-0000-0000-0000-000000000004', 2800, 12.50, 'normal', 'Packaging on track',                      '2026-02-10 16:03:00+05:30', uid);

  -- PO-2026-102 actuals (savings on yarn)
  INSERT INTO public.actual_consumptions (id, bom_item_id, actual_qty, actual_rate, reason, notes, consumed_at, user_id) VALUES
    ('e2000000-0000-0000-0000-000000000005', 'd2000000-0000-0000-0000-000000000005', 760, 490, 'normal', 'Yarn efficiency improved with new loom',     '2026-02-12 15:00:00+05:30', uid),
    ('e2000000-0000-0000-0000-000000000006', 'd2000000-0000-0000-0000-000000000006', 1900, 18, 'normal', 'Elastic usage normal',                       '2026-02-12 15:01:00+05:30', uid),
    ('e2000000-0000-0000-0000-000000000007', 'd2000000-0000-0000-0000-000000000007', 9500, 5.20, 'normal', 'Some packaging damaged in transit',        '2026-02-12 15:02:00+05:30', uid);

  -- PO-2026-103 actuals (overrun on down fill)
  INSERT INTO public.actual_consumptions (id, bom_item_id, actual_qty, actual_rate, reason, notes, consumed_at, user_id) VALUES
    ('e2000000-0000-0000-0000-000000000008', 'd2000000-0000-0000-0000-000000000008', 2350, 305, 'normal', 'Polyester shrinkage after heat treatment',   '2026-02-14 17:00:00+05:30', uid),
    ('e2000000-0000-0000-0000-000000000009', 'd2000000-0000-0000-0000-000000000009', 1480, 24,  'normal', 'Zipper supplier price increase',             '2026-02-14 17:01:00+05:30', uid),
    ('e2000000-0000-0000-0000-000000000010', 'd2000000-0000-0000-0000-000000000010', 340,  680, 'emergency', 'Down fill leaked during stuffing process',  '2026-02-14 17:02:00+05:30', uid),
    ('e2000000-0000-0000-0000-000000000011', 'd2000000-0000-0000-0000-000000000011', 1500, 8,   'normal', 'Labels on target',                           '2026-02-14 17:03:00+05:30', uid);

  -- PO-2025-090 actuals (completed, under budget)
  INSERT INTO public.actual_consumptions (id, bom_item_id, actual_qty, actual_rate, reason, notes, consumed_at, user_id) VALUES
    ('e2000000-0000-0000-0000-000000000012', 'd2000000-0000-0000-0000-000000000018', 1350, 870, 'normal', 'Wool quality premium, less waste',           '2025-12-20 16:00:00+05:30', uid),
    ('e2000000-0000-0000-0000-000000000013', 'd2000000-0000-0000-0000-000000000019', 190,  45,  'normal', 'Needles reused across batches',              '2025-12-20 16:01:00+05:30', uid),
    ('e2000000-0000-0000-0000-000000000014', 'd2000000-0000-0000-0000-000000000020', 1800, 6,   'normal', 'All tags applied successfully',              '2025-12-20 16:02:00+05:30', uid);

  -- PO-2025-091 actuals (completed, slight overrun)
  INSERT INTO public.actual_consumptions (id, bom_item_id, actual_qty, actual_rate, reason, notes, consumed_at, user_id) VALUES
    ('e2000000-0000-0000-0000-000000000015', 'd2000000-0000-0000-0000-000000000021', 3450, 425, 'normal', 'Modal fabric price rose mid-order',          '2026-01-08 16:00:00+05:30', uid),
    ('e2000000-0000-0000-0000-000000000016', 'd2000000-0000-0000-0000-000000000022', 4600, 38,  'scope_change', 'Lace trim rework on 200 pieces',             '2026-01-08 16:01:00+05:30', uid),
    ('e2000000-0000-0000-0000-000000000017', 'd2000000-0000-0000-0000-000000000023', 2200, 15,  'normal', 'Hangers all accounted for',                  '2026-01-08 16:02:00+05:30', uid);

  -- ==========================================================
  -- 4. INVENTORY ITEMS (correct columns: item_name, current_stock, minimum_stock, safety_stock, daily_consumption, lead_time_days, unit)
  -- ==========================================================
  INSERT INTO public.inventory_items (id, item_name, current_stock, minimum_stock, safety_stock, daily_consumption, lead_time_days, unit, user_id) VALUES
    ('f2000000-0000-0000-0000-000000000001', 'Organic Cotton Fabric',   880,  300,  150,  45,  7, 'meters',  uid),
    ('f2000000-0000-0000-0000-000000000002', 'Bamboo Fiber Yarn',        40,  100,   50,  25,  10, 'kg',     uid),   -- CRITICAL: below minimum
    ('f2000000-0000-0000-0000-000000000003', 'Recycled Polyester',      150,  200,  100,  60,  5, 'meters',  uid),   -- CRITICAL: below minimum
    ('f2000000-0000-0000-0000-000000000004', 'Hemp Canvas Fabric',     2800,  500,  200,  80,  4, 'meters',  uid),
    ('f2000000-0000-0000-0000-000000000005', 'Silk-Blend Fabric',      1100,  300,  100,  30,  14, 'meters', uid),
    ('f2000000-0000-0000-0000-000000000006', 'Merino Wool Yarn',         50,  200,  100,  35,  12, 'kg',     uid),   -- CRITICAL: below minimum
    ('f2000000-0000-0000-0000-000000000007', 'Metal Zippers',          3200,  500,  200, 100,  3, 'pieces',  uid),
    ('f2000000-0000-0000-0000-000000000008', 'Natural Dye Set',          35,   30,   15,   5, 21, 'kg',      uid),
    ('f2000000-0000-0000-0000-000000000009', 'Down Fill (Synthetic)',   180,  100,   50,  20,  8, 'kg',      uid),
    ('f2000000-0000-0000-0000-000000000010', 'Cotton Thread',          420,  100,   50,  12,  5, 'kg',       uid);

  -- ==========================================================
  -- 5. MATERIAL INVENTORY (correct columns: material_name, current_stock, reorder_level)
  -- ==========================================================
  INSERT INTO public.material_inventory (id, material_name, current_stock, reorder_level, user_id) VALUES
    ('a7000000-0000-0000-0000-000000000001', 'Organic Cotton Fabric',   880,  500,  uid),
    ('a7000000-0000-0000-0000-000000000002', 'Bamboo Fiber Yarn',        40,  200,  uid),
    ('a7000000-0000-0000-0000-000000000003', 'Recycled Polyester',      150,  300,  uid),
    ('a7000000-0000-0000-0000-000000000004', 'Hemp Canvas Fabric',     2800, 1000,  uid),
    ('a7000000-0000-0000-0000-000000000005', 'Silk-Blend Fabric',      1100,  400,  uid),
    ('a7000000-0000-0000-0000-000000000006', 'Merino Wool Yarn',         50,  300,  uid),
    ('a7000000-0000-0000-0000-000000000007', 'Metal Zippers',          3200, 1000,  uid),
    ('a7000000-0000-0000-0000-000000000008', 'Natural Dye Set',          35,   50,  uid);

  -- ==========================================================
  -- 6. PRODUCTION LOGS (correct columns: planned_cost, actual_cost, quantity_used, material_name)
  -- ==========================================================
  INSERT INTO public.production_logs (id, planned_cost, actual_cost, quantity_used, material_name, user_id, created_at) VALUES
    ('a8000000-0000-0000-0000-000000000001', 570000,  639900,  1620, 'Organic Cotton Fabric',  uid, '2026-02-03 10:00:00+05:30'),
    ('a8000000-0000-0000-0000-000000000002',   8550,    8800,    88, 'Cotton Thread',           uid, '2026-02-04 10:00:00+05:30'),
    ('a8000000-0000-0000-0000-000000000003',  57000,   55380,  14200, 'Buttons (Coconut Shell)', uid, '2026-02-05 10:00:00+05:30'),
    ('a8000000-0000-0000-0000-000000000004',  36000,   35000,  2800, 'Eco Packaging',           uid, '2026-02-06 10:00:00+05:30'),
    ('a8000000-0000-0000-0000-000000000005', 416000,  372400,   760, 'Bamboo Fiber Yarn',       uid, '2026-02-07 10:00:00+05:30'),
    ('a8000000-0000-0000-0000-000000000006',  36000,   34200,  1900, 'Elastic Band',            uid, '2026-02-08 10:00:00+05:30'),
    ('a8000000-0000-0000-0000-000000000007',  50000,   49400,  9500, 'Sock Packaging',          uid, '2026-02-09 10:00:00+05:30'),
    ('a8000000-0000-0000-0000-000000000008', 638000,  716750,  2350, 'Recycled Polyester',      uid, '2026-02-10 10:00:00+05:30'),
    ('a8000000-0000-0000-0000-000000000009',  33000,   35520,  1480, 'Metal Zippers',           uid, '2026-02-11 10:00:00+05:30'),
    ('a8000000-0000-0000-0000-000000000010', 195000,  231200,   340, 'Down Fill (Synthetic)',    uid, '2026-02-12 10:00:00+05:30'),
    ('a8000000-0000-0000-0000-000000000011', 672000,  714000,  3200, 'Hemp Canvas Fabric',      uid, '2026-02-13 10:00:00+05:30'),
    ('a8000000-0000-0000-0000-000000000012',  72000,   72000, 16000, 'Cotton Handles',          uid, '2026-02-14 10:00:00+05:30'),
    ('a8000000-0000-0000-0000-000000000013',1246000, 1174500,  1350, 'Merino Wool Yarn',        uid, '2025-12-01 10:00:00+05:30'),
    ('a8000000-0000-0000-0000-000000000014',  9000,    8550,   190, 'Knitting Needles',         uid, '2025-12-05 10:00:00+05:30'),
    ('a8000000-0000-0000-0000-000000000015',1353000, 1466250,  3450, 'Modal Fabric',             uid, '2025-12-15 10:00:00+05:30'),
    ('a8000000-0000-0000-0000-000000000016', 154000,  174800,  4600, 'Lace Trim',                uid, '2025-12-20 10:00:00+05:30'),
    ('a8000000-0000-0000-0000-000000000017', 864000,  907200,  1200, 'Silk-Blend Fabric',        uid, '2026-02-15 10:00:00+05:30'),
    ('a8000000-0000-0000-0000-000000000018',  29000,   27550,    50, 'Natural Dye Set',          uid, '2026-02-16 10:00:00+05:30');

  RAISE NOTICE 'Successfully seeded data for ronnyhamilton189@gmail.com (uid: %)', uid;
END $$;
