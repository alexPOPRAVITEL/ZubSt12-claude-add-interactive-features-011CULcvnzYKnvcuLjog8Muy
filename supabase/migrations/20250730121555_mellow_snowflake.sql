/*
  # Создание таблицы для управления медиа-контентом сайта

  1. Новая таблица
    - `site_media_content`
      - `id` (uuid, primary key)
      - `section` (text) - раздел сайта (general, hero, doctors, etc.)
      - `file_name` (text) - оригинальное имя файла
      - `yandex_disk_path` (text) - путь к файлу на Яндекс.Диске
      - `public_url` (text) - публичная ссылка на файл
      - `type` (text) - тип файла (image/video)
      - `alt_text` (text) - альтернативный текст для изображений
      - `caption` (text) - подпись к файлу
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Безопасность
    - Включить RLS
    - Политики для аутентифицированных пользователей
*/

CREATE TABLE IF NOT EXISTS site_media_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL,
  file_name text NOT NULL,
  yandex_disk_path text NOT NULL,
  public_url text NOT NULL,
  type text NOT NULL CHECK (type IN ('image', 'video')),
  alt_text text DEFAULT '',
  caption text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Включаем RLS
ALTER TABLE site_media_content ENABLE ROW LEVEL SECURITY;

-- Политики доступа
CREATE POLICY "Authenticated users can manage media content"
  ON site_media_content
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public users can read media content"
  ON site_media_content
  FOR SELECT
  TO public
  USING (true);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS site_media_content_section_idx ON site_media_content(section);
CREATE INDEX IF NOT EXISTS site_media_content_type_idx ON site_media_content(type);

-- Триггер для обновления updated_at
CREATE OR REPLACE FUNCTION update_site_media_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_site_media_content_updated_at
  BEFORE UPDATE ON site_media_content
  FOR EACH ROW
  EXECUTE FUNCTION update_site_media_content_updated_at();