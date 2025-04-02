/*
  # Create users table

  1. New Tables
    - `users`
      - `id` (uuid, primary key, default gen_random_uuid())
      - `email` (text, unique, not null)
      - `password` (text, not null)
      - `name` (text, not null)
      - `role` (varchar(50), not null, default 'user')
      - `company_id` (integer, references companies(id))
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `users` table
    - Policies for CRUD operations for authenticated users and admins
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  name text NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'employee',
  company_id INTEGER REFERENCES companies(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own record."
    ON users
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own record."
    ON users
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can manage users in their company."
    ON users
    FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM users WHERE company_id = users.company_id AND role = 'admin'))
    WITH CHECK (auth.uid() IN (SELECT user_id FROM users WHERE company_id = users.company_id AND role = 'admin'));

CREATE POLICY "Super admins can manage all users."
    ON users
    FOR ALL
    TO authenticated
    USING (auth.user().role = 'super_admin')
    WITH CHECK (auth.user().role = 'super_admin');
