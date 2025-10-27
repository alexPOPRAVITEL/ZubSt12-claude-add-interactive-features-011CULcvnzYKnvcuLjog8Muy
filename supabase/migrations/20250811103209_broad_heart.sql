/*
  # Update doctors table for enhanced functionality

  1. Changes
    - Add `buttons` column to store custom action buttons
    - Add `service_categories` column to link doctors with service categories
  2. Security
    - Maintain existing RLS policies
*/

-- Add buttons column to doctors table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'doctors' AND column_name = 'buttons'
  ) THEN
    ALTER TABLE doctors ADD COLUMN buttons jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Add service_categories column to doctors table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'doctors' AND column_name = 'service_categories'
  ) THEN
    ALTER TABLE doctors ADD COLUMN service_categories text[] DEFAULT '{}'::text[];
  END IF;
END $$;

-- Create index for buttons column
CREATE INDEX IF NOT EXISTS doctors_buttons_idx ON doctors USING gin(buttons);

-- Create index for service_categories column
CREATE INDEX IF NOT EXISTS doctors_service_categories_idx ON doctors USING gin(service_categories);