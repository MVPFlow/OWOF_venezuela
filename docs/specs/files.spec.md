# Files & Evidence Module Specification

## OWOFVzla Social Platform

Version: 0.1
Status: Draft

---

## 1. Objective

Provide a **centralized file and evidence management system** that allows authenticated users (with appropriate roles) to:

- Upload files (images, PDFs, documents) and attach them to various entities (people, projects, payments, contributions, etc.).
- Categorize attachments (receipt, evidence, profile photo, etc.).
- Preview, download, and delete attachments.
- Enforce file type and size restrictions.
- Support mobile capture (camera, gallery).
- Respect visibility and permission rules (e.g., private vs public evidence).

Files are stored in **Supabase Storage** with row-level security (RLS) policies controlling access.

---

## 2. Business Rules

| Rule ID  | Description                                                                                                                                                                                                                                                   |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FILE‑001 | Each attachment belongs to an entity (`entity_type` and `entity_id`). Allowed entity types: `person`, `project`, `payment`, `contribution`, `note`.                                                                                                           |
| FILE‑002 | Allowed file types: images (JPEG, PNG, WebP), PDF, and common document formats (DOCX, XLSX – optional). Executable files are strictly forbidden.                                                                                                              |
| FILE‑003 | Maximum file size: 10 MB per file (configurable).                                                                                                                                                                                                             |
| FILE‑004 | Attachments can have a category: `receipt`, `transfer`, `student_photo`, `report`, `invoice`, `evidence`, `medical_document`.                                                                                                                                 |
| FILE‑005 | Uploads require authentication and proper permissions (based on the target entity’s visibility and user role).                                                                                                                                                |
| FILE‑006 | Attachments inherit visibility from their parent entity? For public project landing pages, only attachments with explicit `is_public = true` or linked to a public entity and category `evidence` may be shown. MVP: separate flag `is_public` on attachment. |
| FILE‑007 | Deletion of an attachment is a soft delete (mark as deleted) for audit; permanent deletion only by SUPER_ADMIN.                                                                                                                                               |
| FILE‑008 | Each attachment has an associated `uploaded_by` user for audit.                                                                                                                                                                                               |
| FILE‑009 | Mobile uploads should support resumable uploads (partial) for unstable networks? MVP: simple upload with retry.                                                                                                                                               |

---

## 3. UI & UX (Mobile‑First)

### 3.1 Attachment Gallery (Component)

- **Reusable component** used in Person, Project, Payment detail pages.
- **Layout:** Grid of thumbnails (2 or 3 columns). Each thumbnail shows:
  - Preview (image) or file icon (PDF, document).
  - Category badge (small).
  - Actions: view, download, delete (if permission).
- **Upload button:** Floating button or inline button; opens mobile file picker (camera, gallery, documents).

### 3.2 Upload Modal / Bottom Sheet

- **Trigger:** “Add File” or camera icon.
- **Options (mobile):**
  - Take photo (camera)
  - Choose from gallery (images)
  - Upload document (PDF, etc.)
- **After selection:** Show preview, allow adding category and description.
- **Upload progress:** Show progress indicator, cancel option.

### 3.3 File Preview

- **Images:** Full‑screen modal with pinch‑to‑zoom.
- **PDFs:** Open in browser viewer or download.
- **Other documents:** Download link.

### 3.4 Public vs Private Indicator

- For attachments in public projects, show a badge "Public" or "Internal" to inform user who can see it.

---

## 4. API Endpoints (Server Actions)

### 4.1 Upload Attachment

- **Action:** `uploadAttachment(entityType: string, entityId: string, file: File, category: string, isPublic?: boolean)`
- **Permissions:** Depends on entity. For person: COORDINATOR+; for project: COORDINATOR+; for payment: ACCOUNTING+.
- **Process:**
  - Validate file type & size.
  - Generate unique path: `{entityType}/{entityId}/{timestamp}_{filename}`.
  - Upload to Supabase Storage bucket (private or public based on sensitivity).
  - Insert record into `attachments` table.
- **Return:** `{ success: true, attachmentId, url }`

### 4.2 Delete Attachment

- **Action:** `deleteAttachment(attachmentId: string)`
- **Permissions:** Same as upload (or SUPER_ADMIN).
- **Process:** Soft delete (set `deleted_at`), or permanently remove file from storage? MVP: soft delete to keep audit.
- **Return:** `{ success: true }`

### 4.3 Get Attachments for Entity

- **Query:** `getAttachments(entityType: string, entityId: string, includePublicOnly?: boolean)`
- **Permissions:** Respects entity permissions; if `includePublicOnly` true, only attachments with `is_public = true` returned (for public landing pages).
- **Return:** List of attachments with signed URLs (temporary).

### 4.4 Download Attachment

- **Action:** `getAttachmentUrl(attachmentId: string)` – returns signed URL (expires in 60 seconds).
- **Permissions:** Same as view.

---

## 5. Validation Schema (Zod)

```typescript
import { z } from "zod";

export const AttachmentSchema = z.object({
  entity_type: z.enum(["person", "project", "payment", "contribution", "note"]),
  entity_id: z.string().uuid(),
  category: z.enum([
    "receipt",
    "transfer",
    "student_photo",
    "report",
    "invoice",
    "evidence",
    "medical_document",
  ]),
  is_public: z.boolean().default(false),
});

export const AllowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];
```

---

## 6. Edge Cases & Error Handling

| Scenario                                                   | Expected Behavior                                                                 |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Upload exceeds size limit                                  | Reject with error: “File exceeds 10 MB limit.”                                    |
| Unsafe file type (.exe, .js)                               | Reject with error: “File type not allowed.”                                       |
| Upload fails due to network                                | Show retry button; preserve file selection for retry.                             |
| Attaching file to entity that user no longer has access to | Validate permission at upload time; if parent entity is deleted/archived, reject. |
| Public attachment displayed on public project page         | Ensure RLS and query filter `is_public = true`.                                   |
| Deleting attachment used in a payment (receipt)            | Prevent deletion if receipt is the only proof? MVP: allow but warn.               |

---

## 7. Permissions Matrix

| Action                      | SUPER_ADMIN | DIRECTOR         | COORDINATOR           | ACCOUNTING            | VOLUNTEER          | VIEWER         |
| --------------------------- | ----------- | ---------------- | --------------------- | --------------------- | ------------------ | -------------- |
| Upload attachment (person)  | ✅          | ✅               | ✅                    | ❌                    | ❌                 | ❌             |
| Upload attachment (project) | ✅          | ✅               | ✅                    | ❌                    | ❌                 | ❌             |
| Upload attachment (payment) | ✅          | ✅               | ❌                    | ✅                    | ❌                 | ❌             |
| View attachments (person)   | ✅          | ✅               | ✅                    | ✅ (read only)        | ❌ (only assigned) | ✅ (read only) |
| View attachments (project)  | ✅          | ✅               | ✅                    | ✅ (read only)        | ✅ (if assigned)   | ✅ (read only) |
| Delete attachment           | ✅          | ✅ (own? or any) | ✅ (own uploads only) | ✅ (own uploads only) | ❌                 | ❌             |
| Mark attachment as public   | ✅          | ✅               | ❌ (maybe restrict)   | ❌                    | ❌                 | ❌             |

---

## 8. Mobile UX Requirements

- **Camera integration:** Use `capture="environment"` on file input for quick photo.
- **Gallery access:** `accept="image/*"` for images.
- **Upload progress:** Show percentage and cancel button.
- **Preview:** Tap on image to open fullscreen; swipe to close.
- **Multiple uploads:** Allow selecting multiple files at once (with limitations).

---

## 9. Acceptance Criteria

- [ ] User can upload a photo from camera or gallery to a person, project, or payment.
- [ ] Uploaded file appears in attachments list with thumbnail.
- [ ] User can view, download, and delete (if permitted) attachments.
- [ ] File type and size validation works.
- [ ] Public/private flag respected on public project landing pages.
- [ ] Attachments are stored securely (private bucket by default).
- [ ] Signed URLs expire after short time (no direct public access).
- [ ] Uploads are audited (who uploaded what, when).
- [ ] Mobile upload works on small screens.

---

## 10. Technical Notes

- **Storage buckets:**
  - `attachments-private` – for sensitive files (receipts, medical documents). Access via signed URLs.
  - `attachments-public` – for profile photos, public evidence (optional, but use signed URLs anyway).
- **Signed URLs:** Supabase Storage provides `createSignedUrl` (expires in 60-300 seconds).
- **RLS policies:** On `attachments` table, enforce that users can only see attachments for entities they have access to.
- **Upload through server action:** To validate permissions before generating upload URL or directly uploading via client? Safer to use server‑side upload (file stream). But for large files, client upload to signed URL is better. MVP: client direct upload to signed URL obtained from server action (presigned).
- **Delete:** Soft delete by setting `deleted_at`. Actual file removal from storage can be done later via cleanup job.

---

## 11. Dependencies

- Supabase Storage buckets configured.
- `attachments` table in database.
- RLS policies.
- Entity tables (people, projects, payments) have corresponding IDs.

---

## 12. Definition of Done

- All acceptance criteria met.
- TypeScript passes.
- Unit tests for validation.
- E2E test for upload → view → delete flow.
- Mobile responsive tested.
- Documentation updated.

---

**Created:** 2026-05-28  
**Next:** Create `specs/auth.spec.md` (if needed) or `flows/project-creation-flow.md`
