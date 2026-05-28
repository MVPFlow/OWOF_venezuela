# People Module Specification

## OWOFVzla Social Platform

Version: 0.1
Status: Draft

---

## 1. Objective

Provide a **master people management system** that allows authenticated users (with appropriate roles) to:

- Create, read, update, archive, and search for people (beneficiaries, sponsors, volunteers, students, etc.).
- Assign tags (e.g., "student", "sponsor", "volunteer") to people.
- Upload a profile photo.
- Add notes (private, internal, or public) to a person.
- Link attachments (evidence, documents) to a person.
- Support mobile-first forms and lists.

People exist independently of projects; they can later be linked to projects as participants.

**Future:** A person may optionally have a linked user account (`user_id`) for sponsor/donor portals, but that is **not** part of this spec (reserved for Phase 09).

---

## 2. Business Rules

| Rule ID | Description                                                                                                                                                                                                                                                                                             |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PER‑001 | A person belongs to the single organization (OWOFVzla).                                                                                                                                                                                                                                                 |
| PER‑002 | A person must have at least a first name or last name (minimum information to identify).                                                                                                                                                                                                                |
| PER‑003 | Email and phone number are optional, but if provided, must be unique within the organization? (MVP: not enforced, but duplicate detection is recommended via search).                                                                                                                                   |
| PER‑004 | A person can be soft‑deleted (`deleted_at`). Soft‑deleted persons are not shown in default lists but can be restored by SUPER_ADMIN.                                                                                                                                                                    |
| PER‑005 | Deleting a person should not delete their historical relationships (project participants, contributions, etc.). Those should become orphaned or marked with `person_id = NULL`? Better to preserve foreign key with `ON DELETE SET NULL` or `RESTRICT`. MVP: Use soft delete only, no cascade deletion. |
| PER‑006 | Only SUPER_ADMIN and DIRECTOR can permanently delete a person (hard delete). Others can soft‑delete (archive).                                                                                                                                                                                          |
| PER‑007 | Any authenticated user with role ≥ COORDINATOR can create and edit people. VOLUNTEER can view assigned people only (filtered by project participation).                                                                                                                                                 |
| PER‑008 | People can be assigned multiple tags (many‑to‑many via `people_tags_relations`).                                                                                                                                                                                                                        |
| PER‑009 | Notes attached to a person respect visibility: `private` (only creator and admins), `internal` (all internal users), `public` (visible on public project pages if person is associated with a public project).                                                                                          |

---

## 3. UI & UX (Mobile‑First)

### 3.1 People List Page

- **Route:** `/dashboard/people`
- **Layout:** Mobile‑optimized card list (not table). Each card shows:
  - Profile photo (placeholder if none)
  - Name (first + last)
  - Tags (badges)
  - Quick actions: edit, archive, view details
- **Search bar** at top (debounced, searches first_name, last_name, email, phone, document_id).
- **Filters:** by tag, by status (active / archived).
- **Floating Action Button (FAB)** → “Create Person” (opens form modal or dedicated page).
- **Infinite scroll or pagination** (load more button) – MVP: pagination with "Load More".

### 3.2 Person Detail Page

- **Route:** `/dashboard/people/[id]`
- **Sections:**
  - **Header:** Photo, name, status badge, actions (edit, archive, delete for admins).
  - **Information:** All fields (first_name, last_name, document_id, birth_date, phone, email, address, etc.).
  - **Tags:** Display tags, add/remove (editable).
  - **Notes:** Timeline of notes (with visibility indicators). Add new note (with visibility selector).
  - **Attachments:** Gallery of uploaded files (evidence, documents). Upload button (camera / gallery).
  - **Projects Participated:** List of projects where this person is a participant (show role, project name, status). Clickable to project detail.
  - **Contributions (as sponsor or beneficiary):** Summary of contributions (future phase).

### 3.3 Create / Edit Person Form

- **Mobile layout:** Vertical stack, grouped sections (Personal Info, Contact, Address, Metadata).
- **Fields:**
  - First name (required)
  - Last name (optional but recommended)
  - Document ID (optional)
  - Birth date (date picker)
  - Phone (tel input)
  - Email (email input)
  - Gender (select: male, female, other, prefer not to say)
  - Address: street, city, state, country (separate fields or combined textarea)
  - Photo upload (camera / gallery)
  - Notes (optional, initial note)
  - Tags (select / multi‑select)
- **Save behavior:** Submit button; after save redirect to detail page or stay and toast success.

### 3.4 Archive / Restore / Delete

- **Archive (soft delete):** Available to COORDINATOR+. Moves person to archived list; hides from default list. Action requires confirmation.
- **Restore:** Available to COORDINATOR+ from archived list.
- **Permanent delete:** Only SUPER_ADMIN (and DIRECTOR? MVP: only SUPER_ADMIN). Requires confirmation and warning about irreversibility.

---

## 4. API Endpoints (Server Actions)

All actions are server actions with `"use server"`. Input validation via Zod.

### 4.1 Create Person

- **Action:** `createPerson(data: PersonCreateInput)`
- **Permissions:** COORDINATOR+
- **Validation:** First name required; other fields optional but type‑checked.
- **Process:** Insert into `people` table, set `organization_id` fixed. Optionally create initial note and attachments.
- **Return:** `{ success: true, personId }`

### 4.2 Update Person

- **Action:** `updatePerson(personId: string, data: PersonUpdateInput)`
- **Permissions:** COORDINATOR+
- **Validation:** Ensure person exists and not archived (or allow update of archived? MVP: allow but warn).
- **Return:** `{ success: true }`

### 4.3 Archive Person (Soft Delete)

- **Action:** `archivePerson(personId: string)`
- **Permissions:** COORDINATOR+
- **Process:** Set `deleted_at = now()`. Do not delete relationships.
- **Return:** `{ success: true }`

### 4.4 Restore Person

- **Action:** `restorePerson(personId: string)`
- **Permissions:** COORDINATOR+
- **Process:** Set `deleted_at = NULL`.
- **Return:** `{ success: true }`

### 4.5 Permanently Delete Person

- **Action:** `permanentlyDeletePerson(personId: string)`
- **Permissions:** SUPER_ADMIN only.
- **Process:** Delete from `people` table after checking no critical foreign keys rely on it (or cascade carefully). Log audit.
- **Return:** `{ success: true }`

### 4.6 List People

- **Query:** `getPeople(params: { search?: string, tag?: string, status?: 'active' | 'archived', page?: number, pageSize?: number })`
- **Permissions:** Authenticated users (filtered by role: COORDINATOR+ see all; VOLUNTEER see only those linked to their projects).
- **Return:** Paginated list of people with tags and basic info.

### 4.7 Get Person by ID

- **Query:** `getPersonById(personId: string)`
- **Permissions:** Authenticated users, but if VOLUNTEER, only if person is linked to their projects.
- **Return:** Full person object with tags, notes, attachments, project participants.

### 4.8 Add Tag to Person

- **Action:** `addTagToPerson(personId: string, tagId: string)`
- **Permissions:** COORDINATOR+
- **Return:** `{ success: true }`

### 4.9 Remove Tag from Person

- **Action:** `removeTagFromPerson(personId: string, tagId: string)`
- **Permissions:** COORDINATOR+

### 4.10 Add Note to Person

- **Action:** `addNoteToPerson(personId: string, content: string, visibility: 'private'|'internal'|'public')`
- **Permissions:** COORDINATOR+ (VOLUNTEER can add notes but only `private` or `internal`? MVP: restrict to COORDINATOR+).
- **Return:** `{ success: true, noteId }`

### 4.11 Upload Attachment to Person

- **Action:** `uploadPersonAttachment(personId: string, file: File, category: string)`
- **Permissions:** COORDINATOR+
- **Process:** Upload to Supabase Storage, create `attachments` record with `entity_type='person'`.
- **Return:** `{ success: true, attachmentId, url }`

---

## 5. Validation Schema (Zod)

```typescript
import { z } from "zod";

export const PersonBaseSchema = z.object({
  first_name: z.string().min(1, "First name required"),
  last_name: z.string().optional(),
  document_id: z.string().optional(),
  birth_date: z.string().date().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string().uuid()).optional(),
});

export const PersonCreateSchema = PersonBaseSchema;
export const PersonUpdateSchema = PersonBaseSchema.partial();
```

---

## 6. Edge Cases & Error Handling

| Scenario                                                        | Expected Behavior                                                                                                                                                     |
| --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Duplicate person (same name, email, document)                   | Not blocked by DB; display warning during creation: "A similar person already exists. Continue?"                                                                      |
| Archiving a person who is an active participant in projects     | Allow archive, but show warning: "This person is participating in active projects. Archiving will not remove them from projects, but they will be hidden from lists." |
| Trying to edit an archived person                               | Allow edit, but show warning that person is archived.                                                                                                                 |
| Uploading an invalid file type (e.g., .exe)                     | Reject with error: "File type not allowed."                                                                                                                           |
| Missing first name                                              | Validation error inline.                                                                                                                                              |
| Email already used by another active person                     | Warn but allow creation (MVP: no unique constraint).                                                                                                                  |
| VOLUNTEER tries to access a person not linked to their projects | Return 403 Forbidden or redirect.                                                                                                                                     |

---

## 7. Permissions Matrix

| Action             | SUPER_ADMIN | DIRECTOR         | COORDINATOR | VOLUNTEER              | ACCOUNTING     | VIEWER         |
| ------------------ | ----------- | ---------------- | ----------- | ---------------------- | -------------- | -------------- |
| List people (all)  | ✅          | ✅               | ✅          | ❌ (only assigned)     | ✅ (read only) | ✅ (read only) |
| View person detail | ✅          | ✅               | ✅          | ✅ (if assigned)       | ✅ (read only) | ✅ (read only) |
| Create person      | ✅          | ✅               | ✅          | ❌                     | ❌             | ❌             |
| Edit person        | ✅          | ✅               | ✅          | ❌ (assigned? MVP: no) | ❌             | ❌             |
| Archive/restore    | ✅          | ✅               | ✅          | ❌                     | ❌             | ❌             |
| Permanently delete | ✅          | ❌ (maybe later) | ❌          | ❌                     | ❌             | ❌             |
| Add/remove tags    | ✅          | ✅               | ✅          | ❌                     | ❌             | ❌             |
| Add notes          | ✅          | ✅               | ✅          | ❌                     | ❌             | ❌             |
| Upload attachments | ✅          | ✅               | ✅          | ❌                     | ❌             | ❌             |

---

## 8. Mobile UX Requirements

- **Form layout:** Use vertical spacing, large touch targets, native date picker.
- **Photo upload:** Camera integration (`capture="environment"`). Show preview before upload.
- **List view:** Cards with lazy loading images. Swipe actions (edit, archive) optionally.
- **Search:** Debounced (300ms) to avoid excessive calls.
- **Tags:** Multi‑select chips (touch‑friendly).
- **Notes section:** Expandable cards, visibility badge.
- **Empty states:** "No people yet" + "Create Person" button.

---

## 9. Acceptance Criteria

- [ ] COORDINATOR can create a person with minimal fields (first name only).
- [ ] Person appears in the list; can be searched by name/email.
- [ ] Clicking on person shows full details.
- [ ] User can edit person information.
- [ ] User can archive and restore a person.
- [ ] SUPER_ADMIN can permanently delete a person.
- [ ] Tags can be added/removed.
- [ ] Profile photo can be uploaded via camera or gallery.
- [ ] Notes can be added with visibility levels.
- [ ] Attachments can be uploaded.
- [ ] List respects role permissions (VOLUNTEER sees only assigned people).
- [ ] All actions generate activity logs.
- [ ] Mobile layout is usable on 320px width.

---

## 10. Technical Notes

- Use Drizzle ORM for database operations.
- Photo upload: store in Supabase Storage bucket `people-photos`, public access for avatars? Use signed URLs for protected images? MVP: public bucket (non‑sensitive).
- For attachments with sensitive data (e.g., medical documents), use private bucket with RLS.
- Soft delete: add `deleted_at` column, filter by default in queries.
- Tag system: pre‑seed some tags (student, sponsor, volunteer, beneficiary, doctor).
- Notes: store in `notes` table with `entity_type = 'person'` and `entity_id = person.id`.
- Activity logs: track `create`, `update`, `archive`, `restore`, `delete`.

---

## 11. Dependencies

- Database tables: `people`, `person_tags`, `people_tags_relations`, `notes`, `attachments`.
- Storage bucket: `people-photos` (public), `person-attachments` (private).
- Permissions & RLS policies.

---

## 12. Definition of Done

- All acceptance criteria met.
- TypeScript strict passes.
- Unit tests for validation and business rules.
- E2E test for full CRUD flow (create → edit → archive → restore).
- Mobile responsive tested on iOS and Android (Chrome).
- Documentation updated (this spec, API standards, folder structure).

---

**Created:** 2026-05-28  
**Next:** Create `specs/projects.spec.md`
