/*
  # Add promotions table

  1. New Tables
    - `promotions`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `description` (text, not null)
      - `badge` (text)
      - `old_price` (numeric)
      - `new_price` (numeric or text)
      - `validity` (text)
      - `image` (text)
      - `featured` (boolean)
      - `category` (text)
      - `is_published` (boolean)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)
  
  2. Security
    - Enable RLS on `promotions` table
    - Add policies for authenticated and public users
*/

-- Create promotions table
CREATE TABLE IF NOT EXISTS promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  badge text,
  old_price numeric,
  new_price text NOT NULL,
  validity text,
  image text,
  featured boolean DEFAULT false,
  category text,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authenticated users can manage promotions"
  ON promotions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public users can read published promotions"
  ON promotions
  FOR SELECT
  TO public
  USING (is_published = true);

-- Add sample data
INSERT INTO promotions (title, description, badge, old_price, new_price, validity, image, featured, category)
VALUES
  ('Первичная консультация + диагностика', 'Комплексная консультация специалиста + панорамный снимок + план лечения', '-50%', 2000, '1000', '31 марта 2025', 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=600', true, 'new_patients'),
  ('Профессиональная гигиена полости рта', 'Комплексная чистка зубов с использованием ультразвука и Air Flow', '-30%', 4000, '2800', '28 февраля 2025', 'https://images.pexels.com/photos/3845623/pexels-photo-3845623.jpeg?auto=compress&cs=tinysrgb&w=600', false, 'hygiene'),
  ('Семейная программа "Здоровая улыбка"', 'При лечении всей семьи - скидка 15% + бесплатная консультация детского стоматолога', 'ПОДАРОК', NULL, 'Скидка 15%', 'Постоянная акция', 'https://images.pexels.com/photos/6812540/pexels-photo-6812540.jpeg?auto=compress&cs=tinysrgb&w=600', false, 'family'),
  ('Имплантация "под ключ"', 'Имплант + коронка по специальной цене. Рассрочка без переплат на 12 месяцев', '-25%', 50000, '37500', '30 апреля 2025', 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=600', false, 'implants'),
  ('Исправление прикуса', 'Установка брекет-системы со скидкой. Рассрочка на весь период лечения', '-20%', 40000, '32000', '31 мая 2025', 'https://images.pexels.com/photos/6812540/pexels-photo-6812540.jpeg?auto=compress&cs=tinysrgb&w=600', false, 'orthodontics'),
  ('Скидка для пенсионеров', 'Постоянная скидка 10% для пенсионеров на все виды лечения', 'СКИДКА', NULL, 'Скидка 10%', 'Постоянная скидка', 'https://images.pexels.com/photos/3845623/pexels-photo-3845623.jpeg?auto=compress&cs=tinysrgb&w=600', false, 'social');