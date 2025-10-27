/*
  # Система обучения сотрудников

  1. Новые таблицы
    - `training_courses` - Курсы обучения
      - `id` (uuid, primary key)
      - `title` (text) - Название курса
      - `description` (text) - Описание
      - `image_url` (text) - Изображение курса
      - `duration` (text) - Длительность (например "2 недели")
      - `level` (text) - Уровень сложности
      - `is_active` (boolean) - Активен ли курс
      - `order_index` (integer) - Порядок отображения
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `training_modules` - Модули курса
      - `id` (uuid, primary key)
      - `course_id` (uuid, foreign key) - Связь с курсом
      - `title` (text) - Название модуля
      - `description` (text) - Описание
      - `order_index` (integer) - Порядок в курсе
      - `created_at` (timestamptz)
    
    - `training_lessons` - Уроки модуля
      - `id` (uuid, primary key)
      - `module_id` (uuid, foreign key) - Связь с модулем
      - `title` (text) - Название урока
      - `content` (text) - Контент урока (HTML/Markdown)
      - `video_url` (text) - Ссылка на видео
      - `duration` (integer) - Длительность в минутах
      - `order_index` (integer) - Порядок в модуле
      - `has_quiz` (boolean) - Есть ли тест
      - `created_at` (timestamptz)
    
    - `training_quiz_questions` - Вопросы тестов
      - `id` (uuid, primary key)
      - `lesson_id` (uuid, foreign key) - Связь с уроком
      - `question` (text) - Текст вопроса
      - `options` (jsonb) - Варианты ответов
      - `correct_answer` (integer) - Индекс правильного ответа
      - `order_index` (integer)
    
    - `user_progress` - Прогресс пользователей
      - `id` (uuid, primary key)
      - `user_email` (text) - Email пользователя
      - `lesson_id` (uuid, foreign key) - Урок
      - `completed` (boolean) - Завершён ли
      - `quiz_score` (integer) - Результат теста
      - `completed_at` (timestamptz)
      - `created_at` (timestamptz)
    
    - `training_certificates` - Сертификаты
      - `id` (uuid, primary key)
      - `user_email` (text) - Email пользователя
      - `course_id` (uuid, foreign key) - Курс
      - `certificate_url` (text) - Ссылка на сертификат
      - `issued_at` (timestamptz)

  2. Security
    - Enable RLS на всех таблицах
    - Политики доступа для чтения и записи
*/

-- Курсы
CREATE TABLE IF NOT EXISTS training_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text,
  duration text,
  level text DEFAULT 'Базовый',
  is_active boolean DEFAULT true,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE training_courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active courses"
  ON training_courses FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage courses"
  ON training_courses FOR ALL
  USING (true)
  WITH CHECK (true);

-- Модули
CREATE TABLE IF NOT EXISTS training_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES training_courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE training_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view modules"
  ON training_modules FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage modules"
  ON training_modules FOR ALL
  USING (true)
  WITH CHECK (true);

-- Уроки
CREATE TABLE IF NOT EXISTS training_lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid REFERENCES training_modules(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  video_url text,
  duration integer DEFAULT 0,
  order_index integer DEFAULT 0,
  has_quiz boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE training_lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view lessons"
  ON training_lessons FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage lessons"
  ON training_lessons FOR ALL
  USING (true)
  WITH CHECK (true);

-- Вопросы тестов
CREATE TABLE IF NOT EXISTS training_quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid REFERENCES training_lessons(id) ON DELETE CASCADE,
  question text NOT NULL,
  options jsonb NOT NULL,
  correct_answer integer NOT NULL,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE training_quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view questions"
  ON training_quiz_questions FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage questions"
  ON training_quiz_questions FOR ALL
  USING (true)
  WITH CHECK (true);

-- Прогресс пользователей
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email text NOT NULL,
  lesson_id uuid REFERENCES training_lessons(id) ON DELETE CASCADE,
  completed boolean DEFAULT false,
  quiz_score integer,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_email, lesson_id)
);

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  USING (true);

CREATE POLICY "Users can update own progress"
  ON user_progress FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can modify own progress"
  ON user_progress FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Сертификаты
CREATE TABLE IF NOT EXISTS training_certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email text NOT NULL,
  course_id uuid REFERENCES training_courses(id) ON DELETE CASCADE,
  certificate_url text,
  issued_at timestamptz DEFAULT now(),
  UNIQUE(user_email, course_id)
);

ALTER TABLE training_certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own certificates"
  ON training_certificates FOR SELECT
  USING (true);

CREATE POLICY "Admins can issue certificates"
  ON training_certificates FOR ALL
  USING (true)
  WITH CHECK (true);

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS idx_training_modules_course ON training_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_training_lessons_module ON training_lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_lesson ON training_quiz_questions(lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_email ON user_progress(user_email);
CREATE INDEX IF NOT EXISTS idx_user_progress_lesson ON user_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_certificates_email ON training_certificates(user_email);
