/*
  # Create doctors table

  1. New Tables
    - `doctors`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `specialization` (text, not null)
      - `experience_years` (integer, not null)
      - `education` (text)
      - `photo_url` (text)
      - `bio` (text)
      - `phone` (text)
      - `email` (text)
      - `schedule` (text)
      - `is_active` (boolean, default true)
      - `quote` (text)
      - `achievements` (text array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `doctors` table
    - Add policy for public users to read active doctors
    - Add policy for authenticated users to manage doctors

  3. Triggers
    - Add trigger to update `updated_at` on changes
*/

-- Create the doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  specialization text NOT NULL,
  experience_years integer NOT NULL,
  education text,
  photo_url text,
  bio text,
  phone text,
  email text,
  schedule text,
  is_active boolean DEFAULT true,
  quote text,
  achievements text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public users can read active doctors"
  ON doctors
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage doctors"
  ON doctors
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_doctors_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_doctors_updated_at
  BEFORE UPDATE ON doctors
  FOR EACH ROW
  EXECUTE FUNCTION update_doctors_updated_at();

-- Insert sample doctors data
INSERT INTO doctors (name, specialization, experience_years, education, photo_url, bio, phone, email, schedule, quote, achievements) VALUES
(
  'Голева Наталья Федоровна',
  'Главный врач, стоматолог-терапевт',
  8,
  'АГМУ им. И.И. Мечникова',
  'https://files.salebot.pro/uploads/file_item/file/449726/GUbc5XlceeL9-5gSQR2xTyFmVc7rUYnBIAdTMNUvkXgvqpHYf6rnuGWdpW2EenCV8eRtPuZoTG2J_Ho7K11YQw__.jpeg',
  'Главный врач и основатель клиники "Зубная Станция". Специализируется на терапевтической стоматологии и работе под микроскопом.',
  '+7 961 978-54-54',
  'goleva@zubst.ru',
  'Пн-Пт: 9:00-20:00, Сб: 9:00-18:00',
  'Сначала выслушиваю, что беспокоит. Составляю несколько планов лечения с разным бюджетом. Никого не принуждаю — решение всегда за пациентом.',
  ARRAY['Провела 2500+ процедур лечения кариеса', '98% пациентов возвращаются повторно', 'Автор 5 статей о современных методах лечения', 'Регулярно проходит обучение в Москве']
),
(
  'Сенько Анна Юрьевна',
  'Заместитель главного врача',
  6,
  'АГМУ им. И.И. Мечникова',
  'https://files.salebot.pro/uploads/file_item/file/449726/IMG_6510.JPG',
  'Заместитель главного врача, специалист по управлению качеством медицинских услуг.',
  '+7 961 978-54-54',
  'senko@zubst.ru',
  'Пн-Пт: 9:00-20:00',
  'Моя главная задача — сделать так, чтобы каждый пациент чувствовал заботу и внимание. Создаю атмосферу, где лечение становится комфортным.',
  ARRAY['Управляет командой из 10 специалистов', 'Внедрила систему контроля качества', 'Сертификат по менеджменту в медицине', 'Организовала 50+ семинаров для персонала']
),
(
  'Голев Александр Леонидович',
  'Управляющий партнёр | Стратегический директор',
  10,
  'MBA в области управления здравоохранением',
  'https://files.salebot.pro/uploads/file_item/file/449726/GUbc5XlceeL9-5gSQR2xT1AndniRhYgyfUjC6UKvovYly4mKTa_zN-lAh3eW4Qd_YRuDyqCRBxlqd6s86ihYxw__.jpeg',
  'Управляющий партнёр и стратегический директор клиники. Отвечает за развитие бизнеса и стратегическое планирование.',
  '+7 961 978-54-54',
  'golev@zubst.ru',
  'Консультации по записи',
  'Врачи лечат зубы, а я лечу систему. Моя задача — чтобы каждый пациент получил максимум заботы и профессионализма.',
  ARRAY['Создал уникальную модель семейной стоматологии', 'Внедрил систему рассрочки без процентов', 'Открыл 3 успешные медицинские клиники', 'MBA в области управления здравоохранением']
),
(
  'Янина Анастасия Юрьевна',
  'Стоматолог общей практики (терапевт)',
  5,
  'АГМУ им. И.И. Мечникова',
  'https://files.salebot.pro/uploads/file_item/file/449726/янина.jpeg',
  'Стоматолог-терапевт, специализируется на эстетической реставрации зубов.',
  '+7 961 978-54-54',
  'yanina@zubst.ru',
  'Пн-Пт: 9:00-20:00, Сб: 9:00-15:00',
  'Каждый зуб — это маленькое произведение искусства. Восстанавливаю не просто функцию, а красоту улыбки.',
  ARRAY['Специализируется на эстетической реставрации', 'Провела 1800+ процедур без боли', 'Сертификат по работе с микроскопом', 'Любимый врач у 200+ семей']
),
(
  'Ефимов Александр Вячеславович',
  'Стоматолог-ортопед',
  12,
  'МГМСУ им. А.И. Евдокимова',
  'https://files.salebot.pro/uploads/file_item/file/449726/ефимов.jpeg',
  'Врач-ортопед с большим опытом в протезировании и восстановлении зубов.',
  '+7 961 978-54-54',
  'efimov@zubst.ru',
  'Вт-Сб: 10:00-19:00',
  'Протезирование — это возвращение уверенности. Создаю коронки и протезы, которые служат десятилетиями.',
  ARRAY['Изготовил 3000+ коронок и протезов', 'Специалист по цифровому протезированию', 'Работает с CAD/CAM технологиями', 'Средний срок службы работ: 15+ лет']
),
(
  'Саакян Давид Саркисович',
  'Стоматолог-хирург',
  7,
  'МГМСУ им. А.И. Евдокимова',
  'https://files.salebot.pro/uploads/file_item/file/449726/Саакян.jpeg',
  'Врач-хирург, специализируется на сложных удалениях и хирургических вмешательствах.',
  '+7 961 978-54-54',
  'saakyan@zubst.ru',
  'Пн-Ср-Пт: 10:00-18:00',
  'Хирургия — это последний шанс спасти зуб. Использую малоинвазивные методы и всегда стараюсь сохранить.',
  ARRAY['Провёл 2000+ хирургических вмешательств', 'Специалист по сложным удалениям', 'Сертификат по костной пластике', '99% операций без осложнений']
),
(
  'Языков Вячеслав Александрович',
  'Имплантолог, хирург высшей категории',
  15,
  'МГМСУ им. А.И. Евдокимова',
  'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Имплантолог с большим опытом, специализируется на сложных случаях имплантации.',
  '+7 961 978-54-54',
  'yazykov@zubst.ru',
  'Пн-Чт: 9:00-17:00',
  'Имплантация — это возвращение к полноценной жизни. Каждый имплант устанавливаю как для себя.',
  ARRAY['Установил 1500+ имплантов', 'Приживаемость имплантов: 99.2%', 'Специалист по сложным случаям', 'Обучался в Германии и Швейцарии']
),
(
  'Колчина Анастасия Сергеевна',
  'Детский стоматолог',
  4,
  'АГМУ им. И.И. Мечникова',
  'https://files.salebot.pro/uploads/file_item/file/449726/колчина.jpeg',
  'Детский стоматолог, специализируется на работе с детьми всех возрастов.',
  '+7 961 978-54-54',
  'kolchina@zubst.ru',
  'Пн-Пт: 9:00-18:00, Сб: 9:00-15:00',
  'Превращаю поход к стоматологу в увлекательное приключение. Дети уходят с подарками и улыбками.',
  ARRAY['Вылечила 800+ детских зубиков', 'Создала уникальную игровую методику', 'Сертификат по детской психологии', '95% детей не боятся повторных визитов']
),
(
  'Новикова Екатерина Романовна',
  'Врач-ортодонт',
  6,
  'МГМСУ им. А.И. Евдокимова',
  'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Врач-ортодонт, специализируется на исправлении прикуса у детей и взрослых.',
  '+7 961 978-54-54',
  'novikova@zubst.ru',
  'Вт-Сб: 10:00-19:00',
  'Исправление прикуса — это инвестиция в будущее. Создаю красивые улыбки, которые меняют жизнь.',
  ARRAY['Исправила прикус у 500+ пациентов', 'Специалист по элайнерам и брекетам', 'Работает с детьми и взрослыми', 'Средний срок лечения: на 30% быстрее']
),
(
  'Зрейнов Сергей Сергеевич',
  'Ассистент врача',
  3,
  'Медицинский колледж Барнаула',
  'https://files.salebot.pro/uploads/file_item/file/449726/GUbc5XlceeL9-5gSQR2xT13Nyb6SpSWP4xH81M4XInayMtg1QT_G9s_cmsJAISJXP8ftMCb6v9LcQ6-sogg_4Q__.jpeg',
  'Ассистент врача, обеспечивает поддержку во время процедур.',
  '+7 961 978-54-54',
  'zreinov@zubst.ru',
  'Пн-Пт: 9:00-20:00',
  'Моя задача — чтобы пациент чувствовал себя спокойно. Поддерживаю и помогаю врачу на каждом этапе.',
  ARRAY['Ассистировал в 3000+ процедурах', 'Специалист по работе "в четыре руки"', 'Сертификат по стерилизации', 'Любимец пациентов за доброту']
),
(
  'Манушкина Дарья Дмитриевна',
  'Администратор',
  2,
  'Экономический колледж Барнаула',
  'https://files.salebot.pro/uploads/file_item/file/449726/GUbc5XlceeL9-5gSQR2xT8jgfiD2NqJVJxkJQbvPN8K1bISovgmdAmWLrMHsiq0MzPQaJG0zaJm1qNmb5Q9X2w__.jpeg',
  'Администратор клиники, встречает пациентов и организует работу.',
  '+7 961 978-54-54',
  'manushkina@zubst.ru',
  'Пн-Пт: 8:00-20:00, Сб: 9:00-18:00',
  'Встречаю каждого пациента с улыбкой. Моя задача — чтобы вы чувствовали себя как дома с первой минуты.',
  ARRAY['Обслужила 5000+ пациентов', 'Организует расписание 10 врачей', 'Сертификат по клиентскому сервису', 'Средняя оценка сервиса: 4.9/5']
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS doctors_active_idx ON doctors (is_active);
CREATE INDEX IF NOT EXISTS doctors_specialization_idx ON doctors (specialization);
CREATE INDEX IF NOT EXISTS doctors_name_idx ON doctors (name);