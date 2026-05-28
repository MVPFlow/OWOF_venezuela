-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE person_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE people_tags_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_field_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_field_values ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Helper function: check if user is SUPER_ADMIN
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT role = 'SUPER_ADMIN'
    FROM public.users
    WHERE id = auth.uid()
    AND status = 'active'
  );
END;
$$;

-- ============================================================
-- Helper function: check if user is SUPER_ADMIN or COORDINATOR
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin_or_coordinator()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT role IN ('SUPER_ADMIN', 'COORDINATOR')
    FROM public.users
    WHERE id = auth.uid()
    AND status = 'active'
  );
END;
$$;

-- ============================================================
-- Helper function: get current user's organization_id
-- ============================================================
CREATE OR REPLACE FUNCTION public.current_user_org_id()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT organization_id
    FROM public.users
    WHERE id = auth.uid()
    AND status = 'active'
  );
END;
$$;

-- ============================================================
-- organizations
-- ============================================================
-- Allow all authenticated users to read the organization
CREATE POLICY "org_read_authenticated" ON organizations
  FOR SELECT
  TO authenticated
  USING (true);

-- Only SUPER_ADMIN can insert/update/delete
CREATE POLICY "org_insert_super_admin" ON organizations
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_super_admin());

CREATE POLICY "org_update_super_admin" ON organizations
  FOR UPDATE
  TO authenticated
  USING (public.is_super_admin());

CREATE POLICY "org_delete_super_admin" ON organizations
  FOR DELETE
  TO authenticated
  USING (public.is_super_admin());

-- Allow public to read active organizations (for landing pages)
CREATE POLICY "org_select_public" ON organizations
  FOR SELECT
  TO anon
  USING (status = 'active');

-- ============================================================
-- users
-- ============================================================
-- Users can read their own record; SUPER_ADMIN can read all
CREATE POLICY "users_read_own" ON users
  FOR SELECT
  TO authenticated
  USING (id = auth.uid() OR public.is_super_admin());

-- Only SUPER_ADMIN can insert/update/delete users
CREATE POLICY "users_insert_super_admin" ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_super_admin());

CREATE POLICY "users_update_super_admin" ON users
  FOR UPDATE
  TO authenticated
  USING (public.is_super_admin());

CREATE POLICY "users_delete_super_admin" ON users
  FOR DELETE
  TO authenticated
  USING (public.is_super_admin());

-- ============================================================
-- people
-- ============================================================
-- All authenticated org members can read people
CREATE POLICY "people_read_org" ON people
  FOR SELECT
  TO authenticated
  USING (organization_id = public.current_user_org_id());

-- SUPER_ADMIN and COORDINATOR can insert/update; SUPER_ADMIN can delete
CREATE POLICY "people_insert_admin" ON people
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_or_coordinator());

CREATE POLICY "people_update_admin" ON people
  FOR UPDATE
  TO authenticated
  USING (public.is_admin_or_coordinator());

CREATE POLICY "people_delete_super_admin" ON people
  FOR DELETE
  TO authenticated
  USING (public.is_super_admin());

-- ============================================================
-- project_types
-- ============================================================
-- All authenticated users can read
CREATE POLICY "project_types_read_org" ON project_types
  FOR SELECT
  TO authenticated
  USING (organization_id = public.current_user_org_id());

-- Only SUPER_ADMIN can manage
CREATE POLICY "project_types_insert_super_admin" ON project_types
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_super_admin());

CREATE POLICY "project_types_update_super_admin" ON project_types
  FOR UPDATE
  TO authenticated
  USING (public.is_super_admin());

CREATE POLICY "project_types_delete_super_admin" ON project_types
  FOR DELETE
  TO authenticated
  USING (public.is_super_admin());

-- ============================================================
-- projects
-- ============================================================
-- Visibility-based access:
-- - public: anyone (including anon)
-- - private: authenticated users in org
-- - internal: SUPER_ADMIN and DIRECTORS only
CREATE POLICY "projects_read_public" ON projects
  FOR SELECT
  TO anon
  USING (visibility = 'public' AND status = 'active');

CREATE POLICY "projects_read_authenticated" ON projects
  FOR SELECT
  TO authenticated
  USING (
    organization_id = public.current_user_org_id()
    AND (
      visibility IN ('public', 'private')
      OR (visibility = 'internal' AND public.is_super_admin())
    )
  );

-- SUPER_ADMIN, DIRECTOR, COORDINATOR can insert/update
CREATE POLICY "projects_insert_admin" ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id = public.current_user_org_id()
    AND public.is_admin_or_coordinator()
  );

CREATE POLICY "projects_update_admin" ON projects
  FOR UPDATE
  TO authenticated
  USING (
    organization_id = public.current_user_org_id()
    AND public.is_admin_or_coordinator()
  );

CREATE POLICY "projects_delete_super_admin" ON projects
  FOR DELETE
  TO authenticated
  USING (public.is_super_admin());

-- ============================================================
-- project_participants
-- ============================================================
CREATE POLICY "project_participants_read_org" ON project_participants
  FOR SELECT
  TO authenticated
  USING (
    project_id IN (
      SELECT id FROM projects WHERE organization_id = public.current_user_org_id()
    )
  );

CREATE POLICY "project_participants_insert_admin" ON project_participants
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_or_coordinator());

CREATE POLICY "project_participants_update_admin" ON project_participants
  FOR UPDATE
  TO authenticated
  USING (public.is_admin_or_coordinator());

CREATE POLICY "project_participants_delete_super_admin" ON project_participants
  FOR DELETE
  TO authenticated
  USING (public.is_super_admin());

-- ============================================================
-- contributions
-- ============================================================
CREATE POLICY "contributions_read_org" ON contributions
  FOR SELECT
  TO authenticated
  USING (organization_id = public.current_user_org_id());

CREATE POLICY "contributions_insert_admin" ON contributions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id = public.current_user_org_id()
    AND public.is_admin_or_coordinator()
  );

CREATE POLICY "contributions_update_admin" ON contributions
  FOR UPDATE
  TO authenticated
  USING (
    organization_id = public.current_user_org_id()
    AND public.is_admin_or_coordinator()
  );

CREATE POLICY "contributions_delete_super_admin" ON contributions
  FOR DELETE
  TO authenticated
  USING (public.is_super_admin());

-- ============================================================
-- payments
-- ============================================================
CREATE POLICY "payments_read_org" ON payments
  FOR SELECT
  TO authenticated
  USING (
    contribution_id IN (
      SELECT id FROM contributions WHERE organization_id = public.current_user_org_id()
    )
  );

CREATE POLICY "payments_insert_admin" ON payments
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_or_coordinator());

CREATE POLICY "payments_update_admin" ON payments
  FOR UPDATE
  TO authenticated
  USING (public.is_admin_or_coordinator());

CREATE POLICY "payments_delete_super_admin" ON payments
  FOR DELETE
  TO authenticated
  USING (public.is_super_admin());

-- ============================================================
-- attachments
-- ============================================================
CREATE POLICY "attachments_read_org" ON attachments
  FOR SELECT
  TO authenticated
  USING (organization_id = public.current_user_org_id());

CREATE POLICY "attachments_insert_admin" ON attachments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id = public.current_user_org_id()
    AND public.is_admin_or_coordinator()
  );

CREATE POLICY "attachments_update_admin" ON attachments
  FOR UPDATE
  TO authenticated
  USING (
    organization_id = public.current_user_org_id()
    AND public.is_admin_or_coordinator()
  );

CREATE POLICY "attachments_delete_super_admin" ON attachments
  FOR DELETE
  TO authenticated
  USING (public.is_super_admin());

-- ============================================================
-- notes
-- ============================================================
CREATE POLICY "notes_read_org" ON notes
  FOR SELECT
  TO authenticated
  USING (organization_id = public.current_user_org_id());

-- Public notes visible to anon
CREATE POLICY "notes_read_public" ON notes
  FOR SELECT
  TO anon
  USING (visibility = 'public');

CREATE POLICY "notes_insert_admin" ON notes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id = public.current_user_org_id()
    AND public.is_admin_or_coordinator()
  );

CREATE POLICY "notes_update_admin" ON notes
  FOR UPDATE
  TO authenticated
  USING (
    organization_id = public.current_user_org_id()
    AND public.is_admin_or_coordinator()
  );

CREATE POLICY "notes_delete_super_admin" ON notes
  FOR DELETE
  TO authenticated
  USING (public.is_super_admin());

-- ============================================================
-- activity_logs
-- ============================================================
CREATE POLICY "activity_logs_read_super_admin" ON activity_logs
  FOR SELECT
  TO authenticated
  USING (public.is_super_admin());

CREATE POLICY "activity_logs_insert_system" ON activity_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id = public.current_user_org_id()
  );

-- ============================================================
-- invitations
-- ============================================================
-- Only SUPER_ADMIN can read/insert/update/delete invitations
CREATE POLICY "invitations_select_super_admin" ON invitations
  FOR SELECT
  TO authenticated
  USING (public.is_super_admin());

CREATE POLICY "invitations_insert_super_admin" ON invitations
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_super_admin());

CREATE POLICY "invitations_update_super_admin" ON invitations
  FOR UPDATE
  TO authenticated
  USING (public.is_super_admin());

CREATE POLICY "invitations_delete_super_admin" ON invitations
  FOR DELETE
  TO authenticated
  USING (public.is_super_admin());

-- Unauthenticated users can read their own invitation by token (for accepting)
CREATE POLICY "invitations_select_by_token" ON invitations
  FOR SELECT
  TO anon
  USING (
    token IS NOT NULL
    AND used_at IS NULL
    AND expires_at > now()
  );

-- ============================================================
-- person_tags
-- ============================================================
CREATE POLICY "person_tags_read_org" ON person_tags
  FOR SELECT
  TO authenticated
  USING (organization_id = public.current_user_org_id());

CREATE POLICY "person_tags_insert_super_admin" ON person_tags
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_super_admin());

CREATE POLICY "person_tags_update_super_admin" ON person_tags
  FOR UPDATE
  TO authenticated
  USING (public.is_super_admin());

CREATE POLICY "person_tags_delete_super_admin" ON person_tags
  FOR DELETE
  TO authenticated
  USING (public.is_super_admin());

-- ============================================================
-- people_tags_relations
-- ============================================================
CREATE POLICY "people_tags_relations_read_org" ON people_tags_relations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "people_tags_relations_insert_admin" ON people_tags_relations
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_or_coordinator());

CREATE POLICY "people_tags_relations_update_admin" ON people_tags_relations
  FOR UPDATE
  TO authenticated
  USING (public.is_admin_or_coordinator());

CREATE POLICY "people_tags_relations_delete_super_admin" ON people_tags_relations
  FOR DELETE
  TO authenticated
  USING (public.is_super_admin());

-- ============================================================
-- custom_field_definitions
-- ============================================================
CREATE POLICY "custom_field_definitions_read_org" ON custom_field_definitions
  FOR SELECT
  TO authenticated
  USING (organization_id = public.current_user_org_id());

CREATE POLICY "custom_field_definitions_insert_super_admin" ON custom_field_definitions
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_super_admin());

CREATE POLICY "custom_field_definitions_update_super_admin" ON custom_field_definitions
  FOR UPDATE
  TO authenticated
  USING (public.is_super_admin());

CREATE POLICY "custom_field_definitions_delete_super_admin" ON custom_field_definitions
  FOR DELETE
  TO authenticated
  USING (public.is_super_admin());

-- ============================================================
-- custom_field_values
-- ============================================================
CREATE POLICY "custom_field_values_read_org" ON custom_field_values
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "custom_field_values_insert_admin" ON custom_field_values
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_or_coordinator());

CREATE POLICY "custom_field_values_update_admin" ON custom_field_values
  FOR UPDATE
  TO authenticated
  USING (public.is_admin_or_coordinator());

CREATE POLICY "custom_field_values_delete_super_admin" ON custom_field_values
  FOR DELETE
  TO authenticated
  USING (public.is_super_admin());
