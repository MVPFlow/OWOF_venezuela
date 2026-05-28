# `04-business-rules.md`

# Business Rules

# OWOFVzla Social Platform

Version: 0.1
Status: Draft

---

# 1. Purpose

This document defines the official business rules for the OWOFVzla Social Platform.

Business rules define:

- operational constraints
- validation logic
- platform behavior
- data consistency rules
- workflow expectations

These rules must be respected across:

- frontend
- backend
- database
- APIs
- validations
- reports

---

# 2. Core Business Principles

---

## 2.1 Single Organization Model (MVP)

The MVP operates with a single pre-seeded organization: **One World One Family Venezuela** (slug: `owofvzla`). No organization creation UI is provided. All data belongs to this organization. The schema remains future-ready for multi-organization scenarios.

---

## 2.2 People-Centric Model

People exist independently from projects.

Projects create relationships between people.

A person may:

- participate in multiple projects
- have different roles in different projects
- remain in the system after a project ends
- optionally have a linked user account (future sponsor/donor portal)

---

## 2.3 Transparency by Default

All operationally relevant actions should support:

- evidence uploads
- audit logs
- traceability
- historical visibility
- public project landing pages (where visibility allows)

Transparency is considered a core platform principle.

---

## 2.4 Mobile-First Operations

Operational workflows must be optimized for:

- mobile devices
- quick interactions
- field operations
- low technical complexity

---

## 2.5 Functional Simplicity

The system must prioritize:

- operational clarity
- low cognitive load
- minimal steps
- predictable workflows

Complexity should be avoided whenever possible.

---

# 3. Organization Rules

---

## 3.1 Single Organization

The platform uses exactly one organization: OWOFVzla. This organization is created via seed migration and cannot be created or deleted through the UI.

---

## 3.2 Organization Ownership

All entities belong to this organization.

Every major entity must contain:

- organization_id

---

## 3.3 Data Isolation (Future)

If multi-organization support is added later, data must remain isolated. For MVP, isolation is trivial because only one organization exists.

---

# 4. User Rules

---

## 4.1 User vs Person

Users and people are different entities.

Definitions:

User:

- authenticated account
- platform access
- invited by SUPER_ADMIN (no public registration)

Person:

- human record
- operational entity
- may optionally link to a user account via `user_id` (future)

A person may exist without a user account.

---

## 4.2 User Access

Only authenticated users may access:

- private dashboard
- internal operations
- restricted data

---

## 4.3 User Status

Allowed user statuses:

```text
active
inactive
suspended
invited (temporary, before account activation)
```

Inactive, suspended, or invited users cannot access protected routes.

---

## 4.4 Role Assignment

Every user must have:

- one primary global role

Additional project-level permissions may exist.

---

## 4.5 Invitation-Only Registration

There is no public sign-up. All new users (COORDINATOR, DIRECTOR, ACCOUNTING, etc.) must be invited by a SUPER_ADMIN.

Invitation flow:

1. SUPER_ADMIN creates invitation (email, role).
2. System generates a unique one-time token and stores it in `invitations` table.
3. Resend sends an email with an acceptance link.
4. User clicks link, sets password, activates account.
5. Token is marked as used and expires after 7 days.

---

# 5. People Rules

---

## 5.1 Person Uniqueness

A person should not be duplicated unnecessarily.

Duplicate detection should consider:

- document_id
- full name
- phone
- email

---

## 5.2 Optional Information

The system must allow incomplete records when necessary.

Examples:

- no email
- no phone
- incomplete address

because field operations may happen under limited conditions.

---

## 5.3 Soft Delete Policy

People should not be permanently deleted by default.

Use:

- soft deletes
- archived states

instead.

---

## 5.4 Person Lifecycle

A person may:

- become inactive
- change roles
- join multiple projects
- return to active participation later

Historical relationships must be preserved.

---

## 5.5 Optional User Account Link

A person may have a `user_id` (nullable, 1:1 relationship with `users`). This is reserved for future features (e.g., sponsor portal where a person logs in and views their contributions). During MVP, `user_id` remains NULL.

---

# 6. Project Rules

---

## 6.1 Project Ownership

Every project belongs to:

- the single organization
- one project type

---

## 6.2 Project Visibility

Allowed visibility types:

```text
public
private
internal
```

Definitions:

public:

- visible on public project landing page (`/proyectos/[slug]`)
- searchable by search engines

private:

- visible only internally (dashboard users)

internal:

- restricted operational visibility (e.g., sensitive projects)

---

## 6.3 Public Project Landing Pages

Every project with `visibility = 'public'` MUST have a publicly accessible landing page at `/proyectos/[slug]` displaying:

- title, description, cover image
- status and timeline
- public notes and evidence (with `visibility = 'public'`)
- participant summaries (without sensitive data)
- future: fundraising goals, donation buttons

These pages are server-rendered for SEO and do not require authentication.

---

## 6.4 Project Status

Allowed project statuses:

```text
draft
active
completed
archived
```

---

## 6.5 Archived Projects

Archived projects:

- remain readable
- preserve historical data
- should not allow operational modifications

unless explicitly reactivated.

---

## 6.6 Project Participants

Projects may contain:

- beneficiaries
- volunteers
- sponsors
- coordinators
- doctors
- students

using flexible participant roles.

---

# 7. Project Participant Rules

---

## 7.1 Multiple Roles

A person may have:

- different roles across projects

Examples:

```text
Jose:
- sponsor in Project A
- volunteer in Project B
```

---

## 7.2 Participant Status

Participant statuses may include:

```text
active
inactive
removed
completed
```

---

## 7.3 Historical Preservation

Removing a participant from a project must preserve:

- historical participation
- contributions
- payments
- evidence records

---

# 8. Contribution Rules

---

## 8.1 Contribution Ownership

A contribution must belong to:

- one sponsor (person)
- one project

Optional:

- one beneficiary (person)

---

## 8.2 Contribution Frequencies

Allowed frequencies:

```text
one_time
weekly
monthly
quarterly
yearly
```

---

## 8.3 Contribution Status

Allowed statuses:

```text
pending
active
paused
completed
cancelled
```

---

## 8.4 Historical Integrity

Financial records must never be silently deleted.

Changes should preserve:

- timestamps
- responsible users
- historical states

---

# 9. Payment Rules

---

## 9.1 Payment Association

Every payment must belong to:

- one contribution

---

## 9.2 Payment Evidence

Payments should support:

- receipts
- transfer references
- uploaded evidence

---

## 9.3 Payment Validation

Payments should validate:

- positive amount
- valid date
- existing contribution

---

## 9.4 Immutable Financial History

Confirmed payments should not be permanently deleted.

Corrections should occur through:

- adjustments
- reversals
- status changes

not destructive deletion.

---

# 10. Attachment Rules

---

## 10.1 Attachment Ownership

Attachments belong to:

- an entity type
- an entity ID

Examples:

- person
- project
- payment
- contribution

---

## 10.2 Allowed File Types

Initially allowed:

```text
images
pdf
documents
```

Executable files must never be allowed.

---

## 10.3 File Security

Uploads must:

- validate mime type
- validate size
- validate ownership
- validate permissions

---

## 10.4 Mobile Upload Priority

Uploads must support:

- camera usage
- mobile uploads
- unstable networks

---

# 11. Notes Rules

---

## 11.1 Notes Visibility

Allowed visibility levels:

```text
private
internal
public
```

---

## 11.2 Public Notes

Public notes may appear:

- on public project landing pages
- in transparency sections
- in impact timelines

---

## 11.3 Internal Notes

Internal notes must never be publicly exposed.

---

# 12. Activity Log Rules

---

## 12.1 Required Logging

Critical operations should generate activity logs automatically.

Tracked actions include:

- create
- update
- delete
- role changes
- payment operations
- uploads
- invitation creation and acceptance

---

## 12.2 Audit Integrity

Activity logs should not be editable by normal users.

---

# 13. Invitation Rules

---

## 13.1 Who Can Invite

Only users with role `SUPER_ADMIN` can create invitations. This restriction may be relaxed in the future (e.g., DIRECTOR can invite).

---

## 13.2 Invitation Expiration

Invitations expire after 7 days (configurable). Expired tokens cannot be used. The system should clean up expired invitations periodically or ignore them in validation.

---

## 13.3 One-Time Tokens

Each invitation token is unique and can be used only once. After acceptance or expiration, the token is invalid.

---

## 13.4 Email Delivery

Invitations are sent via Resend (free tier). If email delivery fails, the SUPER_ADMIN is notified and can resend.

---

# 14. Dynamic Fields Rules

---

## 14.1 Dynamic Field Purpose

Dynamic fields exist to:

- reduce rigid schema growth
- support project-specific requirements
- support future expansion

---

## 14.2 Dynamic Field Validation

Dynamic fields must support:

- required validation
- field type validation
- select option validation

---

## 14.3 Dynamic Field Safety

Dynamic fields must never bypass:

- permissions
- audit logs
- validation layers

---

# 15. Permission Rules

---

## 15.1 Principle of Least Privilege

Users should only access:

- data
- operations
- modules

required for their role.

---

## 15.2 Role Restrictions

Some operations should require elevated permissions.

Examples:

- deleting records
- managing roles
- financial adjustments
- visibility changes
- creating invitations (SUPER_ADMIN only)

---

## 15.3 Protected Operations

Critical operations must always validate:

- authentication
- authorization
- organization ownership

server-side.

---

# 16. Public Portal Rules

---

## 16.1 Public Visibility

Only entities marked as public may appear:

- on landing pages
- in public project pages
- in transparency sections

---

## 16.2 Sensitive Data Protection

The public portal must never expose:

- internal notes
- private documents
- sensitive personal data
- internal financial details

---

# 17. Mobile UX Rules

---

## 17.1 Mobile Priority

All operational flows must be:

- touch-friendly
- fast
- simple
- readable on small screens

---

## 17.2 Form Complexity

Long forms should be avoided.

Preferred approaches:

- step-based forms
- grouped sections
- progressive disclosure

---

## 17.3 List Usability

Large desktop tables should be avoided on mobile.

Preferred:

- cards
- stacked layouts
- expandable rows

---

# 18. Data Integrity Rules

---

## 18.1 Required Timestamps

Major entities must include:

```text
created_at
updated_at
```

Optional:

```text
deleted_at
```

---

## 18.2 UUID Usage

Primary keys should use UUIDs.

---

## 18.3 Referential Integrity

Relationships must preserve consistency.

Deletion policies should avoid orphaned records.

---

# 19. Soft Delete Rules

---

## 19.1 Preferred Deletion Strategy

Soft deletes should be preferred over permanent deletion.

---

## 19.2 Permanent Deletion Restrictions

Permanent deletion should only be available:

- to elevated roles
- under explicit operational need

---

# 20. Reporting Rules

---

## 20.1 Historical Accuracy

Reports must preserve historical accuracy.

Changes to operational data should not silently alter:

- historical payments
- contribution history
- participant history

---

## 20.2 Public Metrics

Public metrics should prioritize:

- clarity
- transparency
- simplicity

---

# 21. Offline & Resilience Rules

---

## 21.1 Mobile Resilience

The platform should tolerate:

- intermittent connectivity
- slow mobile networks
- temporary offline conditions

whenever possible.

---

# 22. Security Rules

---

## 22.1 Server-Side Validation

Critical validations must never rely exclusively on frontend validation.

---

## 22.2 File Protection

Protected uploads must require:

- authentication
- permission checks
- ownership validation

---

## 22.3 Sensitive Operations

Sensitive operations must always generate:

- audit logs
- timestamps
- responsible user tracking

---

## 22.4 Invitation Token Security

Invitation tokens must be:

- cryptographically random
- stored hashed or as plain UUID (with proper DB constraints)
- expired after 7 days
- invalidated after use

---

# 23. Future Expansion Rules

The architecture must remain compatible with future modules:

- donations
- inventory
- notifications
- sponsor portals (using people→user link)
- volunteer management
- analytics
- event systems

without major rewrites.

---

# 24. Explicit Non-Goals

The initial business rules do NOT attempt to support:

- enterprise accounting
- hospital-grade medical systems
- legal document management
- advanced payroll
- complex ERP workflows

---

# 25. Current Status

Current phase:

- Business rules definition (updated for invitations, public landing pages, single org)

Next phase:

- User roles & permissions definition (add invitation permissions)
