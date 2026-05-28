# Structure Manifest

## OWOFVzla Social Platform

Este archivo define la estructura oficial de la documentación del proyecto.

**Estado actual (Mayo 2026):**  
Todos los documentos base (`00-project-charter.md` → `14-roadmap-master.md`) han sido actualizados para reflejar:

- Organización única: **OWOFVzla**.
- Sistema de invitaciones (solo SUPER_ADMIN puede invitar, emails con Resend).
- Relación opcional `people` ↔ `users` (futuro portal de patrocinadores).
- Páginas públicas por proyecto (`/proyectos/[slug]`).
- Flujo de registro sin registro público.

---

## Estructura de `/docs`

```text
/docs
│
├── 00-project-charter.md          ✅ Actualizado
├── 01-system-architecture.md      ✅ Actualizado
├── 02-tech-stack.md               ✅ Actualizado
├── 03-database-schema-v1.md       ✅ Actualizado
├── 04-business-rules.md           ✅ Actualizado
├── 05-user-roles-permissions.md   ✅ Actualizado
├── 06-mobile-first-guidelines.md  ✅ Actualizado
├── 07-ui-design-principles.md     ✅ Actualizado
├── 08-api-standards.md            ✅ Actualizado
├── 09-folder-structure.md         ✅ Actualizado
├── 10-coding-standards.md         ✅ Actualizado
├── 11-security-guidelines.md      ✅ Actualizado
├── 12-testing-strategy.md         ✅ Actualizado
├── 13-deployment-strategy.md      ✅ Actualizado
├── 14-roadmap-master.md           ✅ Actualizado
├── 99-glossary.md                 ⏳ Pendiente de crear
│
├── /specs         → Pendiente (people.spec.md, projects.spec.md, invitations.spec.md...)
├── /flows         → Pendiente (invitation-flow.md, sponsorship-flow.md...)
├── /wireframes    → Pendiente (mobile wireframes)
├── /decisions     → Pendiente (ADRs: invitaciones, email, etc.)
└── /roadmap       → Puede contener versiones detalladas del roadmap
```

## Notas

- `99-glossary.md` es crítico para definir la nomenclatura oficial (Person, User, Invitation, Sponsor, Contribution, etc.). Debe crearse antes de comenzar la implementación.
- Los ADRs en `/decisions` deben incluir al menos:
  - `ADR-004-invitation-only-registration.md`
  - `ADR-005-resend-for-emails.md`
  - `ADR-006-public-project-landing-pages.md`

---

**Última actualización:** 2026-05-28
