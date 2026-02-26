-- CostIQ Database Migration
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/qxdvohfgtzpyhdkbegym/sql

-- ─── Enums ───────────────────────────────────────────────────────────────────

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
    CREATE TYPE order_status AS ENUM ('draft', 'active', 'completed');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'consumption_reason') THEN
    CREATE TYPE consumption_reason AS ENUM ('normal', 'emergency', 'scope_change', 'market_fluctuation', 'supplier_delay');
  END IF;
END $$;

-- ─── Orders ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  status order_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── BOM Items (Planned) ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS bom_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  planned_qty NUMERIC(12,3) NOT NULL,
  planned_rate NUMERIC(12,2) NOT NULL,
  unit TEXT NOT NULL DEFAULT 'units',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Actual Consumptions ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS actual_consumptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bom_item_id UUID NOT NULL REFERENCES bom_items(id) ON DELETE CASCADE,
  actual_qty NUMERIC(12,3) NOT NULL,
  actual_rate NUMERIC(12,2) NOT NULL,
  reason consumption_reason NOT NULL DEFAULT 'normal',
  notes TEXT,
  consumed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Inventory Items ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_name TEXT NOT NULL,
  current_stock NUMERIC(12,3) NOT NULL,
  minimum_stock NUMERIC(12,3) NOT NULL,
  safety_stock NUMERIC(12,3) NOT NULL,
  daily_consumption NUMERIC(12,3) NOT NULL CHECK (daily_consumption > 0),
  lead_time_days INTEGER NOT NULL,
  unit TEXT NOT NULL DEFAULT 'units',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Enable Row Level Security ────────────────────────────────────────────────

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE bom_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE actual_consumptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;

-- Allow all for now (hackathon mode - no auth)
CREATE POLICY "Allow all on orders" ON orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on bom_items" ON bom_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on actual_consumptions" ON actual_consumptions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on inventory_items" ON inventory_items FOR ALL USING (true) WITH CHECK (true);

-- ─── Seed Data ────────────────────────────────────────────────────────────────

-- Orders
INSERT INTO orders (id, order_number, description, status) VALUES
  ('11111111-0000-0000-0000-000000000001', 'PO-2024-001', 'Summer Collection - Batch A', 'active'),
  ('11111111-0000-0000-0000-000000000002', 'PO-2024-002', 'Export Order - EU Market', 'active'),
  ('11111111-0000-0000-0000-000000000003', 'PO-2024-003', 'Domestic Retail - Q4', 'completed'),
  ('11111111-0000-0000-0000-000000000004', 'PO-2024-004', 'Corporate Uniform Order', 'draft')
ON CONFLICT (order_number) DO NOTHING;

-- BOM Items
INSERT INTO bom_items (id, order_id, item_name, planned_qty, planned_rate, unit) VALUES
  ('22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'Cotton Fabric', 100, 250, 'kg'),
  ('22222222-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000001', 'Polyester Thread', 50, 80, 'cones'),
  ('22222222-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000001', 'Buttons (Metal)', 500, 5, 'pcs'),
  ('22222222-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000002', 'Denim Fabric', 200, 380, 'kg'),
  ('22222222-0000-0000-0000-000000000005', '11111111-0000-0000-0000-000000000002', 'Zipper (YKK)', 300, 45, 'pcs'),
  ('22222222-0000-0000-0000-000000000006', '11111111-0000-0000-0000-000000000003', 'Linen Fabric', 80, 420, 'kg'),
  ('22222222-0000-0000-0000-000000000007', '11111111-0000-0000-0000-000000000003', 'Cotton Thread', 40, 75, 'cones'),
  ('22222222-0000-0000-0000-000000000008', '11111111-0000-0000-0000-000000000004', 'Khaki Fabric', 150, 290, 'kg')
ON CONFLICT DO NOTHING;

-- Actual Consumptions
INSERT INTO actual_consumptions (bom_item_id, actual_qty, actual_rate, reason, notes) VALUES
  ('22222222-0000-0000-0000-000000000001', 110, 260, 'normal', NULL),
  ('22222222-0000-0000-0000-000000000001', 5, 280, 'emergency', 'Extra fabric for rework'),
  ('22222222-0000-0000-0000-000000000002', 55, 85, 'market_fluctuation', 'Price increase from supplier'),
  ('22222222-0000-0000-0000-000000000003', 480, 5, 'normal', NULL),
  ('22222222-0000-0000-0000-000000000004', 195, 375, 'normal', NULL),
  ('22222222-0000-0000-0000-000000000005', 310, 48, 'scope_change', 'Client requested extra units'),
  ('22222222-0000-0000-0000-000000000006', 82, 430, 'normal', NULL),
  ('22222222-0000-0000-0000-000000000007', 38, 72, 'normal', NULL);

-- Inventory Items
INSERT INTO inventory_items (item_name, current_stock, minimum_stock, safety_stock, daily_consumption, lead_time_days, unit) VALUES
  ('Cotton Fabric', 80, 30, 40, 15, 3, 'kg'),
  ('Polyester Thread', 60, 20, 30, 8, 2, 'cones'),
  ('Denim Fabric', 45, 25, 35, 20, 4, 'kg'),
  ('Buttons (Metal)', 800, 200, 300, 100, 2, 'pcs'),
  ('Zipper (YKK)', 150, 50, 80, 30, 3, 'pcs'),
  ('Linen Fabric', 120, 40, 50, 12, 5, 'kg'),
  ('Cotton Thread', 90, 25, 35, 10, 2, 'cones'),
  ('Khaki Fabric', 30, 20, 40, 18, 4, 'kg'),
  ('Elastic Band', 500, 100, 150, 60, 2, 'meters'),
  ('Velcro Strip', 200, 80, 100, 40, 3, 'meters')
ON CONFLICT DO NOTHING;
