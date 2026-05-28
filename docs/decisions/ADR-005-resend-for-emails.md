# ADR-005: Resend for Email Delivery

## Status

**Accepted** (2026-05-28)

## Context

The platform requires email sending for:

- User invitations (unique tokens)
- Future: password reset, notifications, sponsor communications

We need a reliable, developer-friendly email service that integrates well with Next.js (server actions) and has a generous free tier for MVP.

## Decision

We will use **Resend** as the official email service provider.

### Reasons

- **Free tier:** 100 emails/day – sufficient for MVP (inviting users, basic notifications).
- **Developer experience:** Native React Email support, easy API, works with Next.js server actions.
- **Reliability:** High deliverability, dedicated IPs on paid plans, but free tier uses shared IPs (acceptable for MVP).
- **Simple setup:** No complex SMTP configuration; just an API key.
- **Analytics:** Provides open/click tracking (optional but helpful).

### Alternatives Considered

| Service                   | Pros                     | Cons                                                               | Verdict            |
| ------------------------- | ------------------------ | ------------------------------------------------------------------ | ------------------ |
| AWS SES                   | Very cheap, scalable     | Complex setup, requires domain verification, no built‑in templates | Overkill for MVP   |
| SendGrid                  | Free tier (100/day)      | Lower deliverability, more complex API                             | Resend is simpler  |
| Nodemailer + SMTP (Gmail) | Free                     | Rate limits, poor deliverability, not production‑ready             | Not suitable       |
| Postmark                  | Excellent deliverability | No free tier, paid from day 1                                      | Too costly for MVP |

## Consequences

### Positive

- Easy integration: `resend.emails.send()` from server action.
- React Email components for beautiful, type‑safe templates.
- Free tier covers MVP usage (100 emails/day → ~3,000/month, enough for dozens of invitations).
- Upgrade path: paid plan ($20/month for 50k emails) if needed.

### Negative

- Vendor lock-in (but email service can be swapped later).
- Free tier limited to 100 emails/day – if exceeded, emails will fail. We will monitor and warn.
- Requires verified domain (e.g., `owofvzla.org`) to avoid spam flags.

### Mitigations

- Implement error handling and logging for failed sends.
- Provide manual retry button for invitations.
- Monitor daily usage via Resend dashboard.
- Have fallback plan (send via console log in development, or use a secondary provider).

## Implementation Notes

- Environment variables:
  - `RESEND_API_KEY` (secret, from Resend dashboard)
  - `EMAIL_FROM` (verified domain, e.g., `noreply@owofvzla.org`)
- Email templates: use `react-email` components, store in `/emails/` folder.
- Example: `invitation-email.tsx` using `Tailwind` and `Button`.
- Sending: within server action `inviteUser`, call `resend.emails.send()`.

## Related

- [ADR-004: Invitation-Only Registration](./ADR-004-invitation-only-registration.md)
- [Spec: Invitations Module](../specs/invitations.spec.md)
- [Tech Stack: Email Service](../02-tech-stack.md#113-email-service)

---

**Champion:** Saturno Mangieri  
**Date:** 2026-05-28
