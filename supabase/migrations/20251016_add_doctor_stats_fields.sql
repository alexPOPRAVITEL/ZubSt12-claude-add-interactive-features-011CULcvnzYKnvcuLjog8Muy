/*
  # Add Doctor Statistics Fields

  1. Changes
    - Add `patients_per_month` (integer) - количество пациентов в месяц
    - Add `total_procedures` (integer) - всего проведено процедур
    - Add `rating` (numeric) - рейтинг врача (из 5)
    - Add `return_rate` (integer) - процент возвращающихся пациентов
    - Add `appointments_completed` (integer) - количество завершенных приемов

  2. Notes
    - Эти поля видны только администраторам в админ-панели
    - Для пациентов показываются доверительные бэйджи вместо цифр
    - Все поля nullable с дефолтными значениями
*/

-- Add statistics fields to doctors table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'doctors' AND column_name = 'patients_per_month'
  ) THEN
    ALTER TABLE doctors ADD COLUMN patients_per_month integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'doctors' AND column_name = 'total_procedures'
  ) THEN
    ALTER TABLE doctors ADD COLUMN total_procedures integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'doctors' AND column_name = 'rating'
  ) THEN
    ALTER TABLE doctors ADD COLUMN rating numeric(3,1) DEFAULT 4.8;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'doctors' AND column_name = 'return_rate'
  ) THEN
    ALTER TABLE doctors ADD COLUMN return_rate integer DEFAULT 85;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'doctors' AND column_name = 'appointments_completed'
  ) THEN
    ALTER TABLE doctors ADD COLUMN appointments_completed integer DEFAULT 0;
  END IF;
END $$;

-- Add comments to columns
COMMENT ON COLUMN doctors.patients_per_month IS 'Среднее количество пациентов в месяц';
COMMENT ON COLUMN doctors.total_procedures IS 'Общее количество проведенных процедур';
COMMENT ON COLUMN doctors.rating IS 'Рейтинг врача из 5 звезд';
COMMENT ON COLUMN doctors.return_rate IS 'Процент возвращающихся пациентов';
COMMENT ON COLUMN doctors.appointments_completed IS 'Количество завершенных приемов';
