
-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  age_group text NOT NULL CHECK (age_group IN ('18-25', '26-40', '41+')),
  technical_proficiency text NOT NULL CHECK (technical_proficiency IN ('beginner', 'intermediate', 'advanced')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create keystroke_data table
CREATE TABLE IF NOT EXISTS keystroke_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  timestamp timestamptz DEFAULT now(),
  key text NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('keydown', 'keyup')),
  dwell_time float,
  flight_time float,
  task_type text NOT NULL CHECK (task_type IN ('login', 'form', 'interactive', 'browsing'))
);

-- Create mouse_data table
CREATE TABLE IF NOT EXISTS mouse_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  timestamp timestamptz DEFAULT now(),
  x float NOT NULL,
  y float NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('move', 'click')),
  speed float,
  acceleration float,
  task_type text NOT NULL CHECK (task_type IN ('login', 'form', 'interactive', 'browsing'))
);

-- Create task_completions table
CREATE TABLE IF NOT EXISTS task_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  task_type text NOT NULL CHECK (task_type IN ('login', 'form', 'interactive', 'browsing')),
  completed_at timestamptz DEFAULT now(),
  duration interval
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE keystroke_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE mouse_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_completions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own keystroke data"
  ON keystroke_data FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own keystroke data"
  ON keystroke_data FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mouse data"
  ON mouse_data FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own mouse data"
  ON mouse_data FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read own task completions"
  ON task_completions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own task completions"
  ON task_completions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);