import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  boolean,
  integer,
  decimal,
  pgEnum,
  index,
  uniqueIndex,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================================
// Enums
// ============================================================

export const userRoleEnum = pgEnum("user_role", [
  "SUPER_ADMIN",
  "DIRECTOR",
  "COORDINATOR",
  "VOLUNTEER",
  "ACCOUNTING",
  "VIEWER",
  "SPONSOR",
]);

export const userStatusEnum = pgEnum("user_status", [
  "active",
  "inactive",
  "suspended",
  "invited",
]);

export const personStatusEnum = pgEnum("person_status", [
  "active",
  "archived",
]);

export const projectStatusEnum = pgEnum("project_status", [
  "draft",
  "active",
  "completed",
  "archived",
]);

export const projectVisibilityEnum = pgEnum("project_visibility", [
  "public",
  "private",
  "internal",
]);

export const participantRoleEnum = pgEnum("participant_role", [
  "student",
  "sponsor",
  "volunteer",
  "coordinator",
  "doctor",
  "beneficiary",
]);

export const participantStatusEnum = pgEnum("participant_status", [
  "active",
  "inactive",
  "removed",
  "completed",
]);

export const contributionFrequencyEnum = pgEnum("contribution_frequency", [
  "one_time",
  "weekly",
  "monthly",
  "quarterly",
  "yearly",
]);

export const contributionStatusEnum = pgEnum("contribution_status", [
  "pending",
  "active",
  "paused",
  "completed",
  "cancelled",
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "cash",
  "bank_transfer",
  "mobile_payment",
  "credit_card",
  "debit_card",
  "other",
]);

export const attachmentCategoryEnum = pgEnum("attachment_category", [
  "receipt",
  "transfer",
  "student_photo",
  "report",
  "invoice",
  "evidence",
  "medical_document",
]);

export const noteVisibilityEnum = pgEnum("note_visibility", [
  "private",
  "internal",
  "public",
]);

export const invitationRoleEnum = pgEnum("invitation_role", [
  "DIRECTOR",
  "COORDINATOR",
  "VOLUNTEER",
  "ACCOUNTING",
  "VIEWER",
  "SPONSOR",
]);

export const customFieldTypeEnum = pgEnum("custom_field_type", [
  "text",
  "textarea",
  "number",
  "date",
  "boolean",
  "select",
  "multiselect",
  "file",
]);

export const orgStatusEnum = pgEnum("org_status", [
  "active",
  "inactive",
]);

// ============================================================
// organizations
// ============================================================

export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  logoUrl: text("logo_url"),
  country: text("country"),
  status: orgStatusEnum("status").notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ============================================================
// users
// ============================================================

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  authUserId: uuid("auth_user_id"),
  email: text("email").notNull(),
  passwordHash: text("password_hash"),
  role: userRoleEnum("role").notNull().default("VIEWER"),
  status: userStatusEnum("status").notNull().default("invited"),
  invitedBy: uuid("invited_by").references((): any => users.id, { onDelete: "set null" }),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("users_email_idx").on(table.email),
  index("users_organization_id_idx").on(table.organizationId),
]);

// ============================================================
// people
// ============================================================

export const people = pgTable("people", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "set null" }),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  documentId: text("document_id"),
  birthDate: timestamp("birth_date", { withTimezone: true }),
  phone: text("phone"),
  email: text("email"),
  gender: text("gender"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  country: text("country"),
  photoUrl: text("photo_url"),
  status: personStatusEnum("status").notNull().default("active"),
  notes: text("notes"),
  metadataJson: jsonb("metadata_json"),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("people_email_idx").on(table.email),
  index("people_organization_id_idx").on(table.organizationId),
]);

// ============================================================
// project_types
// ============================================================

export const projectTypes = pgTable("project_types", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  configJson: jsonb("config_json"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("project_types_org_slug_idx").on(table.organizationId, table.slug),
]);

// ============================================================
// projects
// ============================================================

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  projectTypeId: uuid("project_type_id")
    .notNull()
    .references(() => projectTypes.id, { onDelete: "restrict" }),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  status: projectStatusEnum("status").notNull().default("draft"),
  visibility: projectVisibilityEnum("visibility").notNull().default("private"),
  startDate: timestamp("start_date", { withTimezone: true }),
  endDate: timestamp("end_date", { withTimezone: true }),
  coverImageUrl: text("cover_image_url"),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("projects_slug_idx").on(table.slug),
  index("projects_organization_id_idx").on(table.organizationId),
]);

// ============================================================
// project_participants
// ============================================================

export const projectParticipants = pgTable("project_participants", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  personId: uuid("person_id")
    .notNull()
    .references(() => people.id, { onDelete: "restrict" }),
  role: participantRoleEnum("role").notNull().default("volunteer"),
  status: participantStatusEnum("status").notNull().default("active"),
  joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow(),
  leftAt: timestamp("left_at", { withTimezone: true }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("project_participants_project_id_idx").on(table.projectId),
  index("project_participants_person_id_idx").on(table.personId),
]);

// ============================================================
// contributions
// ============================================================

export const contributions = pgTable("contributions", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  sponsorPersonId: uuid("sponsor_person_id")
    .notNull()
    .references(() => people.id, { onDelete: "restrict" }),
  beneficiaryPersonId: uuid("beneficiary_person_id")
    .references(() => people.id, { onDelete: "restrict" }),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("VES"),
  frequency: contributionFrequencyEnum("frequency").notNull().default("one_time"),
  status: contributionStatusEnum("status").notNull().default("pending"),
  startDate: timestamp("start_date", { withTimezone: true }),
  endDate: timestamp("end_date", { withTimezone: true }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("contributions_organization_id_idx").on(table.organizationId),
  index("contributions_project_id_idx").on(table.projectId),
  index("contributions_sponsor_id_idx").on(table.sponsorPersonId),
]);

// ============================================================
// payments
// ============================================================

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  contributionId: uuid("contribution_id")
    .notNull()
    .references(() => contributions.id, { onDelete: "restrict" }),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("VES"),
  paymentMethod: paymentMethodEnum("payment_method"),
  referenceNumber: text("reference_number"),
  paymentDate: timestamp("payment_date", { withTimezone: true }).notNull().defaultNow(),
  receiptAttachmentId: uuid("receipt_attachment_id"),
  notes: text("notes"),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("payments_contribution_id_idx").on(table.contributionId),
]);

// ============================================================
// attachments
// ============================================================

export const attachments = pgTable("attachments", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  entityType: text("entity_type").notNull(),
  entityId: uuid("entity_id").notNull(),
  fileUrl: text("file_url").notNull(),
  fileName: text("file_name"),
  mimeType: text("mime_type"),
  fileSize: integer("file_size"),
  category: attachmentCategoryEnum("category"),
  uploadedBy: uuid("uploaded_by")
    .references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("attachments_entity_idx").on(table.entityType, table.entityId),
  index("attachments_organization_id_idx").on(table.organizationId),
]);

// ============================================================
// notes
// ============================================================

export const notes = pgTable("notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  entityType: text("entity_type").notNull(),
  entityId: uuid("entity_id").notNull(),
  visibility: noteVisibilityEnum("visibility").notNull().default("private"),
  content: text("content").notNull(),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("notes_entity_idx").on(table.entityType, table.entityId),
  index("notes_organization_id_idx").on(table.organizationId),
]);

// ============================================================
// activity_logs
// ============================================================

export const activityLogs = pgTable("activity_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "set null" }),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: uuid("entity_id"),
  changesJson: jsonb("changes_json"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("activity_logs_entity_idx").on(table.entityType, table.entityId),
  index("activity_logs_organization_id_idx").on(table.organizationId),
  index("activity_logs_user_id_idx").on(table.userId),
]);

// ============================================================
// invitations
// ============================================================

export const invitations = pgTable("invitations", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  role: invitationRoleEnum("role").notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  usedAt: timestamp("used_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("invitations_token_idx").on(table.token),
  index("invitations_email_idx").on(table.email),
  index("invitations_organization_id_idx").on(table.organizationId),
]);

// ============================================================
// person_tags
// ============================================================

export const personTags = pgTable("person_tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("person_tags_org_slug_idx").on(table.organizationId, table.slug),
]);

// ============================================================
// people_tags_relations
// ============================================================

export const peopleTagsRelations = pgTable("people_tags_relations", {
  personId: uuid("person_id")
    .notNull()
    .references(() => people.id, { onDelete: "cascade" }),
  tagId: uuid("tag_id")
    .notNull()
    .references(() => personTags.id, { onDelete: "cascade" }),
}, (table) => [
  primaryKey({ columns: [table.personId, table.tagId] }),
  index("people_tags_relations_person_id_idx").on(table.personId),
  index("people_tags_relations_tag_id_idx").on(table.tagId),
]);

// ============================================================
// custom_field_definitions
// ============================================================

export const customFieldDefinitions = pgTable("custom_field_definitions", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  projectTypeId: uuid("project_type_id")
    .references(() => projectTypes.id, { onDelete: "cascade" }),
  fieldName: text("field_name").notNull(),
  fieldSlug: text("field_slug").notNull(),
  fieldType: customFieldTypeEnum("field_type").notNull(),
  required: boolean("required").notNull().default(false),
  configJson: jsonb("config_json"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("custom_field_definitions_org_slug_idx").on(table.organizationId, table.fieldSlug),
  index("custom_field_definitions_project_type_id_idx").on(table.projectTypeId),
]);

// ============================================================
// custom_field_values
// ============================================================

export const customFieldValues = pgTable("custom_field_values", {
  id: uuid("id").primaryKey().defaultRandom(),
  fieldDefinitionId: uuid("field_definition_id")
    .notNull()
    .references(() => customFieldDefinitions.id, { onDelete: "cascade" }),
  entityType: text("entity_type").notNull(),
  entityId: uuid("entity_id").notNull(),
  valueJson: jsonb("value_json"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("custom_field_values_field_def_idx").on(table.fieldDefinitionId),
  index("custom_field_values_entity_idx").on(table.entityType, table.entityId),
]);

// ============================================================
// Relations
// ============================================================

export const organizationsRelations = relations(organizations, ({ many }) => ({
  users: many(users),
  people: many(people),
  projects: many(projects),
  projectTypes: many(projectTypes),
  invitations: many(invitations),
  contributions: many(contributions),
  attachments: many(attachments),
  notes: many(notes),
  activityLogs: many(activityLogs),
  personTags: many(personTags),
  customFieldDefinitions: many(customFieldDefinitions),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [users.organizationId],
    references: [organizations.id],
  }),
  invitedByUser: one(users, {
    fields: [users.invitedBy],
    references: [users.id],
  }),
  invitedUsers: many(users, { relationName: "invitedByUser" }),
  createdProjects: many(projects),
  createdInvitations: many(invitations),
  createdAttachments: many(attachments),
  createdNotes: many(notes),
  activityLogEntries: many(activityLogs),
  createdPayments: many(payments),
}));

export const peopleRelations = relations(people, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [people.organizationId],
    references: [organizations.id],
  }),
  user: one(users, {
    fields: [people.userId],
    references: [users.id],
  }),
  projectParticipants: many(projectParticipants),
  sponsorContributions: many(contributions, { relationName: "sponsor" }),
  beneficiaryContributions: many(contributions, { relationName: "beneficiary" }),
  tagsRelations: many(peopleTagsRelations),
}));

export const projectTypesRelations = relations(projectTypes, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [projectTypes.organizationId],
    references: [organizations.id],
  }),
  projects: many(projects),
  customFieldDefinitions: many(customFieldDefinitions),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [projects.organizationId],
    references: [organizations.id],
  }),
  projectType: one(projectTypes, {
    fields: [projects.projectTypeId],
    references: [projectTypes.id],
  }),
  createdByUser: one(users, {
    fields: [projects.createdBy],
    references: [users.id],
  }),
  participants: many(projectParticipants),
  contributions: many(contributions),
  notes: many(notes),
  activityLogs: many(activityLogs),
}));

export const projectParticipantsRelations = relations(projectParticipants, ({ one }) => ({
  project: one(projects, {
    fields: [projectParticipants.projectId],
    references: [projects.id],
  }),
  person: one(people, {
    fields: [projectParticipants.personId],
    references: [people.id],
  }),
}));

export const contributionsRelations = relations(contributions, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [contributions.organizationId],
    references: [organizations.id],
  }),
  project: one(projects, {
    fields: [contributions.projectId],
    references: [projects.id],
  }),
  sponsor: one(people, {
    fields: [contributions.sponsorPersonId],
    references: [people.id],
    relationName: "sponsor",
  }),
  beneficiary: one(people, {
    fields: [contributions.beneficiaryPersonId],
    references: [people.id],
    relationName: "beneficiary",
  }),
  payments: many(payments),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  contribution: one(contributions, {
    fields: [payments.contributionId],
    references: [contributions.id],
  }),
  createdByUser: one(users, {
    fields: [payments.createdBy],
    references: [users.id],
  }),
}));

export const attachmentsRelations = relations(attachments, ({ one }) => ({
  organization: one(organizations, {
    fields: [attachments.organizationId],
    references: [organizations.id],
  }),
  uploadedByUser: one(users, {
    fields: [attachments.uploadedBy],
    references: [users.id],
  }),
}));

export const notesRelations = relations(notes, ({ one }) => ({
  organization: one(organizations, {
    fields: [notes.organizationId],
    references: [organizations.id],
  }),
  createdByUser: one(users, {
    fields: [notes.createdBy],
    references: [users.id],
  }),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  organization: one(organizations, {
    fields: [activityLogs.organizationId],
    references: [organizations.id],
  }),
  user: one(users, {
    fields: [activityLogs.userId],
    references: [users.id],
  }),
}));

export const invitationsRelations = relations(invitations, ({ one }) => ({
  organization: one(organizations, {
    fields: [invitations.organizationId],
    references: [organizations.id],
  }),
  createdByUser: one(users, {
    fields: [invitations.createdBy],
    references: [users.id],
  }),
}));

export const personTagsRelations = relations(personTags, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [personTags.organizationId],
    references: [organizations.id],
  }),
  peopleRelations: many(peopleTagsRelations),
}));

export const peopleTagsRelationsRelations = relations(peopleTagsRelations, ({ one }) => ({
  person: one(people, {
    fields: [peopleTagsRelations.personId],
    references: [people.id],
  }),
  tag: one(personTags, {
    fields: [peopleTagsRelations.tagId],
    references: [personTags.id],
  }),
}));

export const customFieldDefinitionsRelations = relations(customFieldDefinitions, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [customFieldDefinitions.organizationId],
    references: [organizations.id],
  }),
  projectType: one(projectTypes, {
    fields: [customFieldDefinitions.projectTypeId],
    references: [projectTypes.id],
  }),
  values: many(customFieldValues),
}));

export const customFieldValuesRelations = relations(customFieldValues, ({ one }) => ({
  fieldDefinition: one(customFieldDefinitions, {
    fields: [customFieldValues.fieldDefinitionId],
    references: [customFieldDefinitions.id],
  }),
}));
