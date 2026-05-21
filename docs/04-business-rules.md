# `04-business-rules.md`

# Business Rules

# UMAF Social Platform

Version: 0.1
Status: Draft

---

# 1. Purpose

This document defines the official business rules for the UMAF Social Platform.

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

## 2.1 People-Centric Model

People exist independently from projects.

Projects create relationships between people.

A person may:

- participate in multiple projects
- have different roles in different projects
- remain in the system after a project ends

---

## 2.2 Transparency by Default

All operationally relevant actions should support:

- evidence uploads
- audit logs
- traceability
- historical visibility

Transparency is considered a core platform principle.

---

## 2.3 Mobile-First Operations

Operational workflows must be optimized for:

- mobile devices
- quick interactions
- field operations
- low technical complexity

---

## 2.4 Functional Simplicity

The system must prioritize:

- operational clarity
- low cognitive load
- minimal steps
- predictable workflows

Complexity should be avoided whenever possible.

---

# 3. Organization Rules

---

## 3.1 Organization Ownership

All entities belong to an organization.

Every major entity must contain:

- organization_id

---

## 3.2 Data Isolation

Organization data must remain isolated.

Users from one organization must never access:

- projects
- people
- files
- reports
- payments

from another organization.

---

# 4. User Rules

---

## 4.1 User vs Person

Users and people are different entities.

Definitions:

User:

- authenticated account
- platform access

Person:

- human record
- operational entity

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
```

Inactive or suspended users cannot access protected routes.

---

## 4.4 Role Assignment

Every user must have:

- one primary global role

Additional project-level permissions may exist.

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

# 6. Project Rules

---

## 6.1 Project Ownership

Every project belongs to:

- one organization
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

- visible on public portal

private:

- visible only internally

internal:

- restricted operational visibility

---

## 6.3 Project Status

Allowed project statuses:

```text
draft
active
completed
archived
```

---

## 6.4 Archived Projects

Archived projects:

- remain readable
- preserve historical data
- should not allow operational modifications

unless explicitly reactivated.

---

## 6.5 Project Participants

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

- one sponsor
- one project

Optional:

- one beneficiary

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

- on public project pages
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

---

## 12.2 Audit Integrity

Activity logs should not be editable by normal users.

---

# 13. Dynamic Fields Rules

---

## 13.1 Dynamic Field Purpose

Dynamic fields exist to:

- reduce rigid schema growth
- support project-specific requirements
- support future expansion

---

## 13.2 Dynamic Field Validation

Dynamic fields must support:

- required validation
- field type validation
- select option validation

---

## 13.3 Dynamic Field Safety

Dynamic fields must never bypass:

- permissions
- audit logs
- validation layers

---

# 14. Permission Rules

---

## 14.1 Principle of Least Privilege

Users should only access:

- data
- operations
- modules

required for their role.

---

## 14.2 Role Restrictions

Some operations should require elevated permissions.

Examples:

- deleting records
- managing roles
- financial adjustments
- visibility changes

---

## 14.3 Protected Operations

Critical operations must always validate:

- authentication
- authorization
- organization ownership

server-side.

---

# 15. Public Portal Rules

---

## 15.1 Public Visibility

Only entities marked as public may appear:

- on landing pages
- in public projects
- in transparency sections

---

## 15.2 Sensitive Data Protection

The public portal must never expose:

- internal notes
- private documents
- sensitive personal data
- internal financial details

---

# 16. Mobile UX Rules

---

## 16.1 Mobile Priority

All operational flows must be:

- touch-friendly
- fast
- simple
- readable on small screens

---

## 16.2 Form Complexity

Long forms should be avoided.

Preferred approaches:

- step-based forms
- grouped sections
- progressive disclosure

---

## 16.3 List Usability

Large desktop tables should be avoided on mobile.

Preferred:

- cards
- stacked layouts
- expandable rows

---

# 17. Data Integrity Rules

---

## 17.1 Required Timestamps

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

## 17.2 UUID Usage

Primary keys should use UUIDs.

---

## 17.3 Referential Integrity

Relationships must preserve consistency.

Deletion policies should avoid orphaned records.

---

# 18. Soft Delete Rules

---

## 18.1 Preferred Deletion Strategy

Soft deletes should be preferred over permanent deletion.

---

## 18.2 Permanent Deletion Restrictions

Permanent deletion should only be available:

- to elevated roles
- under explicit operational need

---

# 19. Reporting Rules

---

## 19.1 Historical Accuracy

Reports must preserve historical accuracy.

Changes to operational data should not silently alter:

- historical payments
- contribution history
- participant history

---

## 19.2 Public Metrics

Public metrics should prioritize:

- clarity
- transparency
- simplicity

---

# 20. Offline & Resilience Rules

---

## 20.1 Mobile Resilience

The platform should tolerate:

- intermittent connectivity
- slow mobile networks
- temporary offline conditions

whenever possible.

---

# 21. Security Rules

---

## 21.1 Server-Side Validation

Critical validations must never rely exclusively on frontend validation.

---

## 21.2 File Protection

Protected uploads must require:

- authentication
- permission checks
- ownership validation

---

## 21.3 Sensitive Operations

Sensitive operations must always generate:

- audit logs
- timestamps
- responsible user tracking

---

# 22. Future Expansion Rules

The architecture must remain compatible with future modules:

- donations
- inventory
- notifications
- sponsor portals
- volunteer management
- analytics
- event systems

without major rewrites.

---

# 23. Explicit Non-Goals

The initial business rules do NOT attempt to support:

- enterprise accounting
- hospital-grade medical systems
- legal document management
- advanced payroll
- complex ERP workflows

---

# 24. Current Status

Current phase:

- Business rules definition

Next phase:

- User roles & permissions definition
