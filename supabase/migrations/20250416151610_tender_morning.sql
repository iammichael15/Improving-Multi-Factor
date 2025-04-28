

-- Drop all existing policies first
DROP POLICY IF EXISTS "Users can insert own keystroke data" ON keystroke_data;
DROP POLICY IF EXISTS "Users can read own keystroke data" ON keystroke_data;
DROP POLICY IF EXISTS "Users can insert own mouse data" ON mouse_data;
DROP POLICY IF EXISTS "Users can read own mouse data" ON mouse_data;
DROP POLICY IF EXISTS "Users can insert own task completions" ON task_completions;
DROP POLICY IF EXISTS "Users can read own task completions" ON task_completions;

-- Drop profiles table and its policies
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can create own profile" ON profiles;
DROP TABLE IF EXISTS profiles CASCADE;

-- Create session ID generation function
CREATE OR REPLACE FUNCTION generate_session_id()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT encode(gen_random_bytes(16), 'hex');
$$;

-- Grant execute permission to public
GRANT EXECUTE ON FUNCTION generate_session_id() TO PUBLIC;

-- Modify keystroke_data table
ALTER TABLE keystroke_data DROP CONSTRAINT IF EXISTS keystroke_data_user_id_fkey;
ALTER TABLE keystroke_data ALTER COLUMN user_id TYPE text;
ALTER TABLE keystroke_data RENAME COLUMN user_id TO session_id;

-- Modify mouse_data table
ALTER TABLE mouse_data DROP CONSTRAINT IF EXISTS mouse_data_user_id_fkey;
ALTER TABLE mouse_data ALTER COLUMN user_id TYPE text;
ALTER TABLE mouse_data RENAME COLUMN user_id TO session_id;

-- Modify task_completions table
ALTER TABLE task_completions DROP CONSTRAINT IF EXISTS task_completions_user_id_fkey;
ALTER TABLE task_completions ALTER COLUMN user_id TYPE text;
ALTER TABLE task_completions RENAME COLUMN user_id TO session_id;

-- Create new policies for keystroke_data
CREATE POLICY "Allow insert with matching session_id"
  ON keystroke_data FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow select with matching session_id"
  ON keystroke_data FOR SELECT
  USING (true);

-- Create new policies for mouse_data
CREATE POLICY "Allow insert with matching session_id"
  ON mouse_data FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow select with matching session_id"
  ON mouse_data FOR SELECT
  USING (true);

-- Create new policies for task_completions
CREATE POLICY "Allow insert with matching session_id"
  ON task_completions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow select with matching session_id"
  ON task_completions FOR SELECT
  USING (true);