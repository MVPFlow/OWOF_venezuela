# Projects Module Specification

## OWOFVzla Social Platform

Version: 0.1
Status: Draft

---

## 1. Objective

Provide a **project management system** that allows authenticated users (with appropriate roles) to:

- Create, read, update, archive, and search for projects.
- Define project type (scholarship, medical, food, emergency, etc.).
- Set project visibility (public, private, internal).
- Manage project participants (people assigned to the project with specific roles).
- Add notes (public, internal, private) to a project.
- Upload cover images and evidence attachments.
- Support mobile-first forms and lists.

Projects are generic containers for social initiatives. They can later be linked to contributions (sponsorships) and payments.

**Public projects** with `visibility = 'public'` will have a dedicated landing page (`/proyectos/[slug]`) as defined in Phase 06.

---

## 2. Business Rules

| Rule ID | Description                                                                                                                                                               |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PRO‑001 | A project belongs to the single organization (OWOFVzla) and one project type.                                                                                             |
| PRO‑002 | Project title is required, slug is auto-generated from title (unique within organization).                                                                                |
| PRO‑003 | Project visibility: `public` (visible on public landing page), `private` (only internal users), `internal` (restricted operational visibility, e.g., sensitive projects). |
| PRO‑004 | Project status: `draft`, `active`, `completed`, `archived`.                                                                                                               |
| PRO‑005 | Archived projects are read‑only; no modifications allowed unless reactivated.                                                                                             |
| PRO‑006 | A project can have multiple participants (people with contextual roles like `student`, `sponsor`, `volunteer`, `coordinator`).                                            |
| PRO‑007 | The same person can be a participant in multiple projects with different roles.                                                                                           |
| PRO‑008 | Removing a participant from a project must preserve historical records (use `left_at` or soft delete flag).                                                               |
| PRO‑009 | Only SUPER_ADMIN and DIRECTOR can change project visibility from `private` to `public` (sensitive data exposure risk).                                                    |
| PRO‑010 | Public project pages must never expose internal notes, private evidence, or internal financial data.                                                                      |

---

## 3. UI & UX (Mobile‑First)

### 3.1 Projects List Page

- **Route:** `/dashboard/projects`
- **Layout:** Card list (mobile‑optimized). Each card shows:
  - Cover image (placeholder if none)
  - Title, status badge, visibility badge
  - Short description (truncated)
  - Quick actions: edit, archive, view details
- **Search bar** (debounced, searches title, description, slug).
- **Filters:** by status, by visibility, by project type.
- **Floating Action Button (FAB)** → “Create Project” (opens form).
- **Pagination or infinite scroll** (load more button).

### 3.2 Project Detail Page

- **Route:** `/dashboard/projects/[id]`
- **Sections:**
  - **Header:** Title, status, visibility, cover image, actions (edit, archive, delete for admins).
  - **Basic info:** Description, project type, dates (start, end), created by.
  - **Participants:** List of participants (person name, role, status). Add/remove participants (search people). For each participant, show joined_at, left_at.
  - **Notes:** Timeline of notes with visibility. Add new note.
  - **Attachments:** Gallery of evidence/uploads.
  - **Contributions (future):** List of contributions linked to this project.
  - **Public link:** If visibility = public, show link to `/proyectos/[slug]`.

### 3.3 Create / Edit Project Form

- **Mobile layout:** Vertical stack, grouped sections.
- **Fields:**
  - Title (required)
  - Project type (select from seeded types: scholarship, medical, food, emergency)
  - Description (textarea, optional)
  - Visibility (public, private, internal) – restricted to SUPER_ADMIN/DIRECTOR for public? MVP: allow COORDINATOR but warn.
  - Status (draft, active, completed, archived)
  - Start date (date picker)
  - End date (date picker, optional)
  - Cover image upload (optional)
- **Save:** Submit button; after save redirect to detail page.

### 3.4 Manage Participants

- **From project detail:** Button “Add Participant” opens searchable modal/list of people.
- Select person, choose role (student, sponsor, volunteer, coordinator, etc.), set joined_at (default today). Optionally set left_at (if adding historical).
- Display current participants with ability to remove or edit role (soft removal: set left_at).

### 3.5 Archive / Restore / Delete

- **Archive (soft delete):** COORDINATOR+. Moves project to archived; hides from default list; prevents edits.
- **Restore:** COORDINATOR+ from archived list.
- **Permanent delete:** Only SUPER_ADMIN (rare, not recommended). Cascade? MVP: restrict.

---

## 4. API Endpoints (Server Actions)

### 4.1 Create Project

- **Action:** `createProject(data: ProjectCreateInput)`
- **Permissions:** COORDINATOR+
- **Validation:** Title required; slug auto‑generated (unique).
- **Process:** Insert into `projects` table, set `created_by = current_user.id`, `organization_id` fixed.
- **Return:** `{ success: true, projectId }`

### 4.2 Update Project

- **Action:** `updateProject(projectId: string, data: ProjectUpdateInput)`
- **Permissions:** COORDINATOR+
- **Restrictions:** If project is archived, reject update (unless reactivating).
- **Return:** `{ success: true }`

### 4.3 Archive Project

- **Action:** `archiveProject(projectId: string)`
- **Permissions:** COORDINATOR+
- **Process:** Set `status = 'archived'` (or use `deleted_at`? We use status field).
- **Return:** `{ success: true }`

### 4.4 Restore Project

- **Action:** `restoreProject(projectId: string)`
- **Permissions:** COORDINATOR+
- **Process:** Set status back to `active` or previous non‑archived status.
- **Return:** `{ success: true }`

### 4.5 Delete Project (Permanent)

- **Action:** `permanentlyDeleteProject(projectId: string)`
- **Permissions:** SUPER_ADMIN only.
- **Return:** `{ success: true }`

### 4.6 List Projects

- **Query:** `getProjects(params: { search?: string, status?: string, visibility?: string, type?: string, page?: number })`
- **Permissions:** Authenticated users, filtered by role and visibility. VOLUNTEER sees only projects they are assigned to.
- **Return:** Paginated list.

### 4.7 Get Project by ID

- **Query:** `getProjectById(projectId: string)`
- **Permissions:** Authenticated, with visibility restrictions.
- **Return:** Full project object with participants, notes, attachments.

### 4.8 Add Participant

- **Action:** `addParticipant(projectId: string, personId: string, role: string, joinedAt?: Date)`
- **Permissions:** COORDINATOR+
- **Process:** Insert into `project_participants`.
- **Return:** `{ success: true }`

### 4.9 Update Participant

- **Action:** `updateParticipant(participantId: string, data: { role?: string, left_at?: Date })`
- **Permissions:** COORDINATOR+
- **Return:** `{ success: true }`

### 4.10 Remove Participant (soft)

- **Action:** `removeParticipant(participantId: string)`
- **Permissions:** COORDINATOR+
- **Process:** Set `left_at = now()` (or delete record? prefer soft).
- **Return:** `{ success: true }`

### 4.11 Add Note to Project

- **Action:** `addNoteToProject(projectId: string, content: string, visibility: 'private'|'internal'|'public')`
- **Permissions:** COORDINATOR+
- **Return:** `{ success: true, noteId }`

### 4.12 Upload Attachment to Project

- **Action:** `uploadProjectAttachment(projectId: string, file: File, category: string)`
- **Permissions:** COORDINATOR+
- **Return:** `{ success: true, attachmentId, url }`

---

## 5. Validation Schema (Zod)

```typescript
import { z } from "zod";

export const ProjectBaseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  project_type_id: z.string().uuid(),
  description: z.string().optional(),
  visibility: z.enum(["public", "private", "internal"]).default("private"),
  status: z.enum(["draft", "active", "completed", "archived"]).default("draft"),
  start_date: z.string().date().optional(),
  end_date: z.string().date().optional(),
  cover_image_url: z.string().url().optional(),
});

export const ProjectCreateSchema = ProjectBaseSchema;
export const ProjectUpdateSchema = ProjectBaseSchema.partial();
```

---

## 6. Edge Cases & Error Handling

| Scenario                                                                       | Expected Behavior                                                                                                                             |
| ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Duplicate slug (auto‑generated from title)                                     | Append number (e.g., `my-project-2`). Notify user.                                                                                            |
| Trying to set `visibility = 'public'` without proper role                      | Reject with permission error.                                                                                                                 |
| Adding a participant who is already a participant (active)                     | Reject with warning: "Person already participates in this project."                                                                           |
| Archiving a project with active contributions                                  | Allow, but show warning: "This project has active contributions. Archiving will mark them as paused?" MVP: no automatic change, just warning. |
| Public project landing page accessed but project visibility changed to private | Show 404 or "Not found" (to avoid leaking existence).                                                                                         |
| Uploading invalid file type                                                    | Reject.                                                                                                                                       |

---

## 7. Permissions Matrix

| Action                      | SUPER_ADMIN | DIRECTOR | COORDINATOR                | VOLUNTEER              | ACCOUNTING     | VIEWER         |
| --------------------------- | ----------- | -------- | -------------------------- | ---------------------- | -------------- | -------------- |
| List projects (all)         | ✅          | ✅       | ✅                         | ✅ (assigned only)     | ✅ (read only) | ✅ (read only) |
| View project detail         | ✅          | ✅       | ✅                         | ✅ (if assigned)       | ✅ (read only) | ✅ (read only) |
| Create project              | ✅          | ✅       | ✅                         | ❌                     | ❌             | ❌             |
| Edit project (own/any)      | ✅ (any)    | ✅ (any) | ✅ (own, or any? MVP: any) | ❌                     | ❌             | ❌             |
| Archive/restore             | ✅          | ✅       | ✅                         | ❌                     | ❌             | ❌             |
| Permanently delete          | ✅          | ❌       | ❌                         | ❌                     | ❌             | ❌             |
| Manage participants         | ✅          | ✅       | ✅                         | ❌                     | ❌             | ❌             |
| Add notes                   | ✅          | ✅       | ✅                         | ❌ (assigned? MVP: no) | ❌             | ❌             |
| Upload attachments          | ✅          | ✅       | ✅                         | ❌                     | ❌             | ❌             |
| Change visibility to public | ✅          | ✅       | ❌ (restrict)              | ❌                     | ❌             | ❌             |

---

## 8. Mobile UX Requirements

- **Form layout:** Vertical spacing, native date pickers, select dropdown for type/visibility.
- **Cover image upload:** Use camera or gallery, show preview.
- **Participant management:** Search people with autocomplete, modal selection. Mobile-friendly chip display for roles.
- **List view:** Cards with cover image placeholder, status badge.
- **Search and filters:** Expandable filter drawer (slide‑in).
- **Public project link:** Copy link button (share).

---

## 9. Acceptance Criteria

- [ ] COORDINATOR can create a project with minimal fields (title, type).
- [ ] Project appears in list; searchable by title.
- [ ] Project detail shows all information, participants, notes, attachments.
- [ ] User can edit project (except visibility restrictions).
- [ ] User can archive and restore a project.
- [ ] SUPER_ADMIN can permanently delete a project.
- [ ] Participants can be added, updated, removed (soft).
- [ ] Notes and attachments can be added.
- [ ] Public visibility projects generate a working public landing page (test in Phase 06).
- [ ] Permissions respected (VOLUNTEER sees only assigned projects).
- [ ] Mobile layout tested.

---

## 10. Technical Notes

- Use Drizzle ORM for database.
- Slug generation: from title (lowercase, hyphens, remove special chars). Unique constraint.
- Project participants table: `project_participants` (id, project_id, person_id, role, status, joined_at, left_at).
- Status field on projects: `draft`, `active`, `completed`, `archived`. No separate `deleted_at`; use `archived` status.
- RLS policies: filter by organization and visibility; for VOLUNTEER, join with project_participants.
- Public landing pages: separate route group `(public)`, use server component to fetch project by slug, validate `visibility='public'`.

---

## 11. Dependencies

- `people` table for participants.
- `project_types` seeded data.
- `notes` and `attachments` tables (polymorphic).
- Storage bucket for cover images and project evidence.

---

## 12. Definition of Done

- All acceptance criteria met.
- TypeScript passes.
- Unit tests for validation and participant management.
- E2E test for project creation and participant assignment.
- Mobile responsive tested.
- Documentation updated.

---

**Created:** 2026-05-28  
**Next:** Create `specs/contributions.spec.md` or `flows/sponsorship-flow.md`
