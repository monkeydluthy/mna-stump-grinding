-- Supabase Database Setup for M&A Stump Grinding Portfolio
-- Run this SQL in your Supabase SQL Editor

-- Create portfolio_items table
CREATE TABLE IF NOT EXISTS portfolio_items (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('standalone', 'gallery', 'before-after')),
  media_type TEXT,
  cloudinary_url TEXT,
  cloudinary_public_id TEXT,
  filename TEXT, -- For compatibility
  images JSONB, -- Array of image URLs for gallery type
  cloudinary_public_ids JSONB, -- Array of public IDs for gallery type
  before_image TEXT,
  after_image TEXT,
  before_image_cloudinary_url TEXT,
  after_image_cloudinary_url TEXT,
  description TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_portfolio_items_type ON portfolio_items(type);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_uploaded_at ON portfolio_items(uploaded_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON portfolio_items
  FOR SELECT
  USING (true);

-- Create policy to allow authenticated inserts (we'll handle auth in the function)
CREATE POLICY "Allow authenticated inserts" ON portfolio_items
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow authenticated updates
CREATE POLICY "Allow authenticated updates" ON portfolio_items
  FOR UPDATE
  USING (true);

-- Create policy to allow authenticated deletes
CREATE POLICY "Allow authenticated deletes" ON portfolio_items
  FOR DELETE
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_portfolio_items_updated_at
  BEFORE UPDATE ON portfolio_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

