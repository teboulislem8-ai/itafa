-- Musa'id Database Schema
-- Supabase PostgreSQL

-- 1. Profiles (extension agents)
CREATE TABLE profiles (
  id uuid PRIMARY KEY,
  full_name text NOT NULL,
  wilaya text NOT NULL DEFAULT '',
  specializations text[] DEFAULT '{}',
  language_pref text NOT NULL DEFAULT 'fr' CHECK (language_pref IN ('ar', 'fr', 'auto')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- 2. Consultation sessions
CREATE TABLE sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  crop text DEFAULT '',
  wilaya text DEFAULT '',
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed', 'report_generated')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_sessions_agent_id ON sessions(agent_id);
CREATE INDEX idx_sessions_updated_at ON sessions(updated_at DESC);

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sessions_select_own"
  ON sessions FOR SELECT
  USING (auth.uid() = agent_id);

CREATE POLICY "sessions_insert_own"
  ON sessions FOR INSERT
  WITH CHECK (auth.uid() = agent_id);

CREATE POLICY "sessions_update_own"
  ON sessions FOR UPDATE
  USING (auth.uid() = agent_id);

CREATE POLICY "sessions_delete_own"
  ON sessions FOR DELETE
  USING (auth.uid() = agent_id);

-- 3. Messages
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL DEFAULT '',
  skill_triggered text DEFAULT '',
  language text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_session_id ON messages(session_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "messages_select_own"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = messages.session_id
      AND sessions.agent_id = auth.uid()
    )
  );

CREATE POLICY "messages_insert_own"
  ON messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = messages.session_id
      AND sessions.agent_id = auth.uid()
    )
  );

-- 4. Field observations
CREATE TABLE observations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  crop text DEFAULT '',
  growth_stage text DEFAULT '',
  symptoms jsonb DEFAULT '{}',
  soil_notes text DEFAULT '',
  irrigation_notes text DEFAULT '',
  photos text[] DEFAULT '{}',
  ai_analysis text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_observations_session_id ON observations(session_id);

ALTER TABLE observations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "observations_select_own"
  ON observations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = observations.session_id
      AND sessions.agent_id = auth.uid()
    )
  );

CREATE POLICY "observations_insert_own"
  ON observations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = observations.session_id
      AND sessions.agent_id = auth.uid()
    )
  );

CREATE POLICY "observations_update_own"
  ON observations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = observations.session_id
      AND sessions.agent_id = auth.uid()
    )
  );

-- 5. Lab reports
CREATE TABLE lab_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  report_type text NOT NULL CHECK (report_type IN ('soil', 'water')),
  raw_values jsonb DEFAULT '{}',
  ai_interpretation text DEFAULT '',
  flags jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_lab_reports_session_id ON lab_reports(session_id);

ALTER TABLE lab_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lab_reports_select_own"
  ON lab_reports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = lab_reports.session_id
      AND sessions.agent_id = auth.uid()
    )
  );

CREATE POLICY "lab_reports_insert_own"
  ON lab_reports FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = lab_reports.session_id
      AND sessions.agent_id = auth.uid()
    )
  );

-- 6. Field reports
CREATE TABLE field_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  language text NOT NULL DEFAULT 'fr' CHECK (language IN ('ar', 'fr')),
  content text NOT NULL DEFAULT '',
  format text NOT NULL DEFAULT 'markdown' CHECK (format IN ('markdown', 'pdf_ready')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_field_reports_session_id ON field_reports(session_id);

ALTER TABLE field_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "field_reports_select_own"
  ON field_reports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = field_reports.session_id
      AND sessions.agent_id = auth.uid()
    )
  );

CREATE POLICY "field_reports_insert_own"
  ON field_reports FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = field_reports.session_id
      AND sessions.agent_id = auth.uid()
    )
  );
