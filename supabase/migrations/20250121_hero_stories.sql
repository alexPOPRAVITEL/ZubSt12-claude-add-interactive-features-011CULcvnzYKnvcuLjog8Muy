-- Create hero_stories table for managing Hero Stories carousel
CREATE TABLE IF NOT EXISTS hero_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  title TEXT,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_hero_stories_order ON hero_stories(order_index);

-- Create index for active status
CREATE INDEX IF NOT EXISTS idx_hero_stories_active ON hero_stories(is_active);

-- Enable Row Level Security
ALTER TABLE hero_stories ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to active stories
CREATE POLICY "Public can view active hero stories"
  ON hero_stories
  FOR SELECT
  USING (is_active = true);

-- Create policy to allow authenticated admin users to manage all stories
CREATE POLICY "Admins can manage hero stories"
  ON hero_stories
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Add comment to table
COMMENT ON TABLE hero_stories IS 'Stores hero carousel stories/slides displayed on the main page';

-- Insert default story if table is empty
INSERT INTO hero_stories (url, type, title, description, order_index, is_active)
SELECT
  'https://files.salebot.pro/uploads/file_item/file/449726/GUbc5XlceeL9-5gSQR2xT52WCkDhJOBrx0AmU2sTseS9KQWSVF2Ac9fkTEaKEXJ5Kj7JHp3Pl1doAv238rV-6g__.jpeg',
  'image',
  'Добро пожаловать в Зубную Станцию',
  'Современная стоматология для всей семьи',
  0,
  true
WHERE NOT EXISTS (SELECT 1 FROM hero_stories);
