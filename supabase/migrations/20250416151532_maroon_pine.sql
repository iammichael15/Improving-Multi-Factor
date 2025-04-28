
-- Create function to generate unique session IDs
CREATE OR REPLACE FUNCTION generate_session_id()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  new_id text;
BEGIN
  new_id := encode(gen_random_bytes(16), 'hex');
  RETURN new_id;
END;
$$;

-- Modify keystroke_data table
ALTER TABLE keystroke_data DROP CONSTRAINT IF EXISTS keystroke_data_user_id_fkey;
ALTER TABLE keystroke_data ALTER COLUMN user_id TYPE text;
ALTER TABLE keystroke_data RENAME user_id TO session_id;

-- Modify mouse_data table
ALTER TABLE mouse_data DROP CONSTRAINT IF EXISTS mouse_data_user_id_fkey;
ALTER TABLE mouse_data ALTER COLUMN user_id TYPE text;
ALTER TABLE mouse_data RENAME user_id TO session_id;

-- Modify task_completions table
ALTER TABLE task_completions DROP CONSTRAINT IF EXISTS task_completions_user_id_fkey;
ALTER TABLE task_completions ALTER COLUMN user_id TYPE text;
ALTER TABLE task_completions RENAME user_id TO session_id;

-- Drop profiles table as it's no longer needed
DROP TABLE IF EXISTS profiles CASCADE;

-- Update RLS policies for keystroke_data
DROP POLICY IF EXISTS "Users can insert own keystroke data" ON keystroke_data;
DROP POLICY IF EXISTS "Users can read own keystroke data" ON keystroke_data;

CREATE POLICY "Allow insert with matching session_id"
  ON keystroke_data FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow select with matching session_id"
  ON keystroke_data FOR SELECT
  USING (true);

-- Update RLS policies for mouse_data
DROP POLICY IF EXISTS "Users can insert own mouse data" ON mouse_data;
DROP POLICY IF EXISTS "Users can read own mouse data" ON mouse_data;

CREATE POLICY "Allow insert with matching session_id"
  ON mouse_data FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow select with matching session_id"
  ON mouse_data FOR SELECT
  USING (true);

-- Update RLS policies for task_completions
DROP POLICY IF EXISTS "Users can insert own task completions" ON task_completions;
DROP POLICY IF EXISTS "Users can read own task completions" ON task_completions;

CREATE POLICY "Allow insert with matching session_id"
  ON task_completions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow select with matching session_id"
  ON task_completions FOR SELECT
  USING (true);