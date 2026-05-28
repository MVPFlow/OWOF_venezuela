# TODO - OWOFVzla Social Platform (Unificado)

## Estado actual

- Base de datos: tablas `organizations`, `users`, `people`, `projects`, `project_participants` creadas. Faltan muchas.
- Código: People module parcial (CRUD), auth básico (login/register), pero sin invitaciones.
- Errores críticos de TS resueltos recientemente.

## Prioridad 1: Base de datos y semillas (completar Phase 00/01)

- [ ] **Definir esquema Drizzle completo** según `03-database-schema-v1.md` (incluir todas las tablas faltantes: `invitations`, `project_types`, `contributions`, `payments`, `attachments`, `notes`, `activity_logs`, `person_tags`, `people_tags_relations`, `custom_field_definitions`, `custom_field_values`).
- [ ] **Generar migraciones** con Drizzle y aplicar a Supabase (crear tablas).
- [ ] **Crear seed**:
  - Organización: `OWOFVzla` (id fijo, slug `owofvzla`).
  - Usuario SUPER_ADMIN: `Saturno Mangieri` (email a definir, role SUPER_ADMIN, status active).
  - Tipos de proyecto básicos: `scholarship`, `medical`, `food`, `emergency`.
- [ ] **Verificar RLS** - habilitar en todas las tablas, crear políticas básicas (al menos para `users`, `people`, `projects`).

## Prioridad 2: Sistema de invitaciones (Phase 01 completada)

- [ ] Implementar tabla `invitations` (ya incluida en migraciones).
- [ ] Crear server actions:
  - `inviteUser` (solo SUPER_ADMIN) – genera token, guarda, envía email con Resend.
  - `acceptInvitation` (público) – valida token, crea usuario en Supabase Auth, inserta en `users`, marca usado.
  - `resendInvitation`, `revokeInvitation`.
- [ ] UI para SUPER_ADMIN: panel `/admin/users` (invitar, listar pendientes, resend, revoke).
- [ ] Página pública `/accept-invite` (formulario password + nombre).
- [ ] Configurar Resend (variables de entorno, dominio verificado).
- [ ] Probar flujo completo: invitación → email → aceptación → login.

## Prioridad 3: Módulo People (completar funcionalidades faltantes)

- [ ] Tags: crear tabla `person_tags` y relaciones, CRUD de tags (admin), asignación a personas.
- [ ] Notas: implementar agregar notas a persona (con visibilidad private/internal/public).
- [ ] Adjuntos (fotos de perfil, documentos): usar Supabase Storage, integración con UI.
- [ ] Búsqueda y filtros (por nombre, email, tag).
- [ ] Validar permisos: COORDINATOR puede editar, VOLUNTEER solo lectura de asignados.

## Prioridad 4: Módulo Projects

- [ ] CRUD de proyectos (crear, editar, listar, archivar).
- [ ] Gestión de participantes (asignar personas con roles).
- [ ] Visibilidad pública/privada/interna.
- [ ] Slugs únicos para proyectos públicos.

## Prioridad 5: Módulo Contributions & Payments

- [ ] CRUD de contribuciones (sponsor, proyecto, beneficiario opcional, monto, frecuencia).
- [ ] CRUD de pagos (asociados a contribución, con recibos).
- [ ] Subida de recibos (adjuntos).

## Prioridad 6: Páginas públicas (transparencia)

- [ ] Landing page pública (`/`).
- [ ] Página de proyecto público (`/proyectos/[slug]`).
- [ ] Sobre la fundación, transparencia, métricas.

## Tareas técnicas transversales

- [ ] Configurar Drizzle correctamente en monorepo (paquete `@owofvzla/db`).
- [ ] Generar tipos de Supabase (`supabase gen types`) y sincronizar con TS.
- [ ] Eliminar todo `as never` de las queries (usar tipos correctos).
- [ ] Unificar naming: cambiar todos los `@umaf` por `@owofvzla` (package.json, imports).
- [ ] Instalar y configurar `shadcn/ui` (componentes base: Button, Input, Card, etc.).
- [ ] Configurar PWA (iconos, manifest, service worker).

## Documentación diferida (no bloqueante, para después)

- [ ] Specs detallados (ya tenemos algunos, pero no prioridad ahora).
- [ ] Flows y ADRs (los crearemos sobre la marcha).
- [ ] Wireframes, diagrama ERD, etc.

## Nota

Este TODO es la fuente única de verdad. Se actualiza a medida que avanzamos. Las tareas se consideran completadas cuando cumplen criterios de aceptación y pasan pruebas.
