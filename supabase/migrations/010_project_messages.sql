-- Project chat messages between clients and agency teams

CREATE TABLE IF NOT EXISTS project_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES project_requests(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id),
  sender_role TEXT NOT NULL CHECK (sender_role IN ('client', 'agency')),
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS project_messages_request_created_idx
  ON project_messages (request_id, created_at);

ALTER TABLE project_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY project_messages_select ON project_messages
  FOR SELECT
  USING (
    is_project_client(request_id)
    OR EXISTS (
      SELECT 1
      FROM agreements ag
      JOIN agencies a ON a.id = ag.agency_id
      WHERE ag.request_id = project_messages.request_id
        AND (a.owner_id = auth.uid() OR is_agency_member(a.id))
    )
    OR is_admin()
  );

CREATE POLICY project_messages_insert ON project_messages
  FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
    AND (
      (sender_role = 'client' AND is_project_client(request_id))
      OR (
        sender_role = 'agency'
        AND EXISTS (
          SELECT 1
          FROM agreements ag
          JOIN agencies a ON a.id = ag.agency_id
          WHERE ag.request_id = project_messages.request_id
            AND (a.owner_id = auth.uid() OR is_agency_member(a.id))
        )
      )
    )
  );
