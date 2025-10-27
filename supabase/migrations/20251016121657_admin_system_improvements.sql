/*
  # Admin System Improvements

  1. New Tables
    - `admin_users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `full_name` (text)
      - `role` (text) - 'super_admin', 'admin', 'editor', 'viewer'
      - `permissions` (jsonb) - detailed permissions
      - `is_active` (boolean)
      - `last_login` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `admin_activity_logs`
      - `id` (uuid, primary key)
      - `admin_user_id` (uuid, foreign key)
      - `action` (text) - 'create', 'update', 'delete', 'view', 'export'
      - `resource_type` (text) - 'service', 'doctor', 'review', etc.
      - `resource_id` (uuid)
      - `details` (jsonb) - additional action details
      - `ip_address` (text)
      - `user_agent` (text)
      - `created_at` (timestamptz)
    
    - `admin_notifications`
      - `id` (uuid, primary key)
      - `admin_user_id` (uuid, foreign key)
      - `type` (text) - 'new_order', 'new_review', 'system', etc.
      - `title` (text)
      - `message` (text)
      - `data` (jsonb)
      - `is_read` (boolean)
      - `created_at` (timestamptz)
    
    - `dashboard_widgets`
      - `id` (uuid, primary key)
      - `admin_user_id` (uuid, foreign key)
      - `widget_type` (text)
      - `position` (int)
      - `settings` (jsonb)
      - `is_visible` (boolean)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all new tables
    - Add policies for admin users based on roles
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'viewer' CHECK (role IN ('super_admin', 'admin', 'editor', 'viewer')),
  permissions jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create admin_activity_logs table
CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  action text NOT NULL CHECK (action IN ('create', 'update', 'delete', 'view', 'export', 'login', 'logout')),
  resource_type text NOT NULL,
  resource_id uuid,
  details jsonb DEFAULT '{}'::jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Create admin_notifications table
CREATE TABLE IF NOT EXISTS admin_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid REFERENCES admin_users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('new_order', 'new_review', 'new_appointment', 'system', 'warning', 'info')),
  title text NOT NULL,
  message text NOT NULL,
  data jsonb DEFAULT '{}'::jsonb,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create dashboard_widgets table
CREATE TABLE IF NOT EXISTS dashboard_widgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid REFERENCES admin_users(id) ON DELETE CASCADE,
  widget_type text NOT NULL,
  position int NOT NULL DEFAULT 0,
  settings jsonb DEFAULT '{}'::jsonb,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_widgets ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_users
CREATE POLICY "Admin users can view all admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Super admins can manage admin users"
  ON admin_users FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'super_admin'
      AND admin_users.is_active = true
    )
  );

-- RLS Policies for admin_activity_logs
CREATE POLICY "Admins can view activity logs"
  ON admin_activity_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "System can insert activity logs"
  ON admin_activity_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for admin_notifications
CREATE POLICY "Admins can view their notifications"
  ON admin_notifications FOR SELECT
  TO authenticated
  USING (admin_user_id = auth.uid());

CREATE POLICY "Admins can update their notifications"
  ON admin_notifications FOR UPDATE
  TO authenticated
  USING (admin_user_id = auth.uid())
  WITH CHECK (admin_user_id = auth.uid());

CREATE POLICY "System can create notifications"
  ON admin_notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for dashboard_widgets
CREATE POLICY "Admins can manage their widgets"
  ON dashboard_widgets FOR ALL
  TO authenticated
  USING (admin_user_id = auth.uid())
  WITH CHECK (admin_user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_admin_user ON admin_activity_logs(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_created_at ON admin_activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_admin_user ON admin_notifications(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_is_read ON admin_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_dashboard_widgets_admin_user ON dashboard_widgets(admin_user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for admin_users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'update_admin_users_updated_at'
  ) THEN
    CREATE TRIGGER update_admin_users_updated_at
      BEFORE UPDATE ON admin_users
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Insert default super admin (using the hardcoded password from the current system)
-- Note: In production, this should be handled through proper Supabase Auth
INSERT INTO admin_users (email, full_name, role, is_active)
VALUES ('admin@zubnayastanciya.ru', 'Super Admin', 'super_admin', true)
ON CONFLICT (email) DO NOTHING;