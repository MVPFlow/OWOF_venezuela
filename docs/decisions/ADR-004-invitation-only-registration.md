# ADR-004: Invitation-Only User Registration

## Status

**Accepted** (2026-05-28)

## Context

The OWOFVzla platform is designed for internal team members (organizers, directors, accounting, etc.) and does **not** offer public sign-up. Allowing open registration would:

- Allow unauthorized access attempts.
- Create unused or spam accounts.
- Dilute the audit trail and accountability.
- Complicate role and organization management.

However, we need a way to onboard new members (e.g., when a new coordinator joins the foundation) without manual database intervention. The solution must be secure, auditable, and easy for a SUPER_ADMIN to use.

## Decision

We will implement an **invitation-only registration system** with the following characteristics:

1. **Only SUPER_ADMIN** can create, resend, or revoke invitations.
2. Each invitation is a unique, one‑time, time‑limited token (UUID v4) stored in an `invitations` table.
3. Invitations expire after **7 days** (configurable).
4. The invitation email is sent via **Resend** and contains a link to `/accept-invite?token=...`.
5. The public acceptance page validates the token server-side and allows the user to set a password and (optionally) a display name.
6. Upon successful acceptance:
   - A user is created in Supabase Auth.
   - A record is inserted into the `users` table with the role from the invitation.
   - The invitation is marked as `used_at`.
7. No public registration endpoint (`/register`, `/signup`) exists.
8. The acceptance endpoint is rate‑limited to prevent brute‑force token guessing.

## Consequences

### Positive

- **Security:** Prevents unauthorized account creation.
- **Auditability:** Every user is linked to the SUPER_ADMIN who invited them (`invited_by`).
- **Simplicity:** No need for email verification flows separate from invitation.
- **Control:** SUPER_ADMIN can revoke pending invitations if a person leaves before activating.
- **Future‑proof:** Can be extended to allow DIRECTOR role to invite users if needed.

### Negative

- **Onboarding friction:** New users cannot join without contacting a SUPER_ADMIN.
- **Operational overhead:** SUPER_ADMIN must manually invite each new user (acceptable for small team).
- **Email dependency:** Relies on Resend API (free tier 100 emails/day – sufficient for MVP).

### Risks & Mitigations

- **Token leakage:** Tokens are sent via email (inherent risk). Mitigation: short expiration (7 days), rate limiting, and logging of acceptance attempts.
- **Email deliverability:** Resend is reliable, but we will log failures and allow resend from admin panel.
- **Spam invitations:** Only SUPER_ADMIN can send; limit is manual.

## Alternatives Considered

1. **Public registration with email verification**
   - Rejected because it would require additional moderation and does not fit the “internal team only” nature.

2. **Self‑service with approval workflow**
   - More complex; not needed for MVP.

3. **Manual user creation by super-admin in database**
   - Not scalable and error‑prone; no audit trail of who invited whom.

## Implementation Notes

- Token generation: `crypto.randomUUID()` (Node.js crypto).
- Table `invitations` includes: `id`, `organization_id`, `email`, `role`, `token`, `expires_at`, `created_by`, `used_at`.
- Email template stored as React component; sends via Resend SDK.
- Rate limiting: use `upstash/ratelimit` or simple in‑memory for MVP.

## Related

- [Spec: Invitations Module](../specs/invitations.spec.md)
- [Flow: Invitation Flow](../flows/invitation-flow.md)
- [Database Schema: invitations table](../03-database-schema-v1.md#18-invitations)

---

**Champion:** Saturno Mangieri  
**Date:** 2026-05-28
