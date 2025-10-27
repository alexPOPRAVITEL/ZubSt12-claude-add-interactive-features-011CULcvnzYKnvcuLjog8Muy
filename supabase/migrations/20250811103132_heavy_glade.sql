/*
  # Create appointment services system

  1. New Tables
    - `appointment_service_categories`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `order_index` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `appointment_services`
      - `id` (uuid, primary key)
      - `category_id` (uuid, foreign key)
      - `name` (text)
      - `duration` (text)
      - `price` (numeric)
      - `description` (text)
      - `order_index` (integer)
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  2. Security
    - Enable RLS on both tables
    - Add policies for public read and authenticated write
  3. Sample Data
    - Insert default categories and services
*/

-- Create appointment service categories table
CREATE TABLE IF NOT EXISTS appointment_service_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create appointment services table
CREATE TABLE IF NOT EXISTS appointment_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES appointment_service_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  duration text,
  price numeric,
  description text,
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE appointment_service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_services ENABLE ROW LEVEL SECURITY;

-- Create policies for appointment_service_categories
CREATE POLICY "Public users can read appointment categories"
  ON appointment_service_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage appointment categories"
  ON appointment_service_categories
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for appointment_services
CREATE POLICY "Public users can read active appointment services"
  ON appointment_services
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage appointment services"
  ON appointment_services
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS appointment_service_categories_order_idx ON appointment_service_categories(order_index);
CREATE INDEX IF NOT EXISTS appointment_services_category_idx ON appointment_services(category_id);
CREATE INDEX IF NOT EXISTS appointment_services_active_idx ON appointment_services(is_active);
CREATE INDEX IF NOT EXISTS appointment_services_order_idx ON appointment_services(order_index);

-- Insert default categories
INSERT INTO appointment_service_categories (name, order_index) VALUES
  ('Терапевтическая стоматология', 1),
  ('Ортодонтия', 2),
  ('Имплантология', 3),
  ('Хирургическая стоматология', 4),
  ('Ортопедия', 5),
  ('Детская стоматология', 6),
  ('Профилактика и гигиена', 7),
  ('Диагностика', 8)
ON CONFLICT (name) DO NOTHING;

-- Insert default services for each category
DO $$
DECLARE
  therapy_id uuid;
  orthodontics_id uuid;
  implantology_id uuid;
  surgery_id uuid;
  prosthetics_id uuid;
  pediatric_id uuid;
  prevention_id uuid;
  diagnostics_id uuid;
BEGIN
  -- Get category IDs
  SELECT id INTO therapy_id FROM appointment_service_categories WHERE name = 'Терапевтическая стоматология';
  SELECT id INTO orthodontics_id FROM appointment_service_categories WHERE name = 'Ортодонтия';
  SELECT id INTO implantology_id FROM appointment_service_categories WHERE name = 'Имплантология';
  SELECT id INTO surgery_id FROM appointment_service_categories WHERE name = 'Хирургическая стоматология';
  SELECT id INTO prosthetics_id FROM appointment_service_categories WHERE name = 'Ортопедия';
  SELECT id INTO pediatric_id FROM appointment_service_categories WHERE name = 'Детская стоматология';
  SELECT id INTO prevention_id FROM appointment_service_categories WHERE name = 'Профилактика и гигиена';
  SELECT id INTO diagnostics_id FROM appointment_service_categories WHERE name = 'Диагностика';

  -- Insert services for Терапевтическая стоматология
  INSERT INTO appointment_services (category_id, name, duration, price, description, order_index) VALUES
    (therapy_id, 'Консультация', '30 мин', 600, 'Первичный осмотр и консультация', 1),
    (therapy_id, 'Лечение кариеса', 'от 30 мин', 3550, 'Лечение кариеса с пломбировкой', 2),
    (therapy_id, 'Лечение пульпита', 'от 60 мин', 7800, 'Лечение воспаления нерва', 3),
    (therapy_id, 'Лечение периодонтита', 'от 90 мин', 12400, 'Лечение воспаления тканей вокруг корня', 4),
    (therapy_id, 'Художественная реставрация', 'от 60 мин', 4500, 'Восстановление формы и цвета зуба', 5);

  -- Insert services for Ортодонтия
  INSERT INTO appointment_services (category_id, name, duration, price, description, order_index) VALUES
    (orthodontics_id, 'Консультация ортодонта', '45 мин', 1500, 'Осмотр и план лечения прикуса', 1),
    (orthodontics_id, 'Установка брекетов', '90 мин', 40000, 'Установка брекет-системы', 2),
    (orthodontics_id, 'Коррекция брекетов', '30 мин', 2500, 'Плановая коррекция брекет-системы', 3),
    (orthodontics_id, 'Снятие брекетов', '60 мин', 8000, 'Снятие брекет-системы и установка ретейнеров', 4);

  -- Insert services for Имплантология
  INSERT INTO appointment_services (category_id, name, duration, price, description, order_index) VALUES
    (implantology_id, 'Консультация имплантолога', '45 мин', 1000, 'Планирование имплантации', 1),
    (implantology_id, 'Установка импланта', '60 мин', 25000, 'Хирургическая установка импланта', 2),
    (implantology_id, 'Синус-лифтинг', '90 мин', 15000, 'Наращивание костной ткани', 3),
    (implantology_id, 'Костная пластика', '90 мин', 12000, 'Восстановление объема кости', 4);

  -- Insert services for Хирургическая стоматология
  INSERT INTO appointment_services (category_id, name, duration, price, description, order_index) VALUES
    (surgery_id, 'Удаление зуба простое', '30 мин', 1500, 'Простое удаление зуба', 1),
    (surgery_id, 'Удаление зуба сложное', '45 мин', 3500, 'Сложное удаление зуба', 2),
    (surgery_id, 'Удаление зуба мудрости', '60 мин', 5000, 'Удаление зуба мудрости', 3),
    (surgery_id, 'Резекция верхушки корня', '90 мин', 8000, 'Хирургическое лечение кисты', 4);

  -- Insert services for Ортопедия
  INSERT INTO appointment_services (category_id, name, duration, price, description, order_index) VALUES
    (prosthetics_id, 'Консультация ортопеда', '30 мин', 800, 'Планирование протезирования', 1),
    (prosthetics_id, 'Установка коронки', '60 мин', 11000, 'Установка коронки на зуб', 2),
    (prosthetics_id, 'Установка винира', '90 мин', 25000, 'Установка керамического винира', 3),
    (prosthetics_id, 'Съемное протезирование', '60 мин', 25000, 'Изготовление съемного протеза', 4);

  -- Insert services for Детская стоматология
  INSERT INTO appointment_services (category_id, name, duration, price, description, order_index) VALUES
    (pediatric_id, 'Консультация детского стоматолога', '30 мин', 1000, 'Осмотр ребенка', 1),
    (pediatric_id, 'Лечение молочных зубов', '30 мин', 3500, 'Лечение кариеса молочных зубов', 2),
    (pediatric_id, 'Герметизация фиссур', '30 мин', 2000, 'Профилактическая герметизация', 3),
    (pediatric_id, 'Серебрение зубов', '20 мин', 1500, 'Профилактическое серебрение', 4);

  -- Insert services for Профилактика и гигиена
  INSERT INTO appointment_services (category_id, name, duration, price, description, order_index) VALUES
    (prevention_id, 'Профессиональная гигиена', '60 мин', 4400, 'Комплексная чистка зубов', 1),
    (prevention_id, 'Чистка AirFlow', '45 мин', 2700, 'Удаление налета методом AirFlow', 2),
    (prevention_id, 'Фторирование зубов', '20 мин', 800, 'Укрепление эмали фтором', 3),
    (prevention_id, 'Отбеливание ZOOM', '90 мин', 10000, 'Профессиональное отбеливание', 4);

  -- Insert services for Диагностика
  INSERT INTO appointment_services (category_id, name, duration, price, description, order_index) VALUES
    (diagnostics_id, 'Прицельный снимок', '5 мин', 350, 'Рентген одного зуба', 1),
    (diagnostics_id, 'Панорамный снимок', '10 мин', 1200, 'Обзорный снимок всех зубов', 2),
    (diagnostics_id, '3D диагностика (КТ)', '15 мин', 2500, 'Компьютерная томография', 3);
END $$;