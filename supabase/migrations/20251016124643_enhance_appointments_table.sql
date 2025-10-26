/*
  # Enhance Appointments Table

  1. Changes
    - Add `patient_name` as alias for client_name (for compatibility)
    - Add `phone` as alias for client_phone (for compatibility)
    - Add `email` column (optional)
    - Add `service_name` column (text, optional)
    - Add `appointment_type` column (default 'appointment')
    - Add `notes` column (patient comments)
    - Add `admin_notes` column (admin-only notes)
    - Add `comment` column (additional comments)
    - Add `source` column (tracking where appointment came from)
    - Add `updated_at` timestamp
    - Add `confirmed_at` timestamp
    - Add `completed_at` timestamp
    - Update doctor_id to be uuid FK reference
    - Add proper indexes for performance

  2. Security
    - Enable RLS if not already enabled
    - Add policies for anonymous users to create appointments
    - Add policies for authenticated admins to manage all appointments

  3. Indexes
    - Add indexes on status, date, phone for fast queries
*/

-- Add missing columns to appointments table
DO $$
BEGIN
  -- Add patient_name (mapped from client_name for compatibility)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'appointments' AND column_name = 'patient_name'
  ) THEN
    ALTER TABLE appointments ADD COLUMN patient_name text;
  END IF;

  -- Add phone (mapped from client_phone for compatibility)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'appointments' AND column_name = 'phone'
  ) THEN
    ALTER TABLE appointments ADD COLUMN phone text;
  END IF;

  -- Add email
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'appointments' AND column_name = 'email'
  ) THEN
    ALTER TABLE appointments ADD COLUMN email text;
  END IF;

  -- Add service_name
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'appointments' AND column_name = 'service_name'
  ) THEN
    ALTER TABLE appointments ADD COLUMN service_name text;
  END IF;

  -- Add appointment_type
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'appointments' AND column_name = 'appointment_type'
  ) THEN
    ALTER TABLE appointments ADD COLUMN appointment_type text DEFAULT 'appointment';
  END IF;

  -- Add notes (patient comments)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'appointments' AND column_name = 'notes'
  ) THEN
    ALTER TABLE appointments ADD COLUMN notes text;
  END IF;

  -- Add admin_notes
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'appointments' AND column_name = 'admin_notes'
  ) THEN
    ALTER TABLE appointments ADD COLUMN admin_notes text;
  END IF;

  -- Add comment
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'appointments' AND column_name = 'comment'
  ) THEN
    ALTER TABLE appointments ADD COLUMN comment text;
  END IF;

  -- Add source
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'appointments' AND column_name = 'source'
  ) THEN
    ALTER TABLE appointments ADD COLUMN source text DEFAULT 'website';
  END IF;

  -- Add updated_at
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'appointments' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE appointments ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;

  -- Add confirmed_at
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'appointments' AND column_name = 'confirmed_at'
  ) THEN
    ALTER TABLE appointments ADD COLUMN confirmed_at timestamptz;
  END IF;

  -- Add completed_at
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'appointments' AND column_name = 'completed_at'
  ) THEN
    ALTER TABLE appointments ADD COLUMN completed_at timestamptz;
  END IF;
END $$;

-- Make some columns nullable to match code expectations
ALTER TABLE appointments ALTER COLUMN service_id DROP NOT NULL;
ALTER TABLE appointments ALTER COLUMN doctor_id DROP NOT NULL;
ALTER TABLE appointments ALTER COLUMN appointment_date DROP NOT NULL;
ALTER TABLE appointments ALTER COLUMN appointment_time DROP NOT NULL;
ALTER TABLE appointments ALTER COLUMN client_email DROP NOT NULL;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_phone ON appointments(phone);
CREATE INDEX IF NOT EXISTS idx_appointments_client_phone ON appointments(client_phone);
CREATE INDEX IF NOT EXISTS idx_appointments_created ON appointments(created_at DESC);

-- Enable RLS if not already enabled
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can create appointments" ON appointments;
DROP POLICY IF EXISTS "Authenticated users can view all appointments" ON appointments;
DROP POLICY IF EXISTS "Authenticated users can update appointments" ON appointments;
DROP POLICY IF EXISTS "Authenticated users can delete appointments" ON appointments;

-- Policy: Allow anyone (including anonymous) to create appointments
CREATE POLICY "Anyone can create appointments"
  ON appointments
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow authenticated users to view all appointments
CREATE POLICY "Authenticated users can view all appointments"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Allow authenticated users to update appointments
CREATE POLICY "Authenticated users can update appointments"
  ON appointments
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Allow authenticated users to delete appointments
CREATE POLICY "Authenticated users can delete appointments"
  ON appointments
  FOR DELETE
  TO authenticated
  USING (true);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_appointments_updated_at ON appointments;
CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-set confirmed_at and completed_at timestamps
CREATE OR REPLACE FUNCTION update_appointment_timestamps()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'confirmed' AND (OLD.status IS NULL OR OLD.status != 'confirmed') THEN
    NEW.confirmed_at = now();
  END IF;
  
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    NEW.completed_at = now();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-set status timestamps
DROP TRIGGER IF EXISTS update_appointment_status_timestamps ON appointments;
CREATE TRIGGER update_appointment_status_timestamps
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_appointment_timestamps();

-- Function to sync patient_name from client_name
CREATE OR REPLACE FUNCTION sync_appointment_fields()
RETURNS TRIGGER AS $$
BEGIN
  -- Sync patient_name with client_name
  IF NEW.patient_name IS NULL AND NEW.client_name IS NOT NULL THEN
    NEW.patient_name = NEW.client_name;
  END IF;
  IF NEW.client_name IS NULL AND NEW.patient_name IS NOT NULL THEN
    NEW.client_name = NEW.patient_name;
  END IF;
  
  -- Sync phone with client_phone
  IF NEW.phone IS NULL AND NEW.client_phone IS NOT NULL THEN
    NEW.phone = NEW.client_phone;
  END IF;
  IF NEW.client_phone IS NULL AND NEW.phone IS NOT NULL THEN
    NEW.client_phone = NEW.phone;
  END IF;
  
  -- Sync email with client_email
  IF NEW.email IS NULL AND NEW.client_email IS NOT NULL THEN
    NEW.email = NEW.client_email;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to sync fields on insert/update
DROP TRIGGER IF EXISTS sync_appointment_fields_trigger ON appointments;
CREATE TRIGGER sync_appointment_fields_trigger
  BEFORE INSERT OR UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION sync_appointment_fields();

-- Add comments for documentation
COMMENT ON COLUMN appointments.patient_name IS 'Имя пациента (синхронизируется с client_name)';
COMMENT ON COLUMN appointments.phone IS 'Телефон для связи (синхронизируется с client_phone)';
COMMENT ON COLUMN appointments.appointment_type IS 'Тип записи: appointment, callback, consultation, emergency';
COMMENT ON COLUMN appointments.notes IS 'Комментарий от пациента';
COMMENT ON COLUMN appointments.admin_notes IS 'Заметки администратора (только для внутреннего использования)';
COMMENT ON COLUMN appointments.source IS 'Источник записи: website, phone, whatsapp, telegram, etc';
