# TODO - OWOFVzla Social Platform (Unificado)

## Estado actual

- **Paquete `@owofvzla/db` listo**: Drizzle ORM configurado, `schema.ts` completo (16 tablas + relaciones + enums), migraciones generadas, seed implementado.
- **Pendiente**: aplicar migraciones a Supabase y ejecutar seed (requiere conexión a base de datos real).
- Código: People module parcial (CRUD), auth básico (login/register), pero sin invitaciones.
- Errores críticos de TS resueltos recientemente.

## Prioridad 1: Base de datos y semillas (Phase 00/01)

### Completado (código listo, pendiente de aplicar)

- [x] **Definir esquema Drizzle completo** según `03-database-schema-v1.md` (16 tablas: `organizations`, `users`, `people`, `projects`, `project_types`, `project_participants`, `contributions`, `payments`, `attachments`, `notes`, `activity_logs`, `invitations`, `person_tags`, `people_tags_relations`, `custom_field_definitions`, `custom_field_values`).
- [x] **Generar migraciones** con Drizzle (`0000_tired_maverick.sql` para tablas).
- [x] **Crear seed**: organización (OWOFVzla, id fijo), SUPER_ADMIN (via .env), tipos de proyecto (scholarship, medical, food, emergency).
- [x] **Políticas RLS** generadas (`0001_rls_policies.sql`) para todas las tablas.
- [x] **Configurar Drizzle en monorepo**: paquete `@owofvzla/db` con scripts npm, tsconfig, drizzle.config.ts.
- [x] **Variables de entorno actualizadas** (`.env.example`): nuevas API keys de Supabase, seed configurable.

### Pendiente de ejecutar (requiere base de datos real)

- [ ] **Aplicar migraciones a Supabase** — ejecutar `0000_tired_maverick.sql` (crear tablas) y `0001_rls_policies.sql` (RLS) en el SQL Editor de Supabase, o usar `pnpm db:migrate`.
- [ ] **Ejecutar seed** con `pnpm db:seed` (requiere `SUPABASE_DATABASE_URL` y variables de SUPER_ADMIN en `.env`).
- [ ] **Verificar en Supabase**: 16 tablas creadas, SUPER_ADMIN en `users`, persona vinculada en `people`, 4 tipos de proyecto en `project_types`.

## Prioridad 2: Sistema de invitaciones (Phase 01)

> La tabla `invitations` ya existe en el esquema y tiene políticas RLS. Solo falta implementar la lógica.

- [ ] Crear server actions:
  - `inviteUser` (solo SUPER_ADMIN) – genera token, guarda, envía email con Resend.
  - `acceptInvitation` (público) – valida token, crea usuario en Supabase Auth, inserta en `users` y `people`, marca usado.
  - `resendInvitation`, `revokeInvitation`.
- [ ] UI para SUPER_ADMIN: panel `/admin/users` (invitar, listar pendientes, resend, revoke).
- [ ] Página pública `/accept-invite` (formulario password + nombre + apellido).
- [ ] Configurar Resend (variables de entorno, dominio verificado, plantilla de email).
- [ ] Probar flujo completo: invitación → email → aceptación → login.

## Prioridad 3: Módulo People (completar funcionalidades faltantes)

- [ ] Tags: CRUD de tags (admin), asignación a personas (tablas `person_tags` y `people_tags_relations` ya existen).
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
