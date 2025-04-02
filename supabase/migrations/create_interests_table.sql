/*
  # Create interests table

  1. New Tables
    - `interests`
      - `id` (uuid, primary key, default gen_random_uuid())
      - `name` (VARCHAR(255), not null)
      - `company_id` (integer, references companies(id))
      - `created_at` (timestamptz, default now())
*/

CREATE TABLE IF NOT EXISTS interests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  company_id INTEGER REFERENCES companies(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE interests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Interests are viewable by company admins."
  ON interests
  FOR SELECT
  USING (auth.uid()() IN (SELECT user_id FROM users WHERE company_id = interests.company_id AND role = 'admin'));

CREATE POLICY "Interests can be created by super admins."
  ON interests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.user().role = 'super_admin');

CREATE POLICY "Interests can be updated by super admins."
  ON interests
  FOR UPDATE
  TO authenticated
  USING (auth.user().role = 'super_admin')
  WITH CHECK (auth.user().role = 'super_admin');

CREATE POLICY "Interests can be deleted by super admins."
  ON interests
  FOR DELETE
  TO authenticated
  USING (auth.user().role = 'super_admin');