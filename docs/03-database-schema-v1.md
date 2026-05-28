# Database Schema V1

# OWOFVzla Social Platform

Version: 0.1
Status: Draft

---

# 1. Database Philosophy

The database architecture follows a hybrid approach:

- relational core entities
- flexible metadata support
- dynamic/custom field extensibility

The goal is to provide:

- scalability
- flexibility
- maintainability
- traceability

without requiring constant schema redesigns.

---

# 2. Core Design Principles

---

## 2.1 People-Centric Architecture

People exist independently from projects.

Projects create contextual relationships between people.

People may optionally have a linked user account (1:1) for future sponsor/donor portals.

---

## 2.2 Modular Project Structure

Projects are generic containers capable of representing:

- scholarship programs
- medical campaigns
- food distribution programs
- future humanitarian initiatives

---

## 2.3 Dynamic Data Support

The schema must support:

- custom fields
- project-specific metadata
- evolving operational requirements

without requiring frequent migrations.

---

## 2.4 Transparency by Design

Critical operations must support:

- evidence attachments
- activity tracking
- audit logs
- traceability

---

# 3. Database Engine

```text
Database Engine: PostgreSQL
ORM: Drizzle ORM
Backend Platform: Supabase
```

---

# 4. Core Entity Overview

```text
Organization (single: OWOFVzla)
    │
    ├── Users
    │     └── Invitations (created by SUPER_ADMIN)
    │
    ├── People (optional user_id → users)
    │
    ├── Projects
    │       │
    │       ├── Project Participants
    │       ├── Contributions
    │       ├── Payments
    │       ├── Notes
    │       ├── Attachments
    │       └── Activity Logs
    │
    └── Dynamic Field System
```

---

# 5. organizations

Represents a foundation or organization.

The **MVP uses a single pre-seeded organization**:

- Name: "One World One Family Venezuela"
- Slug: `owofvzla`
- Created via seed migration, no UI for creation.

The schema remains future-ready for multi-organization support.

## Fields

```text
id
name
slug
description
logo_url
country
status
created_at
updated_at
```

---

# 6. users

Represents authenticated system users.

**Users are NOT the same as people** (but a person may later link to a user).

## Fields

```text
id
organization_id
email
password_hash
role
status
last_login_at
invited_by         -- UUID references users(id) (who invited this user)
created_at
updated_at
```

## Notes

- Users control system access.
- Authentication handled by Supabase Auth.
- Roles determine permissions.
- `invited_by` is set when a user is created via invitation (by SUPER_ADMIN).
- The first SUPER_ADMIN (Saturno) is seeded with `invited_by = null`.

---

# 7. people

Master entity for all human records (beneficiaries, sponsors, volunteers, students, etc.).

## Fields

```text
id
organization_id
user_id              -- optional, 1:1 reference to users (for future person accounts)
first_name
last_name
document_id
birth_date
phone
email
gender
address
city
state
country
photo_url
status
notes
metadata_json
created_at
updated_at
```

## Important Notes

- People exist independently from projects.
- `user_id` is nullable. When present, the person can log in (future feature).
- This enables sponsor/donor portals where a person sees their own contributions.
- For MVP, `user_id` remains NULL; it will be used in later phases.

---

# 8. person_tags

Flexible tagging system for people.

## Examples

```text
student
sponsor
volunteer
doctor
beneficiary
```

## Fields

```text
id
organization_id
name
slug
created_at
```

---

# 9. people_tags_relations

Many-to-many relationship.

## Fields

```text
person_id
tag_id
```

---

# 10. project_types

Defines configurable project categories.

## Examples

```text
scholarship
medical
food
emergency
```

## Fields

```text
id
organization_id
name
slug
description
config_json
created_at
```

---

# 11. projects

Represents social initiatives.

## Fields

```text
id
organization_id
project_type_id
title
slug
description
status
visibility
start_date
end_date
cover_image_url
created_by          -- references users(id)
created_at
updated_at
```

## Visibility Types

```text
public     -- visible on public project landing page
private    -- only internal users
internal   -- restricted operational visibility
```

## Status Types

```text
draft
active
completed
archived
```

---

# 12. project_participants

Relationship between people and projects.

## Examples

```text
Maria → student
Jose → sponsor
Ana → volunteer
```

## Fields

```text
id
project_id
person_id
role
status
joined_at
left_at
notes
created_at
```

## Important Notes

- The same person may belong to multiple projects with different roles.

---

# 13. contributions

Represents sponsorship or contribution agreements.

## Fields

```text
id
organization_id
project_id
sponsor_person_id
beneficiary_person_id
amount
currency
frequency
status
start_date
end_date
notes
created_at
updated_at
```

## Frequency Types

```text
one_time
weekly
monthly
quarterly
yearly
```

---

# 14. payments

Tracks actual financial payments.

## Fields

```text
id
contribution_id
amount
currency
payment_method
reference_number
payment_date
receipt_attachment_id   -- references attachments(id)
notes
created_by              -- references users(id)
created_at
```

---

# 15. attachments

Centralized file/evidence system.

## Supported Files

- images
- receipts
- PDFs
- evidence photos
- reports

## Fields

```text
id
organization_id
entity_type            -- e.g., 'person', 'project', 'payment'
entity_id              -- UUID of the related entity
file_url
file_name
mime_type
file_size
category
uploaded_by            -- references users(id)
created_at
```

## Attachment Categories

```text
receipt
transfer
student_photo
report
invoice
evidence
medical_document
```

---

# 16. notes

Reusable notes system.

Supports:

- internal notes
- public notes
- operational comments

## Fields

```text
id
organization_id
entity_type
entity_id
visibility
content
created_by             -- references users(id)
created_at
updated_at
```

## Visibility Types

```text
private
internal
public
```

---

# 17. activity_logs

Audit and traceability system.

## Fields

```text
id
organization_id
user_id
action
entity_type
entity_id
changes_json
ip_address
created_at
```

## Important Notes

Critical operations should generate activity logs automatically.

---

# 18. invitations

Manages user invitations (only SUPER_ADMIN can create).

## Fields

```text
id
organization_id
email
role                     -- role to assign when accepted
token                    -- unique one-time token
expires_at               -- default 7 days from creation
created_by               -- references users(id) (SUPER_ADMIN)
used_at                  -- null until accepted
created_at
```

## Notes

- When a user accepts the invitation, they are inserted into `users` with `status='active'`, and `used_at` is set.
- The token is single-use and expires after `expires_at`.

---

# 19. custom_field_definitions

Dynamic field definitions.

Allows project-specific configurable fields.

## Fields

```text
id
organization_id
project_type_id
field_name
field_slug
field_type
required
config_json
created_at
```

## Field Types

```text
text
textarea
number
date
boolean
select
multiselect
file
```

---

# 20. custom_field_values

Stores dynamic/custom field values.

## Fields

```text
id
field_definition_id
entity_type
entity_id
value_json
created_at
updated_at
```

---

# 21. Relationship Summary

```text
organizations (single: OWOFVzla)
    ├── users
    ├── invitations
    ├── people
    ├── projects
    ├── project_types
    ├── attachments
    └── activity_logs

people
    ├── project_participants
    ├── contributions (as sponsor or beneficiary)
    ├── people_tags_relations
    └── (optional) user account via user_id

projects
    ├── project_participants
    ├── contributions
    ├── notes
    ├── attachments
    └── activity_logs

invitations
    └── created_by → users (SUPER_ADMIN)
```

---

# 22. Soft Delete Strategy

Most entities should support soft deletes using:

```text
deleted_at
```

instead of permanent deletion.

---

# 23. Timestamp Standards

All major entities should include:

```text
created_at
updated_at
```

Optional:

```text
deleted_at
```

---

# 24. UUID Strategy

All primary IDs should use:

```text
UUID
```

instead of incremental integers.

---

# 25. Security Considerations

Sensitive entities must support:

- row-level security
- ownership validation
- permission-based filtering
- protected uploads
- invitation token security (one-time, expiring)

---

# 26. Future Expansion Support

The schema is intentionally designed to support future modules:

- online donations
- sponsor portals (using people→user relationship)
- medical records
- inventory systems
- event management
- analytics
- notifications

without major structural rewrites.

---

# 27. Database Non-Goals (V1)

The initial schema will NOT include:

- complex accounting
- inventory systems
- advanced medical records
- payment gateway integrations
- messaging systems
- multi-currency accounting logic

These may be added later.

---

# 28. Current Status

Current phase:

- Database schema definition (includes invitations and people-user relationship)

Next phase:

- Business rules definition

---

# 29. Seed Requirements (MVP)

The following seed data must be present after initial migration:

1. **Organization**: `OWOFVzla` (id: fixed UUID, slug: `owofvzla`).
2. **SUPER_ADMIN user**: Saturno Mangieri (email, hashed password, role `SUPER_ADMIN`, status `active`, invited_by = null).
3. **Basic project types**: scholarship, medical, food (optional).
