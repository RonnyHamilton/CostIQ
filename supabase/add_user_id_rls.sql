-- ============================================================
-- CostIQ: Multi-Tenant Data Isolation
-- Adds user_id to all tables, backfills existing data to
-- ronnyhamilton21@gmail.com, and replaces open RLS policies.
--
-- Run this in: Supabase SQL Editor
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. ADD user_id COLUMN TO ALL TABLES
-- ────────────────────────────────────────────────────────────

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

ALTER TABLE public.bom_items
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

ALTER TABLE public.actual_consumptions
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

ALTER TABLE public.inventory_items
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

ALTER TABLE public.material_inventory
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

ALTER TABLE public.production_logs
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- ────────────────────────────────────────────────────────────
-- 2. BACKFILL: Assign ALL existing rows to ronnyhamilton21@gmail.com
-- ────────────────────────────────────────────────────────────

DO $$
DECLARE
  target_uid uuid;
BEGIN
  SELECT id INTO target_uid
    FROM auth.users
   WHERE email = 'ronnyhamilton21@gmail.com'
   LIMIT 1;

  IF target_uid IS NULL THEN
    RAISE EXCEPTION 'User ronnyhamilton21@gmail.com not found in auth.users. Please sign up first.';
  END IF;

  UPDATE public.orders             SET user_id = target_uid WHERE user_id IS NULL;
  UPDATE public.bom_items          SET user_id = target_uid WHERE user_id IS NULL;
  UPDATE public.actual_consumptions SET user_id = target_uid WHERE user_id IS NULL;
  UPDATE public.inventory_items    SET user_id = target_uid WHERE user_id IS NULL;
  UPDATE public.material_inventory SET user_id = target_uid WHERE user_id IS NULL;
  UPDATE public.production_logs    SET user_id = target_uid WHERE user_id IS NULL;

  RAISE NOTICE 'All existing data assigned to user %', target_uid;
END $$;

-- ────────────────────────────────────────────────────────────
-- 3. MAKE user_id NOT NULL with DEFAULT auth.uid()
--    So new inserts automatically get the current user
-- ────────────────────────────────────────────────────────────

ALTER TABLE public.orders
  ALTER COLUMN user_id SET NOT NULL,
  ALTER COLUMN user_id SET DEFAULT auth.uid();

ALTER TABLE public.bom_items
  ALTER COLUMN user_id SET NOT NULL,
  ALTER COLUMN user_id SET DEFAULT auth.uid();

ALTER TABLE public.actual_consumptions
  ALTER COLUMN user_id SET NOT NULL,
  ALTER COLUMN user_id SET DEFAULT auth.uid();

ALTER TABLE public.inventory_items
  ALTER COLUMN user_id SET NOT NULL,
  ALTER COLUMN user_id SET DEFAULT auth.uid();

ALTER TABLE public.material_inventory
  ALTER COLUMN user_id SET NOT NULL,
  ALTER COLUMN user_id SET DEFAULT auth.uid();

ALTER TABLE public.production_logs
  ALTER COLUMN user_id SET NOT NULL,
  ALTER COLUMN user_id SET DEFAULT auth.uid();

-- ────────────────────────────────────────────────────────────
-- 4. DROP OLD OPEN RLS POLICIES
-- ────────────────────────────────────────────────────────────

-- orders
DROP POLICY IF EXISTS "Allow all on orders" ON public.orders;

-- bom_items
DROP POLICY IF EXISTS "Allow all on bom_items" ON public.bom_items;

-- actual_consumptions
DROP POLICY IF EXISTS "Allow all on actual_consumptions" ON public.actual_consumptions;

-- inventory_items
DROP POLICY IF EXISTS "Allow all on inventory_items" ON public.inventory_items;

-- material_inventory
DROP POLICY IF EXISTS "Allow anonymous read access on material_inventory" ON public.material_inventory;
DROP POLICY IF EXISTS "Allow anonymous insert on material_inventory" ON public.material_inventory;
DROP POLICY IF EXISTS "Allow anonymous delete on material_inventory" ON public.material_inventory;

-- production_logs
DROP POLICY IF EXISTS "Allow anonymous read access on production_logs" ON public.production_logs;
DROP POLICY IF EXISTS "Allow anonymous insert on production_logs" ON public.production_logs;
DROP POLICY IF EXISTS "Allow anonymous delete on production_logs" ON public.production_logs;

-- ────────────────────────────────────────────────────────────
-- 5. CREATE NEW USER-SCOPED RLS POLICIES
-- ────────────────────────────────────────────────────────────

-- orders
CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders"
  ON public.orders FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own orders"
  ON public.orders FOR DELETE
  USING (auth.uid() = user_id);

-- bom_items
CREATE POLICY "Users can view own bom_items"
  ON public.bom_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bom_items"
  ON public.bom_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bom_items"
  ON public.bom_items FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bom_items"
  ON public.bom_items FOR DELETE
  USING (auth.uid() = user_id);

-- actual_consumptions
CREATE POLICY "Users can view own actual_consumptions"
  ON public.actual_consumptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own actual_consumptions"
  ON public.actual_consumptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own actual_consumptions"
  ON public.actual_consumptions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own actual_consumptions"
  ON public.actual_consumptions FOR DELETE
  USING (auth.uid() = user_id);

-- inventory_items
CREATE POLICY "Users can view own inventory_items"
  ON public.inventory_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own inventory_items"
  ON public.inventory_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own inventory_items"
  ON public.inventory_items FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own inventory_items"
  ON public.inventory_items FOR DELETE
  USING (auth.uid() = user_id);

-- material_inventory
CREATE POLICY "Users can view own material_inventory"
  ON public.material_inventory FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own material_inventory"
  ON public.material_inventory FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own material_inventory"
  ON public.material_inventory FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own material_inventory"
  ON public.material_inventory FOR DELETE
  USING (auth.uid() = user_id);

-- production_logs
CREATE POLICY "Users can view own production_logs"
  ON public.production_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own production_logs"
  ON public.production_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own production_logs"
  ON public.production_logs FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own production_logs"
  ON public.production_logs FOR DELETE
  USING (auth.uid() = user_id);

-- ────────────────────────────────────────────────────────────
-- DONE: Multi-tenant isolation is now active.
--   - All 6 tables have user_id with DEFAULT auth.uid()
--   - Existing data belongs to ronnyhamilton21@gmail.com
--   - RLS enforces user_id = auth.uid() on every operation
-- ────────────────────────────────────────────────────────────
