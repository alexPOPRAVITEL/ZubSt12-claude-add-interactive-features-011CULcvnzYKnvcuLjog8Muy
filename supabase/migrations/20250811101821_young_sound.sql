/*
  # Create FAQ entries table

  1. New Tables
    - `faq_entries`
      - `id` (uuid, primary key)
      - `question` (text, not null)
      - `answer` (text, not null)
      - `category` (text, nullable)
      - `order_index` (integer, default 0)
      - `is_published` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `faq_entries` table
    - Add policy for public users to read published FAQ entries
    - Add policy for authenticated users to manage FAQ entries

  3. Indexes
    - Add index on category for faster filtering
    - Add index on order_index for sorting
    - Add index on is_published for filtering published entries
*/

CREATE TABLE IF NOT EXISTS faq_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text,
  order_index integer DEFAULT 0,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE faq_entries ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public users can read published FAQ entries"
  ON faq_entries
  FOR SELECT
  TO public
  USING (is_published = true);

CREATE POLICY "Authenticated users can manage FAQ entries"
  ON faq_entries
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS faq_entries_category_idx ON faq_entries (category);
CREATE INDEX IF NOT EXISTS faq_entries_order_idx ON faq_entries (order_index);
CREATE INDEX IF NOT EXISTS faq_entries_published_idx ON faq_entries (is_published);

-- Trigger for updating updated_at
CREATE OR REPLACE FUNCTION update_faq_entries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_faq_entries_updated_at
  BEFORE UPDATE ON faq_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_faq_entries_updated_at();

-- Insert sample FAQ data
INSERT INTO faq_entries (question, answer, category, order_index, is_published) VALUES
('Где находится ваша клиника?', 'Наша клиника "Зубная Станция" расположена по адресу: г. Барнаул, ул. Панфиловцев, 14. Мы находимся в центре города, рядом есть удобная парковка.', 'general', 1, true),
('Какой у вас график работы?', 'Мы работаем: Понедельник-Пятница с 8:00 до 20:00, Суббота с 9:00 до 18:00, Воскресенье - выходной. В экстренных случаях принимаем пациентов круглосуточно.', 'general', 2, true),
('Нужна ли предварительная запись?', 'Да, мы работаем по предварительной записи. Это позволяет нам уделить каждому пациенту достаточно времени. Записаться можно по телефону +7 961 978-54-54 или через форму на сайте.', 'appointment', 1, true),
('Сколько стоит консультация?', 'Первичная консультация стоматолога стоит 500 рублей. При записи через сайт консультация БЕСПЛАТНАЯ! Это позволяет врачу оценить состояние ваших зубов и составить план лечения.', 'pricing', 1, true),
('Предоставляете ли вы рассрочку?', 'Да, мы предоставляем беспроцентную рассрочку от клиники на срок до 12 месяцев. Для оформления нужен только паспорт. Рассрочка доступна при сумме лечения от 15 000 рублей.', 'pricing', 2, true),
('Больно ли лечить зубы?', 'Современная стоматология позволяет проводить лечение абсолютно безболезненно. Мы используем качественную анестезию и работаем очень аккуратно. Большинство пациентов отмечают, что лечение прошло комфортнее, чем они ожидали.', 'services', 1, true),
('Как часто нужно делать профессиональную чистку зубов?', 'Рекомендуется проводить профессиональную гигиену полости рта каждые 6 месяцев. Это помогает предотвратить развитие кариеса и заболеваний десен, а также поддерживает здоровье и красоту ваших зубов.', 'prevention', 1, true),
('С какого возраста можно приводить ребенка к стоматологу?', 'Первый визит к стоматологу рекомендуется в возрасте 1 года или в течение 6 месяцев после появления первого зуба. Ранние визиты помогают ребенку привыкнуть к стоматологу и предотвратить проблемы.', 'children', 1, true),
('Что делать при острой зубной боли?', 'При острой боли примите обезболивающее (ибупрофен, кетанов) и немедленно свяжитесь с нами по телефону +7 961 978-54-54. Мы принимаем экстренных пациентов без записи и окажем помощь в кратчайшие сроки.', 'emergency', 1, true);