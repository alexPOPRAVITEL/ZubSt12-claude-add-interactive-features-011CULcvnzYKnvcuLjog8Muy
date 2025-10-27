/*
  # Add missing fields to testimonials table

  1. Changes
    - Add `service` field (text) - service the review is about
    - Add `is_published` field (boolean) - moderation status
    - Add `photo_url` field (text) - reviewer avatar
    
  2. Notes
    - Uses IF NOT EXISTS to safely add columns
    - Sets default values for new fields
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'testimonials' AND column_name = 'service'
  ) THEN
    ALTER TABLE testimonials ADD COLUMN service text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'testimonials' AND column_name = 'is_published'
  ) THEN
    ALTER TABLE testimonials ADD COLUMN is_published boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'testimonials' AND column_name = 'photo_url'
  ) THEN
    ALTER TABLE testimonials ADD COLUMN photo_url text;
  END IF;
END $$;