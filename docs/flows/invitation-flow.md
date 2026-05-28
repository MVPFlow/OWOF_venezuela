# Invitation Flow

## OWOFVzla Social Platform

Version: 0.1
Status: Draft

---

## 1. Overview

This document describes the complete user flow for inviting new users (organizers, directors, accounting, etc.) to the platform. The flow is divided into two main parts:

1. **SUPER_ADMIN creates and sends an invitation**
2. **Invited user accepts the invitation and creates their account**

No public sign-up exists. All new users must be invited by a SUPER_ADMIN.

---

## 2. Actors

- **SUPER_ADMIN** – The user who creates invitations.
- **Invited User** – A person (not yet a user) who receives an email invitation.
- **System** – Handles token generation, email sending, validation, and account creation.

---

## 3. Preconditions

- The SUPER_ADMIN is authenticated and has role `SUPER_ADMIN`.
- The platform has a configured Resend API key and verified sending domain.
- The `invitations` table exists in the database.
- The invited email address does **not** already have an active user account.

---

## 4. Flow Diagram (Textual)

```
SUPER_ADMIN                    System                       Invited User
     |                           |                               |
     | 1. Open invite form       |                               |
     |-------------------------->|                               |
     |                           |                               |
     | 2. Enter email & role     |                               |
     |-------------------------->|                               |
     |                           |                               |
     |                           | 3. Generate token (UUID)      |
     |                           | 4. Store invitation (expires 7d)
     |                           | 5. Send email via Resend      |
     |                           |------------------------------>|
     |                           |                               |
     | 6. Receive success        |                               |
     |<--------------------------|                               |
     |                           |                               |
     |                           |                    7. Clicks link in email
     |                           |<------------------------------|
     |                           |                               |
     |                           |              8. GET /accept-invite?token=...
     |                           |                               |
     |                           | 9. Validate token (exists, not used, not expired)
     |                           | 10. Show form (password, name)
     |                           |------------------------------>|
     |                           |                               |
     |                           |                    11. Submits password & name
     |                           |<------------------------------|
     |                           |                               |
     |                           | 12. Create user in Supabase Auth
     |                           | 13. Insert into `users` table
     |                           | 14. Mark invitation as used
     |                           | 15. Redirect to login page
     |                           |------------------------------>|
     |                           |                               |
     |                           |                    16. Logs in with email/password
```

---

## 5. Detailed Steps

### Part A – SUPER_ADMIN Creates Invitation

#### Step A1: Navigate to invitation panel

- **URL:** `/admin/users/invite`
- **UI:** Mobile‑friendly form with email input, role dropdown, and submit button.

#### Step A2: Fill form

- **Email:** Must be a valid email format.
- **Role:** Select from `COORDINATOR`, `DIRECTOR`, `ACCOUNTING`, `VOLUNTEER`, `VIEWER`.
- **Optionally:** Add a personal note (future enhancement).

#### Step A3: Submit

- **Action:** Server action `inviteUser(email, role)`
- **Validations:**
  - Email not already an active user.
  - Email not already having a pending (unused, not expired) invitation (optional: allow resend).
- **On success:**
  - Generate token (`crypto.randomUUID()`).
  - Insert record into `invitations`:
    - `email`, `role`, `token`, `expires_at = now() + 7 days`, `created_by = current_user.id`, `used_at = NULL`
  - Send email using Resend.
  - Show toast: "Invitation sent to [email]".
- **On error:** Show inline error (e.g., "Email already registered", "Invalid role").

#### Step A4: (Optional) Resend or Revoke

- **List pending invitations:** `/admin/users/pending`
- **Resend:** Generate new token, reset expiration, send new email.
- **Revoke:** Delete or mark invitation as revoked (prevents acceptance).

---

### Part B – Invited User Accepts Invitation

#### Step B1: Receive email

- **From:** `noreply@owofvzla.org`
- **Subject:** "Invitation to join OWOFVzla Platform"
- **Body:**
  - "You have been invited as [role]."
  - Link: `https://app.owofvzla.org/accept-invite?token=<token>`
  - Expiration notice: "This link expires in 7 days."

#### Step B2: Click link

- **Browser opens** `/accept-invite?token=...`
- **System validates token** (server-side, but also basic client check):
  - Token exists in `invitations` table.
  - `used_at IS NULL`
  - `expires_at > now()`
- **If invalid:** Show error page with appropriate message:
  - "Invitation expired" → ask SUPER_ADMIN to resend.
  - "Already used" → inform user to log in.
  - "Not found" → generic error.

#### Step B3: Fill acceptance form

- **Fields:**
  - Full name (optional but recommended; stored in `auth.users.raw_user_meta_data` as `full_name`)
  - Password (min 8 characters, strength optional)
  - Confirm password
  - (Optional) Accept terms checkbox
- **Actions:** Cancel (redirect to home) or "Activate Account".

#### Step B4: Submit acceptance

- **Action:** Server action `acceptInvitation(token, password, name)`
- **Validations (again, server-side):**
  - Token valid (exists, not used, not expired)
  - Email from invitation does not already have an active user (race condition check)
  - Password meets requirements.
- **Process:**
  - Create user in Supabase Auth:
    - `email` = invitation.email
    - `password` = provided
    - `email_confirm` = true (auto‑confirm because invitation verified ownership)
    - `user_metadata` = { full_name: name }
  - Insert into `users` table (sync with auth user id):
    - `id` = auth user id
    - `organization_id` = fixed OWOFVzla ID
    - `email` = invitation.email
    - `role` = invitation.role
    - `status` = 'active'
    - `invited_by` = invitation.created_by
  - Update `invitations` set `used_at = now()`.
- **Response:** Redirect to `/login` with success message: "Account created! Please log in."

#### Step B5: Login

- User logs in with their email and the password they set.
- After login, they are redirected to the dashboard.

---

## 6. Edge Cases & Error Handling

| Case                                                                            | Handling                                                                                                                                                                                                     |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Email sending fails (Resend API error)                                          | Log error, keep invitation pending. Show error to SUPER_ADMIN: "Failed to send email. Please try again." Provide retry button.                                                                               |
| User tries to accept after expiration                                           | Show "Expired" page, disable form, provide button to request resend (which would email the SUPER_ADMIN or automatically resend? MVP: show message "Please ask your administrator to resend the invitation"). |
| User tries to accept with already used token                                    | Show "Invitation already used" page with link to login.                                                                                                                                                      |
| User tries to accept with same email but an active user exists (race condition) | Show error: "An account with this email already exists. Please log in instead."                                                                                                                              |
| SUPER_ADMIN revokes invitation after user already accepted                      | Nothing to do; user already active. Revocation only affects pending invitations.                                                                                                                             |
| Rate limiting on `/accept-invite` endpoint                                      | After 5 failed attempts per IP per hour, block for 1 hour.                                                                                                                                                   |

---

## 7. Mobile UX Considerations

- **Invitation form (SUPER_ADMIN):** Use native mobile inputs (`type="email"`, select dropdown). Buttons large enough for thumbs.
- **Pending invitations list:** Card layout (not table) with clear status badges and action icons.
- **Accept page:** Centered card with vertical stacking. Password field with toggle visibility. Show password strength indicator.
- **Success/error toasts:** Use bottom‑positioned toasts for easy thumb reach.

---

## 8. Testing Scenarios (Manual & Automated)

1. **Happy path:** SUPER_ADMIN invites → user receives email → accepts → logs in.
2. **Expired token:** Wait 7 days (or manually set `expires_at` to past) and attempt to accept.
3. **Used token:** Accept once, then try to use same token again.
4. **Resend:** SUPER_ADMIN resends invitation; old token invalidated, new token works.
5. **Revoke:** SUPER_ADMIN revokes pending invitation; token cannot be used.
6. **Duplicate email:** Try to invite an email that already has an active user → error.
7. **Rate limiting:** Make several requests with invalid tokens from same IP.

---

## 9. Related Documents

- [Spec: Invitations Module](../specs/invitations.spec.md)
- [ADR: Invitation‑Only Registration](../decisions/ADR-004-invitation-only-registration.md)
- [Database Schema: invitations table](../03-database-schema-v1.md#18-invitations)
- [API Standards: Invitation endpoints](../08-api-standards.md)

---

**Created:** 2026-05-28  
**Next:** Create ADR for invitation‑only registration (ADR-004).
