# `08-api-standards.md`

# API Standards

# UMAF Social Platform

Version: 0.1
Status: Draft

---

# 1. Purpose

This document defines the official API architecture and communication standards for the UMAF Social Platform.

The API strategy must guarantee:

- consistency
- scalability
- maintainability
- predictable behavior
- secure operations
- mobile-first performance

These standards apply to:

- server actions
- route handlers
- internal APIs
- external APIs
- validation layers
- error handling
- authentication flows

---

# 2. API Philosophy

The platform prioritizes:

```text
Simple
Predictable
Typed
Secure
Modular
```

The system intentionally avoids:

- unnecessary abstraction
- overengineered APIs
- excessive indirection

---

# 3. Primary Communication Strategy

Preferred communication hierarchy:

```text
Server Actions
    ↓
Route Handlers
    ↓
REST APIs (only when necessary)
```

---

# 4. API Architectural Principles

---

## 4.1 Server-Centric Architecture

Business-critical logic should execute server-side whenever possible.

Frontend clients should remain lightweight.

---

## 4.2 Shared Validation

Validation schemas should be shared between:

- frontend
- backend
- forms
- APIs

using centralized Zod schemas.

---

## 4.3 Typed Contracts

All API inputs and outputs should be typed using TypeScript.

Avoid:

- implicit shapes
- untyped payloads
- inconsistent structures

---

## 4.4 Predictable Responses

APIs should return consistent response patterns across the platform.

---

# 5. API Structure Strategy

Recommended route structure:

```text id="u4n9pb"
/api
    /auth
    /people
    /projects
    /contributions
    /payments
    /files
    /reports
```

---

# 6. Domain-Oriented APIs

Each domain owns:

- routes
- validations
- services
- types
- business logic

Avoid centralized monolithic API layers.

---

# 7. HTTP Method Standards

---

## 7.1 GET

Used for:

- reading data
- listing resources
- filtering resources

Must not mutate data.

---

## 7.2 POST

Used for:

- creating entities
- complex operations
- uploads
- workflow actions

---

## 7.3 PATCH

Used for:

- partial updates
- status changes
- lightweight modifications

Preferred over PUT in most cases.

---

## 7.4 DELETE

Used primarily for:

- soft deletes
- archive actions

Avoid destructive permanent deletion.

---

# 8. Naming Conventions

---

## 8.1 Route Naming

Use:

- lowercase
- plural resources
- kebab-case when necessary

Examples:

```text id="jlwm01"
/api/people
/api/projects
/api/project-types
```

---

## 8.2 Action Naming

Use explicit action names.

Examples:

```text id="jlwm02"
archiveProject
createPayment
uploadEvidence
assignParticipant
```

Avoid vague names like:

```text id="jlwm03"
handleData
processItem
submitThing
```

---

# 9. Response Standards

---

## 9.1 Success Response Structure

Preferred success structure:

```json
{
  "success": true,
  "data": {}
}
```

---

## 9.2 Error Response Structure

Preferred error structure:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid payment amount"
  }
}
```

---

## 9.3 Validation Error Structure

Validation responses should include:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "fields": {
      "email": "Invalid email format"
    }
  }
}
```

---

# 10. Error Handling Standards

---

## 10.1 Human-Readable Errors

Errors should:

- avoid technical jargon
- explain the problem clearly
- support mobile UX

---

## 10.2 Internal Error Exposure

Internal implementation details must never be exposed publicly.

Avoid leaking:

- SQL errors
- stack traces
- internal infrastructure details

---

## 10.3 Consistent Error Codes

Recommended error codes:

```text id="jlwm04"
VALIDATION_ERROR
UNAUTHORIZED
FORBIDDEN
NOT_FOUND
CONFLICT
RATE_LIMITED
INTERNAL_ERROR
```

---

# 11. Authentication Standards

---

## 11.1 Authentication Strategy

Authentication handled using:

```text id="jlwm05"
Supabase Auth
```

---

## 11.2 Protected Endpoints

Protected endpoints must validate:

- authenticated session
- organization ownership
- role permissions

before executing operations.

---

## 11.3 Unauthorized Responses

Unauthorized requests should return:

```text id="jlwm06"
401 Unauthorized
```

Forbidden requests should return:

```text id="jlwm07"
403 Forbidden
```

---

# 12. Authorization Standards

---

## 12.1 Permission Validation

Permissions must always be validated:

- server-side
- before database mutations
- before file access
- before exports

---

## 12.2 Organization Isolation

All requests must remain scoped to:

- organization ownership

Cross-organization access is forbidden.

---

# 13. Validation Standards

---

## 13.1 Zod Validation

All critical API payloads should validate through:

```text id="jlwm08"
Zod
```

---

## 13.2 Validation Layers

Validation hierarchy:

```text
Client Validation
    ↓
Server Validation
    ↓
Database Constraints
```

---

## 13.3 Required Validation Types

Validate:

- payload shape
- field types
- required fields
- permissions
- ownership
- business rules

---

# 14. Pagination Standards

---

## 14.1 Pagination Requirement

Large lists must support pagination.

Avoid returning massive datasets.

---

## 14.2 Recommended Pagination Structure

Preferred structure:

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 150
  }
}
```

---

# 15. Filtering Standards

---

## 15.1 Filtering Support

List endpoints should support:

- search
- filtering
- sorting

when operationally relevant.

---

## 15.2 Query Parameters

Preferred query structure:

```text id="jlwm09"
/api/projects?status=active&page=1
```

---

# 16. File Upload Standards

---

## 16.1 Upload Validation

Uploads must validate:

- mime type
- file size
- ownership
- authentication

---

## 16.2 Allowed File Types

Initially supported:

```text id="jlwm10"
images
pdf
documents
```

Executable uploads are forbidden.

---

## 16.3 Upload Response

Preferred upload response:

```json
{
  "success": true,
  "data": {
    "fileId": "uuid",
    "url": "file-url"
  }
}
```

---

# 17. Soft Delete Standards

---

## 17.1 Soft Delete Philosophy

Deletion operations should prefer:

- archive states
- deleted_at fields

instead of destructive deletion.

---

## 17.2 Delete Responses

Deleted resources should remain traceable when appropriate.

---

# 18. Audit Logging Standards

---

## 18.1 Critical Action Logging

Critical operations should generate logs automatically.

Examples:

- payment creation
- permission changes
- uploads
- visibility changes

---

## 18.2 Audit Metadata

Logs should include:

- user ID
- organization ID
- entity type
- timestamps
- action type

---

# 19. Performance Standards

---

## 19.1 Response Optimization

APIs should avoid:

- unnecessary payloads
- overfetching
- deeply nested responses

---

## 19.2 Mobile Performance

Responses should remain optimized for:

- slow networks
- mobile devices
- unstable connectivity

---

# 20. Caching Strategy

---

## 20.1 Cacheable Resources

Safe read endpoints may support:

- caching
- revalidation
- stale-while-revalidate

when appropriate.

---

## 20.2 Sensitive Data

Sensitive endpoints should avoid aggressive caching.

---

# 21. Realtime Standards

---

## 21.1 Realtime Usage

Realtime should only be used when operationally valuable.

Examples:

- notifications
- live updates
- collaborative actions

Avoid unnecessary realtime complexity.

---

# 22. API Security Standards

---

## 22.1 Rate Limiting

Sensitive endpoints should support:

- throttling
- abuse prevention
- upload limits

when necessary.

---

## 22.2 Input Sanitization

All user-generated input must be sanitized before persistence or rendering.

---

## 22.3 Sensitive Operations

Sensitive operations must:

- validate permissions
- generate audit logs
- enforce ownership

---

# 23. API Versioning Strategy

---

## 23.1 Initial Versioning

Initial internal APIs may avoid explicit versioning.

---

## 23.2 Future Versioning

Public APIs may later adopt:

```text id="jlwm11"
/api/v1
```

when external integrations become necessary.

---

# 24. API Documentation Standards

---

## 24.1 Documentation Requirement

All major endpoints should document:

- purpose
- input schema
- output schema
- permissions
- business rules

---

## 24.2 Shared Specs

API contracts should remain synchronized with:

- domain specs
- validation schemas
- TypeScript types

---

# 25. API Anti-Patterns

Avoid:

- fat controllers
- duplicated validation
- untyped payloads
- inconsistent responses
- leaking internal errors
- giant payloads
- deeply nested responses
- permission logic in frontend only

---

# 26. Future API Expansion

Future versions may support:

- public APIs
- webhook systems
- integrations
- sponsor portals
- external mobile apps

without replacing current standards.

---

# 27. Current Status

Current phase:

- API standards definition

Next phase:

- Folder structure definition
