-- Confidence scoring calibration logs
CREATE TABLE confidence_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES sessions(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  user_message text DEFAULT '',
  pass_count integer NOT NULL DEFAULT 0,
  agreement_score integer NOT NULL DEFAULT 0,
  consistency_confidence integer NOT NULL DEFAULT 0,
  contradiction_detected boolean NOT NULL DEFAULT false,
  pass_diagnoses jsonb DEFAULT '[]',
  triggered_by text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_confidence_logs_session_id ON confidence_logs(session_id);
CREATE INDEX idx_confidence_logs_created_at ON confidence_logs(created_at);

ALTER TABLE confidence_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "confidence_logs_select_own"
  ON confidence_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = confidence_logs.session_id
      AND sessions.agent_id = auth.uid()
    )
  );

CREATE POLICY "confidence_logs_insert"
  ON confidence_logs FOR INSERT
  WITH CHECK (auth.role() = 'service_role');
