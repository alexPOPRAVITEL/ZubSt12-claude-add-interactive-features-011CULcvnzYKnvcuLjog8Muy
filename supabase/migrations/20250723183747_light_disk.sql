/*
  # Create marketplace tables

  1. New Tables
    - `marketplace_items`
      - `id` (uuid, primary key)
      - `name` (text)
      - `price` (numeric)
      - `original_price` (numeric, nullable)
      - `category` (text)
      - `image` (text)
      - `description` (text)
      - `duration` (text, nullable)
      - `rating` (numeric)
      - `popular` (boolean)
      - `free` (boolean)
      - `is_published` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `promo_codes`
      - `id` (uuid, primary key)
      - `code` (text, unique)
      - `discount_value` (numeric)
      - `discount_type` (text)
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `expires_at` (timestamp, nullable)
    
    - `orders`
      - `id` (uuid, primary key)
      - `customer_name` (text)
      - `customer_phone` (text)
      - `customer_email` (text, nullable)
      - `items` (jsonb)
      - `subtotal` (numeric)
      - `discount` (numeric)
      - `total` (numeric)
      - `promo_code` (text, nullable)
      - `service_type` (text)
      - `payment_method` (text)
      - `is_gift` (boolean)
      - `notifications` (boolean)
      - `status` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access to marketplace_items and promo_codes
    - Add policies for authenticated users to manage orders
*/

-- Create marketplace_items table
CREATE TABLE IF NOT EXISTS marketplace_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price numeric NOT NULL,
  original_price numeric,
  category text NOT NULL CHECK (category IN ('services', 'products')),
  image text NOT NULL,
  description text NOT NULL,
  duration text,
  rating numeric DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5),
  popular boolean DEFAULT false,
  free boolean DEFAULT false,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create promo_codes table
CREATE TABLE IF NOT EXISTS promo_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  discount_value numeric NOT NULL,
  discount_type text NOT NULL CHECK (discount_type IN ('fixed', 'percent')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text,
  items jsonb NOT NULL,
  subtotal numeric NOT NULL,
  discount numeric DEFAULT 0,
  total numeric NOT NULL,
  promo_code text,
  service_type text DEFAULT 'clinic',
  payment_method text DEFAULT 'online',
  is_gift boolean DEFAULT false,
  notifications boolean DEFAULT true,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE marketplace_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies for marketplace_items
CREATE POLICY "Public users can read published marketplace items"
  ON marketplace_items
  FOR SELECT
  TO public
  USING (is_published = true);

CREATE POLICY "Authenticated users can manage marketplace items"
  ON marketplace_items
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for promo_codes
CREATE POLICY "Public users can read active promo codes"
  ON promo_codes
  FOR SELECT
  TO public
  USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));

CREATE POLICY "Authenticated users can manage promo codes"
  ON promo_codes
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for orders
CREATE POLICY "Anyone can create orders"
  ON orders
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage orders"
  ON orders
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert sample marketplace items
INSERT INTO marketplace_items (name, price, original_price, category, image, description, duration, rating, popular, free) VALUES
('Профессиональная гигиена + Air Flow', 2500, 3000, 'services', '🦷', 'Комплексная чистка зубов с удалением налета', '60 мин', 4.9, true, false),
('Отбеливание ZOOM 4', 15000, 18000, 'services', '✨', 'Профессиональное отбеливание на 6-8 тонов', '90 мин', 4.8, false, false),
('Лечение кариеса (1 зуб)', 3500, null, 'services', '🩺', 'Лечение кариеса с композитной пломбой', '45 мин', 4.9, false, false),
('Домашний набор CURAPROX', 1490, 1790, 'products', '🪥', 'Зубная щетка + паста + ополаскиватель', null, 4.7, true, false),
('Первичный осмотр врача', 0, 500, 'services', '👨‍⚕️', 'Бесплатная консультация и диагностика', '30 мин', 5.0, false, true),
('Капы для отбеливания', 2500, null, 'products', '🦷', 'Индивидуальные капы + гель для домашнего отбеливания', null, 4.6, false, false),
('Установка виниров (1 зуб)', 25000, 30000, 'services', '💎', 'Керамические виниры E-max', '120 мин', 4.9, false, false),
('VIP набор для ухода', 3990, 4500, 'products', '🎁', 'Премиум набор: щетка, паста, нить, ополаскиватель', null, 4.8, true, false);

-- Insert sample promo codes
INSERT INTO promo_codes (code, discount_value, discount_type, is_active) VALUES
('ЗУБКЛУБ', 500, 'fixed', true),
('ПЕРВЫЙ', 10, 'percent', true),
('СЕМЬЯ', 15, 'percent', true);