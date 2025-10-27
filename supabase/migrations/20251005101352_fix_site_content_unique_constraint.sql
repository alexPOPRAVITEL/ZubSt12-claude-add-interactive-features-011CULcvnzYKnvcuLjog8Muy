/*
  # Fix site_content table for upsert operations

  1. Changes
    - Add unique constraint on section column for upsert operations
    
  2. Notes
    - This allows proper upsert with onConflict: 'section'
*/

DO $$
BEGIN
  -- Check if unique constraint already exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'site_content_section_key'
  ) THEN
    ALTER TABLE site_content ADD CONSTRAINT site_content_section_key UNIQUE (section);
  END IF;
END $$;