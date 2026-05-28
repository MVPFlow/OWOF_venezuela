# Invitations Module Specification

## OWOFVzla Social Platform

Version: 0.1
Status: Draft

---

## 1. Objective

Implement an **invitation-only user registration system** where only users with role `SUPER_ADMIN` can invite new users (organizers, directors, accounting, etc.). Invited users receive an email with a unique, one-time, time‑limited token. They click the link, set a password, and activate their account. There is **no public sign-up**.

This module covers:

- Creating an invitation (SUPER_ADMIN panel)
- Sending invitation emails via Resend
- Public acceptance page (`/accept-invite?token=...`)
- Validation of token (exists, not used, not expired)
- User account creation and activation
- Resending and revoking invitations

---

## 2. Business Rules

| Rule ID | Description                                                                                                                                                                                              |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| INV‑001 | Only users with role `SUPER_ADMIN` may create, resend, or revoke invitations.                                                                                                                            |
| INV‑002 | An invitation is identified by a unique, cryptographically random token (UUID v4).                                                                                                                       |
| INV‑003 | Each invitation is valid for **7 days** from creation. After expiry, the token cannot be used.                                                                                                           |
| INV‑004 | Each token can be used **only once**. After successful account creation, the invitation is marked as `used`.                                                                                             |
| INV‑005 | The invited email address must not already have an **active** user account. If an account exists but is inactive/suspended, the invitation may be used to reactivate? (MVP: reject with conflict error). |
| INV‑006 | When an invitation is accepted, a new `users` record is created with `status='active'`, the role specified in the invitation, and `invited_by` referencing the SUPER_ADMIN who created it.               |
| INV‑007 | The password is hashed by Supabase Auth; we never store or log plain-text passwords.                                                                                                                     |
| INV‑008 | Resending an invitation generates a **new token**, invalidates the old one, and resets the expiration clock to 7 days. The same email is used.                                                           |
| INV‑009 | Revoking an invitation (soft delete or marking as cancelled) makes the token unusable and prevents acceptance.                                                                                           |
| INV‑010 | The public acceptance endpoint must be rate‑limited (e.g., 5 attempts per IP per hour) to prevent brute‑force token guessing.                                                                            |

---

## 3. UI & UX (Mobile‑First)

### 3.1 SUPER_ADMIN Panel – Invitation Creation

- **Route:** `/admin/users/invite`
- **Components:**
  - Form with fields: email (required, email format), role (select from: COORDINATOR, DIRECTOR, ACCOUNTING, VOLUNTEER, VIEWER)
  - Submit button: “Send Invitation”
  - After submission: toast success “Invitation sent to [email]”
- **List of pending invitations:** `/admin/users/pending`
  - Table/cards showing email, role, token expiry, status (pending, expired, used)
  - Actions: resend (icon), revoke (trash icon)

### 3.2 Public Accept Invitation Page

- **Route:** `/accept-invite?token=...`
- **Mobile layout:** centered card, bottom action button.
- **Fields:**
  - Full name (optional? MVP: required to pre‑fill `users`? Actually `users` has no name; name is stored in `people`. For MVP, we may skip name or store it in `users.metadata`. Simpler: ask for **display name** stored in `raw_user_meta_data` of Supabase Auth.)
  - Password (and confirm password)
  - Accept terms checkbox (optional)
- **Submit button:** “Activate Account”
- **Errors shown inline:** token expired, already used, invalid token, email already registered, password mismatch, weak password.
- **Success:** redirect to login page with message “Account created! Please log in.”

### 3.3 Email Template

- **From:** `noreply@owofvzla.org` (or configured domain)
- **Subject:** “Invitation to join OWOFVzla Platform”
- **Body:**
  - Greeting
  - “You have been invited as [role].”
  - Link: `https://app.owofvzla.org/accept-invite?token=...`
  - Expiration notice (7 days)
  - “If you did not request this, ignore this email.”
- Use Resend + React Email for template.

---

## 4. API Endpoints

All endpoints use **Server Actions** unless specified. Provide TypeScript types.

### 4.1 Create Invitation

- **Action:** `inviteUser(email: string, role: Role)`
- **Permissions:** `SUPER_ADMIN` only
- **Validation:**
  - Email format (Zod)
  - Role is one of allowed roles (COORDINATOR, DIRECTOR, ACCOUNTING, VOLUNTEER, VIEWER)
  - No active user with same email
  - No pending (unused, not expired) invitation for same email (optional to allow resend)
- **Process:**
  - Generate token (`crypto.randomUUID()`)
  - Insert into `invitations` table with `expires_at = now() + 7 days`
  - Send email via Resend
- **Return:** `{ success: true, invitationId }` or error

### 4.2 Accept Invitation

- **Action:** `acceptInvitation(token: string, password: string, name?: string)`
- **Public (no auth)**
- **Validation:**
  - Token exists in `invitations` table
  - `used_at IS NULL`
  - `expires_at > now()`
  - No active user with same email (reject if exists)
- **Process:**
  - Create user in Supabase Auth (email from invitation, password, metadata: name)
  - Insert into `users` table (id from auth, `organization_id` fixed, role from invitation, status='active', invited_by from invitation.created_by)
  - Mark invitation as `used_at = now()`
- **Return:** `{ success: true }` or error codes

### 4.3 Resend Invitation

- **Action:** `resendInvitation(invitationId: string)`
- **Permissions:** `SUPER_ADMIN` only
- **Process:**
  - Retrieve invitation by id
  - Generate new token, update `token` and `expires_at`, keep `used_at = NULL`
  - Send new email with updated link
- **Return:** `{ success: true }`

### 4.4 Revoke Invitation

- **Action:** `revokeInvitation(invitationId: string)`
- **Permissions:** `SUPER_ADMIN` only
- **Process:** Delete or mark as `revoked_at = now()` (soft delete). If already used, do nothing.
- **Return:** `{ success: true }`

### 4.5 List Invitations (for admin panel)

- **Query:** `getInvitations(filters: { status?: 'pending' | 'expired' | 'used' })`
- **Permissions:** `SUPER_ADMIN` only
- **Return:** paginated list of invitations with details.

---

## 5. Validation Schema (Zod)

```typescript
import { z } from "zod";

export const InvitationSchema = z.object({
  email: z.string().email(),
  role: z.enum([
    "COORDINATOR",
    "DIRECTOR",
    "ACCOUNTING",
    "VOLUNTEER",
    "VIEWER",
  ]),
});

export const AcceptInvitationSchema = z.object({
  token: z.string().uuid(),
  password: z.string().min(8),
  name: z.string().optional(),
});
```

---

## 6. Edge Cases & Error Handling

| Scenario                               | Expected Behavior                                                                                                       |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Token expired                          | Return error: `INVITATION_EXPIRED`, show message “This invitation has expired. Please ask the administrator to resend.” |
| Token already used                     | Return error: `INVITATION_ALREADY_USED`                                                                                 |
| Invalid token (not found)              | Return `INVITATION_NOT_FOUND`                                                                                           |
| Email already registered (active user) | Return `EMAIL_ALREADY_REGISTERED`, prevent acceptance.                                                                  |
| Resend on already used token           | Do nothing or return error.                                                                                             |
| Revoke already used token              | Return error or ignore.                                                                                                 |
| Rate limit exceeded on accept          | Return `429 Too Many Requests`                                                                                          |
| Email sending fails (Resend error)     | Log error, return `EMAIL_SEND_FAILED` to admin; keep invitation pending. Provide manual retry button.                   |

---

## 7. Permissions Matrix

| Action                     | SUPER_ADMIN            | DIRECTOR | COORDINATOR | Others                         |
| -------------------------- | ---------------------- | -------- | ----------- | ------------------------------ |
| Create invitation          | ✅                     | ❌       | ❌          | ❌                             |
| Resend invitation          | ✅                     | ❌       | ❌          | ❌                             |
| Revoke invitation          | ✅                     | ❌       | ❌          | ❌                             |
| List invitations           | ✅                     | ❌       | ❌          | ❌                             |
| Accept invitation (public) | ✅ (anyone with token) | ✅       | ✅          | ✅ (but only with valid token) |

---

## 8. Mobile UX Requirements

- The `/accept-invite` page must be fully responsive with large touch targets.
- Password strength indicator (optional but recommended).
- Show expiration date of invitation clearly.
- After submission, clear feedback and redirect.
- SUPER_ADMIN panel must work on mobile: card‑based list, bottom sheets for actions.

---

## 9. Acceptance Criteria

- [ ] SUPER_ADMIN can send an invitation to an email address.
- [ ] The invited user receives an email with a unique link.
- [ ] The link leads to a mobile‑friendly page where the user can set a password.
- [ ] After submission, the user is created in Supabase Auth and the `users` table.
- [ ] The invitation token is marked as used and cannot be reused.
- [ ] Expired tokens (7 days) cannot be accepted.
- [ ] SUPER_ADMIN can resend an invitation (generates new token, new email).
- [ ] SUPER_ADMIN can revoke a pending invitation.
- [ ] No public sign‑up route exists.
- [ ] Rate limiting prevents brute force on token guessing.

---

## 10. Technical Notes

- Use `crypto.randomUUID()` for token generation.
- Store tokens in `invitations.token` (plain text, but access restricted via RLS).
- Email sending: use `resend.emails.send()` with React Email template.
- For local development, use a test Resend API key or a mailtrap-like service.
- After user accepts, automatically sign them in? MVP: redirect to login page (more secure, forces explicit login).
- Supabase Auth user should have `email_confirmed_at` set automatically? We can auto‑confirm because invitation already verified email ownership.

---

## 11. Dependencies

- Resend account & API key
- Supabase Auth enabled
- `invitations` table created (see database schema)

---

## 12. Definition of Done

- All acceptance criteria met.
- TypeScript compilation passes.
- Unit tests for invitation validation (token expiry, duplicate email).
- E2E test for full invitation flow (create → email → accept → login).
- Mobile layout tested on small and medium screens.
- Documentation updated (this spec, plus ADR for invitation‑only registration).

---

**Created:** 2026-05-28  
**Next:** Create `/flows/invitation-flow.md` and ADR.
