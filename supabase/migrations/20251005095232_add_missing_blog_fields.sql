/*
  # Add missing fields to blog_posts table

  1. Changes
    - Add `author` field (text)
    - Add `category` field (text)
    - Add `excerpt` field (text)
    - Add `tags` field (text array)
    
  2. Notes
    - Uses IF NOT EXISTS to safely add columns
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'author'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN author text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'category'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN category text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'excerpt'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN excerpt text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'tags'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN tags text[];
  END IF;
END $$;