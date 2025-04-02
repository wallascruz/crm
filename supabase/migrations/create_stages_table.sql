/*
      # Create stages table

      1. New Tables
        - `stages`
          - `id` (uuid, primary key, default gen_random_uuid())
          - `name` (VARCHAR(255), not null)
          - `"order"` (INTEGER, not null)
          - `company_id` (INTEGER, references companies(id))
          - `color` (VARCHAR(50))
          - `created_at` (TIMESTAMPTZ, default now())

      2. Security
        - Enable RLS on `stages` table
        - Policies for CRUD operations by company admins and super admins
    */

    CREATE TABLE IF NOT EXISTS stages (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      "order" INTEGER NOT NULL,
      company_id INTEGER REFERENCES companies(id),
      color VARCHAR(50),
      created_at timestamptz DEFAULT now()
    );

    ALTER TABLE stages ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Stages are viewable by company admins."
      ON stages
      FOR SELECT
      USING (auth.uid() IN (SELECT user_id FROM users WHERE company_id = stages.company_id AND role = 'admin'));

    CREATE POLICY "Stages can be created by super admins."
      ON stages
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.user().role = 'super_admin');

    CREATE POLICY "Stages can be updated by super admins."
      ON stages
      FOR UPDATE
      TO authenticated
      USING (auth.user().role = 'super_admin')
      WITH CHECK (auth.user().role = 'super_admin');

    CREATE POLICY "Stages can be deleted by super admins."
      ON stages
      FOR DELETE
      TO authenticated
      USING (auth.user().role = 'super_admin');
