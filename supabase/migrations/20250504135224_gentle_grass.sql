/*
  # Create analytics tables
  
  1. New Tables
    - `visitors`
      - `id` (uuid, primary key)
      - `user_id` (uuid, nullable) - для авторизованных пользователей
      - `source` (text) - web или telegram
      - `platform` (text) - операционная система
      - `browser` (text) - браузер
      - `ip_address` (text)
      - `visited_at` (timestamptz)
      - `user_agent` (text)
      - `referrer` (text)
      - `telegram_data` (jsonb) - для пользователей из Telegram
      
  2. Security
    - Enable RLS
    - Add policies for insert and select
*/

CREATE TABLE IF NOT EXISTS visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  source text NOT NULL,
  platform text,
  browser text,
  ip_address text,
  visited_at timestamptz DEFAULT now(),
  user_agent text,
  referrer text,
  telegram_data jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable insert for all users" ON visitors
  FOR INSERT TO public
  WITH CHECK (true);

CREATE POLICY "Enable select for authenticated users" ON visitors
  FOR SELECT TO authenticated
  USING (auth.role() = 'authenticated');