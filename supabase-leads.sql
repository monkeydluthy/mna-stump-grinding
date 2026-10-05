-- Supabase leads table for M&A Stump Grinding
-- Run this SQL in your Supabase SQL Editor (same project as portfolio_items)

CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  city_zip TEXT,
  service_needed TEXT,
  message TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON leads
  FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated inserts" ON leads
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow authenticated updates" ON leads
  FOR UPDATE
  USING (true);

CREATE POLICY "Allow authenticated deletes" ON leads
  FOR DELETE
  USING (true);

-- Reuse existing update_updated_at_column() from supabase-setup.sql if present
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
