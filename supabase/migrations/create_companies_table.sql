/*
  # Create companies table

  1. New Tables
    - `companies`
      - `id` (SERIAL, primary key)
      - `name` (VARCHAR(255), not null)
      - `created_at` (TIMESTAMP WITH TIME ZONE, default CURRENT_TIMESTAMP)

  2. Security
    - Enable RLS on `companies` table
    - Add policy for authenticated users to perform CRUD operations
*/

CREATE TABLE IF NOT EXISTS companies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Companies are viewable by company admins."
  ON companies
  FOR SELECT
  USING (auth.uid()() IN (SELECT user_id FROM users WHERE company_id = companies.id AND role = 'admin'));

CREATE POLICY "Companies can be created by super admins."
  ON companies
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.user().role = 'super_admin');

CREATE POLICY "Companies can be updated by super admins."
  ON companies
  FOR UPDATE
  TO authenticated
  USING (auth.user().role = 'super_admin')
  WITH CHECK (auth.user().role = 'super_admin');

CREATE POLICY "Companies can be deleted by super admins."
  ON companies
  FOR DELETE
  TO authenticated
  USING (auth.user().role = 'super_admin');
