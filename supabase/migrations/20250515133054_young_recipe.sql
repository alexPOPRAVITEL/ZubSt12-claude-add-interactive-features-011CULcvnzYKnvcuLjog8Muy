/*
  # Add user details to visitors table
  
  1. Changes
    - Add new columns to visitors table:
      - gender (text)
      - birth_date (date)
      - age (integer)
*/

ALTER TABLE visitors 
ADD COLUMN IF NOT EXISTS gender text,
ADD COLUMN IF NOT EXISTS birth_date date,
ADD COLUMN IF NOT EXISTS age integer;