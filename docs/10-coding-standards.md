# `10-coding-standards.md`

# Coding Standards

# UMAF Social Platform

Version: 0.1
Status: Draft

---

# 1. Purpose

This document defines the official coding standards for the UMAF Social Platform.

The standards prioritize:

- maintainability
- modularity
- predictability
- scalability
- security
- readability
- AI-assisted development compatibility

These standards apply to:

- frontend
- backend
- database layer
- APIs
- utilities
- infrastructure code
- scripts

All contributors and AI systems must follow these rules.

---

# 2. Core Development Philosophy

The platform follows:

```text
Simple
Modular
Maintainable
Explicit
Secure
Mobile-First
```

The codebase should:

- remain easy to understand
- minimize hidden complexity
- avoid hacks
- prioritize long-term maintainability

---

# 3. General Principles

---

## 3.1 Avoid Overengineering

Do not introduce:

- unnecessary abstractions
- premature optimizations
- complex patterns without justification
- enterprise-style complexity

Prefer:

- simple solutions
- explicit code
- maintainable structures

---

## 3.2 Modular Architecture

Business logic must remain modular and isolated.

Separate:

- UI
- business logic
- state management
- validations
- utilities
- services

---

## 3.3 Readability First

Code should prioritize:

- readability
- explicit naming
- predictability
- maintainability

Readable code is preferred over clever code.

---

## 3.4 Functional-First Development

Focus on:

- functionality
- correctness
- usability

before:

- visual polish
- micro-optimizations
- advanced abstractions

---

# 4. Language Standards

---

## 4.1 Official Language

The entire codebase must use:

```text id="jlwm17"
TypeScript
```

JavaScript-only files should be avoided whenever possible.

---

## 4.2 Strict Type Safety

TypeScript strict mode should remain enabled.

Avoid:

- any
- unsafe casting
- implicit typing

unless absolutely necessary.

---

## 4.3 Preferred Type Strategy

Prefer:

- explicit types
- inferred local types
- shared domain types

Avoid duplicated type definitions.

---

# 5. Build & Validation Philosophy

---

## 5.1 Primary Validation

The minimum required validation for AI-generated code is:

```text id="jlwm18"
tsc
```

Type correctness is mandatory.

---

## 5.2 Build Philosophy

Heavy builds and full CI validation may be executed locally by human developers.

AI systems should prioritize:

- correctness
- modularity
- type safety

---

## 5.3 CI/CD Philosophy

Lightweight validations may run in GitHub Actions.

Heavy pipelines should remain local unless future architecture decisions change this strategy.

---

# 6. Branching Strategy

---

## 6.1 Protected Branches

The following branches must remain protected:

```text id="jlwm19"
main
master
```

Direct commits are forbidden.

---

## 6.2 Feature Branches

All work must occur through dedicated branches.

Branch naming conventions:

```text id="jlwm20"
dev-[task]-[date]
ai-[task]-[date]
```

Examples:

```text id="jlwm21"
dev-auth-module-2026-05-21
ai-people-crud-2026-05-21
```

---

## 6.3 Pull Request Philosophy

Changes should be:

- isolated
- reviewable
- traceable
- focused

Avoid giant PRs.

---

# 7. Security Standards

---

## 7.1 Unsafe Patterns Forbidden

The following are forbidden unless explicitly approved:

```text id="jlwm22"
dangerouslySetInnerHTML
raw SQL concatenation
eval
Function()
unsafe HTML rendering
```

---

## 7.2 SQL Injection Protection

All database operations must use:

- parameterized queries
- ORM protections
- validated inputs

Never interpolate raw user input into queries.

---

## 7.3 Validation Requirements

Critical operations must validate:

- authentication
- authorization
- ownership
- payload structure
- business rules

server-side.

---

## 7.4 Dependency Security

Do not install packages that:

- have known vulnerabilities
- show suspicious maintenance activity
- have unclear ownership
- appear abandoned
- compromise security

If package safety is uncertain:

- stop implementation
- request developer review
- recommend deep research

before adoption.

---

# 8. Dependency Philosophy

---

## 8.1 Minimize Dependencies

Avoid unnecessary packages.

Before adding a dependency:

- evaluate necessity
- evaluate bundle impact
- evaluate maintenance quality

---

## 8.2 Prefer Native Solutions

Prefer:

- platform-native APIs
- lightweight utilities
- internal abstractions

before installing third-party packages.

---

# 9. Component Standards

---

## 9.1 Agnostic Components

Components should remain:

- reusable
- composable
- domain-agnostic

whenever possible.

---

## 9.2 Domain-Coupled Components

If a component becomes tightly coupled to business logic:

- document the limitation
- flag as technical debt
- request developer confirmation when needed

---

## 9.3 Component Complexity Limit

Components or modules should not exceed:

```text id="jlwm23"
500 lines
```

If exceeded:

- refactor
- split responsibilities
- extract helpers
- extract subcomponents

---

# 10. Function Standards

---

## 10.1 Function Simplicity

Functions should:

- do one thing
- remain predictable
- remain testable

Avoid giant multi-purpose functions.

---

## 10.2 Complex Functions

Complex functions must include JSDoc documentation.

Example requirements:

- purpose
- parameters
- return values
- side effects
- important warnings

---

## 10.3 Function Naming

Use explicit names.

Good examples:

```text id="jlwm24"
createPayment
archiveProject
validateSponsorAccess
```

Avoid vague names:

```text id="jlwm25"
handleData
processStuff
runLogic
```

---

# 11. Helper Standards

---

## 11.1 Helper Usage

Extract helpers whenever:

- logic repeats
- complexity increases
- readability suffers

---

## 11.2 Helper Organization

Helpers should remain:

- isolated
- reusable
- domain-oriented

Avoid giant global utility files.

---

## 11.3 Utility Boundaries

Utilities should not contain:

- hidden business rules
- side effects
- unrelated logic

---

# 12. Business Logic Standards

---

## 12.1 Separation of Concerns

Separate:

- business logic
- UI logic
- state management
- persistence logic
- validations

---

## 12.2 Forbidden Business Logic Locations

Business logic should NOT live inside:

- page components
- presentational UI
- layout files

---

## 12.3 Service Layer Usage

Business workflows should live inside:

- services
- actions
- domain logic

---

# 13. State Management Standards

---

## 13.1 Local State First

Prefer:

- local component state
- server state
- isolated state

before introducing global stores.

---

## 13.2 Zustand Usage

Use Zustand only when:

- state is genuinely shared
- cross-component coordination exists

Avoid global state abuse.

---

# 14. Configuration Standards

---

## 14.1 Config Extraction

All reusable constants should live inside:

- config files
- constants folders

Avoid hardcoding values inside components.

---

## 14.2 Examples

Examples of extracted constants:

```text id="jlwm26"
roles
statuses
navigation items
upload limits
feature flags
```

---

# 15. Validation Standards

---

## 15.1 Shared Validation

Validation schemas should remain centralized.

Preferred approach:

```text id="jlwm27"
Zod Schemas
```

shared across:

- frontend
- backend
- APIs
- forms

---

## 15.2 Validation Duplication

Avoid duplicated validation logic across layers.

---

# 16. Error Handling Standards

---

## 16.1 Human-Readable Errors

Errors should:

- explain problems clearly
- avoid technical jargon
- support debugging

---

## 16.2 Silent Failures Forbidden

Do not swallow errors silently.

Unexpected failures should:

- log properly
- surface appropriately
- remain traceable

---

# 17. Logging Standards

---

## 17.1 AI Development Logs

Every AI execution session must append an entry to:

```text id="jlwm28"
/ops/dev-logs.md
```

---

## 17.2 Log Requirements

Each log entry should include:

- date
- time
- task summary
- affected modules
- important decisions
- technical debt notes
- blockers

---

## 17.3 Example Entry

```md
## 2026-05-21 14:30 UTC

Task:

- Implemented people CRUD module

Affected:

- people domain
- validators
- mobile forms

Notes:

- Added temporary upload placeholder
- Pending optimization for image compression
```

---

# 18. Technical Debt Standards

---

## 18.1 Explicit Debt Tracking

Technical debt must NEVER remain hidden.

If compromises are introduced:

- document them
- explain them
- justify them
- track them

---

## 18.2 Temporary Hacks

Temporary hacks require:

- explicit comments
- technical debt logging
- future refactor notes

---

# 19. Documentation Standards

---

## 19.1 Required Documentation

Complex systems should include:

- JSDoc
- README updates
- architecture notes
- usage examples

when appropriate.

---

## 19.2 Self-Documenting Code

Prefer:

- explicit naming
- readable structure

before excessive comments.

---

# 20. File Standards

---

## 20.1 File Size Philosophy

Files should remain:

- focused
- modular
- maintainable

---

## 20.2 Large File Refactoring

If a file grows excessively:

- extract helpers
- extract services
- split UI
- separate business logic

---

# 21. Import Standards

---

## 21.1 Import Order

Preferred import order:

```text id="jlwm29"
1. External libraries
2. Shared packages
3. Internal domains
4. Relative imports
```

---

## 21.2 Deep Relative Imports

Avoid deeply nested relative imports.

Prefer aliases when possible.

---

# 22. Performance Standards

---

## 22.1 Mobile Performance Priority

Code decisions must prioritize:

- mobile responsiveness
- bundle size
- rendering speed
- low-end device usability

---

## 22.2 Avoid Premature Optimization

Optimize only when:

- measurable bottlenecks exist
- operational impact exists

---

# 23. Testing Standards

---

## 23.1 Critical Logic Testing

Critical business logic should be testable and isolated.

---

## 23.2 Testable Architecture

Avoid tightly coupled logic that becomes difficult to test.

---

# 24. AI-Assisted Development Rules

---

## 24.1 AI Output Expectations

AI-generated code must:

- compile with TypeScript
- follow folder standards
- remain modular
- avoid hacks
- follow security rules

---

## 24.2 AI Limitation Transparency

If the AI:

- cannot validate behavior
- introduces assumptions
- lacks certainty

it must explicitly communicate those limitations.

---

## 24.3 AI Technical Debt Reporting

AI-generated technical debt must be:

- documented
- logged
- visible to developers

---

# 25. Architecture Anti-Patterns

Avoid:

- giant components
- hidden side effects
- duplicated logic
- magic values
- raw SQL concatenation
- unsafe rendering
- deeply coupled modules
- monolithic files
- overengineered abstractions

---

# 26. Long-Term Maintainability

The codebase should remain:

- understandable
- scalable
- refactorable
- contributor-friendly

over long-term project growth.

---

# 27. Future Standards Expansion

Future standards may include:

- ADR conventions
- performance budgets
- accessibility testing
- stricter CI enforcement
- release workflows
- automated quality gates

---

# 28. Current Status

Current phase:

- Coding standards definition

Next phase:

- Security guidelines definition
