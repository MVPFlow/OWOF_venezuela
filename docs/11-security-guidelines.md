# `11-security-guidelines.md`

# Security Guidelines

# OWOFVzla Social Platform

Version: 0.1
Status: Draft

---

# 1. Purpose

This document defines the official security guidelines for the OWOFVzla Social Platform.

The platform manages:

- personal information
- operational records
- financial contributions
- evidence uploads
- internal organizational data

Security is therefore considered a foundational requirement.

These guidelines apply to:

- frontend
- backend
- APIs
- database operations
- file uploads
- infrastructure
- dependencies
- AI-generated code

---

# 2. Security Philosophy

The platform prioritizes:

```text
Simple
Secure
Explicit
Auditable
Maintainable
```

Security decisions should favor:

- predictable behavior
- least privilege access
- explicit validation
- defense in depth

Avoid:

- hidden magic
- unsafe shortcuts
- unnecessary complexity

---

# 3. Core Security Principles

---

## 3.1 Least Privilege

Users should only access:

- data
- modules
- operations

required for their role.

**Invitation creation** is restricted to SUPER_ADMIN only.

---

## 3.2 Server-Side Enforcement

Critical security validation must ALWAYS happen server-side.

Frontend validation is not a security boundary.

---

## 3.3 Single Organization (MVP)

The MVP operates with a single organization (OWOFVzla). No cross-organization access exists.

---

## 3.4 Auditability

Sensitive operations must remain:

- traceable
- logged
- reviewable

---

# 4. Authentication Security

---

## 4.1 Authentication Provider

Official authentication provider:

```text
Supabase Auth
```

**Registration is invitation-only**. There is no public sign-up endpoint.

---

## 4.2 Protected Routes

Protected routes must validate:

- active session
- organization membership (implicitly OWOFVzla)
- permissions

before rendering sensitive data.

---

## 4.3 Session Validation

Sensitive operations should verify:

- authenticated session
- current permissions
- valid organization scope

server-side.

---

## 4.4 Password Security

Passwords must:

- never be stored manually
- never be logged
- never be exposed in responses

Authentication handling should remain delegated to Supabase Auth.

---

## 4.5 Invitation Token Security

Invitation tokens are critical security assets. They must be:

- **Cryptographically random** – use UUID v4 or secure random generator
- **Stored with unique constraint** – no two invitations share the same token
- **Single-use** – after acceptance, `used_at` is set and the token is invalidated
- **Time-limited** – expire after 7 days (configurable)
- **Validated server-side** – never trust client-side expiration checks

The `invitations` table must have indexes on `token` and `expires_at` for efficient validation.

**Never** expose tokens in URLs that are logged or sent to third parties.

---

## 4.6 Email Security (Resend)

When sending invitation emails via Resend:

- Use a **verified sending domain** (e.g., `invitations@owofvzla.org`)
- Never include the token in plain text in server logs
- Sanitize any user-generated content before inserting into email templates
- Include clear **expiration warning** and **security notice** (e.g., "If you didn't request this, ignore this email")
- Use **HTTPS-only links** pointing to `/accept-invite?token=...`

---

# 5. Authorization Security

---

## 5.1 Role Validation

All protected operations must validate:

- role permissions
- ownership
- organization scope

before execution.

**Invitation operations** (create, resend, revoke) must check `role = SUPER_ADMIN`.

---

## 5.2 Row-Level Security

Supabase RLS is mandatory.

RLS policies should enforce:

- organization ownership (only OWOFVzla data)
- resource ownership
- visibility rules
- role restrictions

For the `invitations` table, RLS must ensure that only SUPER_ADMIN can view, create, or delete invitations. The public `accept-invite` endpoint bypasses RLS but validates the token separately.

---

## 5.3 Person-User Relationship (Future)

The `people.user_id` field (nullable, 1:1) must be secured so that only the linked user or SUPER_ADMIN can modify it.

---

## 5.4 Frontend Restrictions

Frontend permission checks are only:

- UX helpers
- visibility helpers

They are NOT security enforcement.

---

# 6. API Security Standards

---

## 6.1 Input Validation

All API payloads must validate:

- schema shape
- field types
- required fields
- permissions
- business rules

using:

```text
Zod
```

---

## 6.2 Server Validation

Critical validation must NEVER rely only on frontend validation.

---

## 6.3 Forbidden API Patterns

The following are forbidden:

```text
raw SQL concatenation
unsafe eval execution
dynamic code execution
unvalidated payload persistence
```

---

## 6.4 Sensitive Error Exposure

APIs must never expose:

- stack traces
- SQL details
- internal infrastructure
- secrets
- environment variables

---

## 6.5 Invitation-Specific API Security

- `POST /api/invitations` – only SUPER_ADMIN; validate email format and role
- `POST /api/invitations/accept` – public endpoint; validate token existence, expiration, and unused status; do not leak why a token is invalid (generic error: "Invalid or expired invitation")
- `DELETE /api/invitations/[id]` – only SUPER_ADMIN
- `PATCH /api/invitations/[id]/resend` – only SUPER_ADMIN; regenerate token and send new email

---

# 7. Database Security

---

## 7.1 SQL Injection Prevention

All database access must use:

- ORM protections
- parameterized queries
- validated inputs

Never interpolate user input into raw SQL.

---

## 7.2 Direct SQL Usage

Raw SQL should remain rare.

If raw SQL becomes necessary:

- document justification
- validate inputs strictly
- review carefully

---

## 7.3 Data Isolation

Queries must always remain scoped to:

- organization ownership (only OWOFVzla)
- permissions
- visibility rules

---

## 7.4 Sensitive Data Protection

Sensitive fields should avoid unnecessary exposure.

Examples:

- internal notes
- financial details
- private documents
- `invitations.token` (though stored in plain text, access restricted by RLS)

---

# 8. File Upload Security

---

## 8.1 Upload Validation

All uploads must validate:

- mime type
- file extension
- file size
- authentication
- ownership
- permissions

---

## 8.2 Forbidden File Types

The following file types are forbidden:

```text
.exe
.bat
.cmd
.sh
.js
.php
```

and any executable or dangerous formats.

---

## 8.3 Upload Storage

Uploads should remain:

- isolated
- permission-controlled
- non-public by default

---

## 8.4 File Access Rules

Protected uploads must require:

- authentication
- ownership validation
- visibility validation

before access.

---

# 9. Frontend Security

---

## 9.1 Unsafe Rendering

The following is forbidden unless explicitly approved:

```text
dangerouslySetInnerHTML
```

---

## 9.2 XSS Prevention

User-generated content must:

- remain sanitized
- avoid unsafe rendering
- avoid HTML injection

---

## 9.3 Sensitive Data Exposure

Frontend code must never expose:

- secrets
- service keys
- private tokens
- internal credentials

---

# 10. Environment Security

---

## 10.1 Environment Variables

Sensitive credentials must only exist in:

- environment variables
- secure deployment configuration

Never hardcode secrets.

Required variables for invitations:

```env
RESEND_API_KEY=re_xxxxx
EMAIL_FROM=noreply@owofvzla.org
NEXT_PUBLIC_APP_URL=https://app.owofvzla.org
```

---

## 10.2 Client vs Server Variables

Only public-safe variables may use:

```text
NEXT_PUBLIC_
```

Sensitive secrets must remain server-only.

---

# 11. Dependency Security

---

## 11.1 Dependency Trust Policy

Do NOT install packages that:

- have known vulnerabilities
- appear abandoned
- have suspicious maintenance activity
- have unclear ownership
- introduce unnecessary risk

---

## 11.2 Dependency Review Requirement

When uncertainty exists:

- pause implementation
- request developer approval
- recommend deep package research

before adoption.

---

## 11.3 Minimize Dependencies

Prefer:

- native platform APIs
- lightweight utilities
- internal abstractions

before adding external dependencies.

---

# 12. Logging Security

---

## 12.1 Sensitive Logging Forbidden

Never log:

- passwords
- secrets
- access tokens
- private keys
- sensitive personal data
- **invitation tokens** (log only that an invitation was created, not the token itself)

---

## 12.2 Audit Logging

Critical operations should generate:

- audit logs
- timestamps
- responsible user tracking

Track invitation events: creation, resend, revocation, acceptance.

---

## 12.3 AI Development Logs

AI execution sessions should append entries to:

```text
/ops/dev-logs.md
```

without exposing secrets or credentials.

---

# 13. CI/CD Security

---

## 13.1 Lightweight CI Philosophy

GitHub Actions should remain lightweight initially.

Heavy pipelines may remain local until future architecture decisions expand CI/CD requirements.

---

## 13.2 Protected Branches

Protected branches:

```text
main
master
```

Direct commits are forbidden.

---

## 13.3 Branch Workflow

Development should occur through isolated branches:

```text
dev-[task]-[date]
ai-[task]-[date]
```

---

# 14. Infrastructure Security

---

## 14.1 Deployment Separation

Separate environments must exist:

```text
development
staging
production
```

---

## 14.2 Production Access

Production access should remain restricted to authorized maintainers only.

---

## 14.3 Principle of Minimal Exposure

Expose only infrastructure that is operationally necessary.

---

# 15. Public Portal Security

---

## 15.1 Public Visibility Rules

Only approved public content may appear:

- on landing pages
- **public project landing pages (`/proyectos/[slug]`)**
- transparency sections

---

## 15.2 Sensitive Data Protection

Public pages must NEVER expose:

- internal notes
- private uploads
- financial internals
- protected personal information
- invitation tokens or internal user data

Public project pages must filter data based on `visibility = 'public'` and only show approved notes, evidence, and participant summaries.

---

# 16. Rate Limiting & Abuse Prevention

---

## 16.1 Sensitive Endpoint Protection

Sensitive endpoints should support:

- rate limiting
- abuse detection
- throttling

when operationally necessary.

---

## 16.2 Upload Abuse Prevention

Uploads should support:

- file size limits
- upload throttling
- validation controls

---

## 16.3 Invitation Acceptance Rate Limiting

The public endpoint `/api/invitations/accept` should be rate-limited (e.g., 5 attempts per IP per hour) to prevent brute-force token guessing.

---

# 17. Security Incident Philosophy

---

## 17.1 Explicit Incident Handling

Security issues should NEVER remain hidden.

Critical vulnerabilities must:

- be reported
- be documented
- receive priority remediation

---

## 17.2 Temporary Mitigations

Temporary mitigations should:

- remain documented
- include follow-up tasks
- avoid silent risk acceptance

---

# 18. Security Anti-Patterns

Avoid:

- raw SQL interpolation
- unsafe HTML rendering
- secret exposure
- excessive permissions
- hidden security assumptions
- hardcoded credentials
- unvalidated uploads
- blind trust in frontend validation
- giant unsafe dependencies
- logging invitation tokens
- public registration endpoints

---

# 19. Long-Term Security Goals

Future versions may include:

- security scanning
- dependency auditing
- SAST tooling
- CSP policies
- advanced monitoring
- MFA
- intrusion detection

as the platform grows.

---

# 20. Current Status

Current phase:

- Security guidelines definition (updated for invitations, email, public project pages)

Next phase:

- Testing strategy definition
