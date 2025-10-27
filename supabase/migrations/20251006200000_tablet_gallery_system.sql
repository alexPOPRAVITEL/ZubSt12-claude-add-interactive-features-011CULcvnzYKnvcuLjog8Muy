/*
  # Tablet Gallery System

  1. New Tables
    - `gallery_images`
      - `id` (uuid, primary key)
      - `title` (text) - Image title
      - `description` (text) - Image description
      - `image_url` (text) - URL to the image
      - `category` (text) - Category (clinic, team, equipment, results, events)
      - `metadata` (jsonb) - Additional metadata (photographer, dimensions, etc.)
      - `display_order` (integer) - Order for displaying images
      - `is_active` (boolean) - Whether the image is active
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `gallery_images` table
    - Add policy for public read access
    - Add policy for authenticated admin write access
*/

-- Create gallery_images table
CREATE TABLE IF NOT EXISTS gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  image_url text NOT NULL,
  category text NOT NULL DEFAULT 'clinic',
  metadata jsonb DEFAULT '{}',
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_gallery_images_category ON gallery_images(category);
CREATE INDEX IF NOT EXISTS idx_gallery_images_active ON gallery_images(is_active);
CREATE INDEX IF NOT EXISTS idx_gallery_images_order ON gallery_images(display_order);

-- Add trigger to update updated_at
CREATE OR REPLACE FUNCTION update_gallery_images_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER gallery_images_updated_at
  BEFORE UPDATE ON gallery_images
  FOR EACH ROW
  EXECUTE FUNCTION update_gallery_images_updated_at();

-- Enable RLS
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Policy for public read access
CREATE POLICY "Anyone can view active gallery images"
  ON gallery_images
  FOR SELECT
  USING (is_active = true);

-- Policy for admin insert
CREATE POLICY "Authenticated users can insert gallery images"
  ON gallery_images
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy for admin update
CREATE POLICY "Authenticated users can update gallery images"
  ON gallery_images
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy for admin delete
CREATE POLICY "Authenticated users can delete gallery images"
  ON gallery_images
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert sample gallery images
INSERT INTO gallery_images (title, description, image_url, category, display_order) VALUES
  ('Современный кабинет', 'Наш полностью оборудованный стоматологический кабинет с новейшим оборудованием', 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=1200', 'clinic', 1),
  ('Команда профессионалов', 'Наши опытные стоматологи готовы помочь вам', 'https://images.pexels.com/photos/3845622/pexels-photo-3845622.jpeg?auto=compress&cs=tinysrgb&w=1200', 'team', 2),
  ('Инновационное оборудование', 'Передовые технологии для точной диагностики', 'https://images.pexels.com/photos/3845623/pexels-photo-3845623.jpeg?auto=compress&cs=tinysrgb&w=1200', 'equipment', 3),
  ('До и после лечения', 'Примеры успешного восстановления улыбки', 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=1200', 'results', 4),
  ('Консультация пациента', 'Индивидуальный подход к каждому пациенту', 'https://images.pexels.com/photos/6627374/pexels-photo-6627374.jpeg?auto=compress&cs=tinysrgb&w=1200', 'clinic', 5),
  ('Рабочий процесс', 'Точность и внимание к деталям', 'https://images.pexels.com/photos/3845468/pexels-photo-3845468.jpeg?auto=compress&cs=tinysrgb&w=1200', 'team', 6),
  ('Комфортная зона ожидания', 'Приятная атмосфера для наших пациентов', 'https://images.pexels.com/photos/4269492/pexels-photo-4269492.jpeg?auto=compress&cs=tinysrgb&w=1200', 'clinic', 7),
  ('Детская стоматология', 'Дружелюбный подход к маленьким пациентам', 'https://images.pexels.com/photos/8460157/pexels-photo-8460157.jpeg?auto=compress&cs=tinysrgb&w=1200', 'clinic', 8),
  ('День открытых дверей', 'Мероприятие для знакомства с клиникой', 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200', 'events', 9),
  ('Награды и сертификаты', 'Признание нашего профессионализма', 'https://images.pexels.com/photos/6942065/pexels-photo-6942065.jpeg?auto=compress&cs=tinysrgb&w=1200', 'events', 10);
