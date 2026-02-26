-- ============================================================
-- Nexus Dashboard: Create material_inventory & production_logs
-- Run this in Supabase SQL Editor if auto-migration failed
-- ============================================================

CREATE TABLE IF NOT EXISTS public.material_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  material_name text NOT NULL,
  current_stock numeric NOT NULL DEFAULT 0,
  reorder_level numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.production_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  planned_cost numeric NOT NULL DEFAULT 0,
  actual_cost numeric NOT NULL DEFAULT 0,
  quantity_used numeric NOT NULL DEFAULT 0,
  material_name text NOT NULL
);

-- Enable RLS
ALTER TABLE public.material_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_logs ENABLE ROW LEVEL SECURITY;

-- Allow anonymous full access (demo/hackathon mode)
CREATE POLICY "Allow anonymous read access on material_inventory"
  ON public.material_inventory FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert on material_inventory"
  ON public.material_inventory FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous delete on material_inventory"
  ON public.material_inventory FOR DELETE USING (true);

CREATE POLICY "Allow anonymous read access on production_logs"
  ON public.production_logs FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert on production_logs"
  ON public.production_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous delete on production_logs"
  ON public.production_logs FOR DELETE USING (true);
