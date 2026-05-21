Perfecto.
Ahora sí vamos al documento que probablemente será el MÁS importante técnicamente para todo el proyecto:

# `04-database-schema-v1.md`

Este documento será:

- la base de TODO el backend
- la referencia para Drizzle ORM
- la referencia para Supabase
- la fuente principal para Codex
- la base de APIs, forms y validaciones

Y aquí es donde debemos ser extremadamente estratégicos para:

- evitar rigidez
- evitar sobreingeniería
- mantener flexibilidad

---

# Objetivo del documento

Este documento NO es:

- migraciones SQL
- código ORM final

Es:

# el diseño conceptual + estructural oficial de la BD v1.

---

# PROPUESTA

# `04-database-schema-v1.md`

````md id="4lkh6f"
# Database Schema V1

# UMAF Social Platform

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

```text id="n3zq8l"
Database Engine: PostgreSQL
ORM: Drizzle ORM
Backend Platform: Supabase
```
````

---

# 4. Core Entity Overview

```text
Organization
    │
    ├── Users
    │
    ├── People
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

Future-ready for multi-organization support.

---

## Fields

```text id="d0vov9"
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

Users are NOT the same as people.

---

## Fields

```text id="3h9b0y"
id
organization_id
email
password_hash
role
status
last_login_at
created_at
updated_at
```

---

## Notes

- Users control system access
- Authentication handled by Supabase Auth
- Roles determine permissions

---

# 7. people

Master entity for all human records.

Represents:

- students
- sponsors
- volunteers
- doctors
- beneficiaries
- coordinators

---

## Fields

```text id="p0snvx"
id
organization_id
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

---

## Important Notes

People should:

- exist independently from projects
- support multiple project relationships
- support flexible metadata

---

# 8. person_tags

Flexible tagging system for people.

---

## Examples

```text id="ynj9fj"
student
sponsor
volunteer
doctor
beneficiary
```

---

## Fields

```text id="0yjlwm"
id
organization_id
name
slug
created_at
```

---

# 9. people_tags_relations

Many-to-many relationship.

---

## Fields

```text id="iwhl5p"
person_id
tag_id
```

---

# 10. project_types

Defines configurable project categories.

---

## Examples

```text id="kw8bg9"
scholarship
medical
food
emergency
```

---

## Fields

```text id="p98jkn"
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

---

## Fields

```text id="mr8avk"
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
created_by
created_at
updated_at
```

---

## Visibility Types

```text id="q41zzm"
public
private
internal
```

---

## Status Types

```text id="88glbl"
draft
active
completed
archived
```

---

# 12. project_participants

Relationship between people and projects.

Core relational entity.

---

## Examples

```text id="3uy2m8"
Maria → student
Jose → sponsor
Ana → volunteer
```

---

## Fields

```text id="4u9fsc"
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

---

## Important Notes

The same person may:

- belong to multiple projects
- have different roles per project

---

# 13. contributions

Represents sponsorship or contribution agreements.

---

## Fields

```text id="8wq3q7"
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

---

## Frequency Types

```text id="w1gqaw"
one_time
weekly
monthly
quarterly
yearly
```

---

# 14. payments

Tracks actual financial payments.

---

## Fields

```text id="yq6f8j"
id
contribution_id
amount
currency
payment_method
reference_number
payment_date
receipt_attachment_id
notes
created_by
created_at
```

---

# 15. attachments

Centralized file/evidence system.

---

## Supported Files

- images
- receipts
- PDFs
- evidence photos
- reports

---

## Fields

```text id="i12mg9"
id
organization_id
entity_type
entity_id
file_url
file_name
mime_type
file_size
category
uploaded_by
created_at
```

---

## Attachment Categories

```text id="uq6g3l"
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

---

## Fields

```text id="yjibga"
id
organization_id
entity_type
entity_id
visibility
content
created_by
created_at
updated_at
```

---

## Visibility Types

```text id="7v9ukn"
private
internal
public
```

---

# 17. activity_logs

Audit and traceability system.

---

## Fields

```text id="q42j0m"
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

---

## Important Notes

Critical operations should generate activity logs automatically.

---

# 18. custom_field_definitions

Dynamic field definitions.

Allows project-specific configurable fields.

---

## Fields

```text id="nyb7cc"
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

---

## Field Types

```text id="cjlwmh"
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

# 19. custom_field_values

Stores dynamic/custom field values.

---

## Fields

```text id="wq7tvx"
id
field_definition_id
entity_type
entity_id
value_json
created_at
updated_at
```

---

# 20. Relationship Summary

```text
organizations
    ├── users
    ├── people
    ├── projects
    ├── project_types
    ├── attachments
    └── activity_logs

people
    ├── project_participants
    ├── contributions
    └── people_tags_relations

projects
    ├── project_participants
    ├── contributions
    ├── notes
    ├── attachments
    └── activity_logs
```

---

# 21. Soft Delete Strategy

Most entities should support soft deletes using:

```text id="4c4d9d"
deleted_at
```

instead of permanent deletion.

---

# 22. Timestamp Standards

All major entities should include:

```text id="mjlwm6"
created_at
updated_at
```

Optional:

```text id="5lqqaj"
deleted_at
```

---

# 23. UUID Strategy

All primary IDs should use:

```text id="nj7qg8"
UUID
```

instead of incremental integers.

---

# 24. Security Considerations

Sensitive entities must support:

- row-level security
- ownership validation
- permission-based filtering
- protected uploads

---

# 25. Future Expansion Support

The schema is intentionally designed to support future modules:

- online donations
- sponsor portals
- medical records
- inventory systems
- event management
- analytics
- notifications

without major structural rewrites.

---

# 26. Database Non-Goals (V1)

The initial schema will NOT include:

- complex accounting
- inventory systems
- advanced medical records
- payment gateway integrations
- messaging systems
- multi-currency accounting logic

These may be added later.

---

# 27. Current Status

Current phase:

- Database architecture definition

Next phase:

- Business rules definition

```

---

# IMPORTANTE

Este documento ya:
- sirve para Codex
- sirve para Drizzle
- sirve para Supabase
- sirve para generar migraciones
- sirve para diseñar APIs
- sirve para forms
- sirve para validators

---
```
