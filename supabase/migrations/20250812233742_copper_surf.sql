/*
  # Add order_index to doctors table

  1. Schema Changes
    - Add `order_index` column to `doctors` table
    - Set default value to 0
    - Update existing doctors with incremental order values

  2. Data Migration
    - Assign order_index values to existing doctors based on creation date
    - Ensure no duplicate order values

  3. Index
    - Add index on order_index for better query performance
*/

-- Add order_index column to doctors table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'doctors' AND column_name = 'order_index'
  ) THEN
    ALTER TABLE doctors ADD COLUMN order_index integer DEFAULT 0;
  END IF;
END $$;

-- Update existing doctors with incremental order values based on creation date
UPDATE doctors 
SET order_index = subquery.row_number - 1
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as row_number
  FROM doctors
) AS subquery
WHERE doctors.id = subquery.id;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS doctors_order_idx ON doctors(order_index);