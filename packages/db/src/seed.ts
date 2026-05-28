import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import * as schema from "./schema.js";

const ORG_ID = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";
const ORG_SLUG = "owofvzla";
const ORG_NAME = "One World One Family Venezuela";

function getEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name] ?? defaultValue;
  if (!value) {
    console.error(`${name} environment variable is required`);
    process.exit(1);
  }
  return value;
}

async function main() {
  const connectionString = getEnvVar("SUPABASE_DATABASE_URL");
  const adminEmail = getEnvVar("SUPER_ADMIN_EMAIL", "saturno@owofvzla.org");
  const adminPassword = getEnvVar("SUPER_ADMIN_PASSWORD", "Admin123!");
  const adminFirstName = getEnvVar("SUPER_ADMIN_FIRST_NAME", "Saturno");
  const adminLastName = getEnvVar("SUPER_ADMIN_LAST_NAME", "Mangieri");

  const queryClient = postgres(connectionString, { max: 1 });
  const db = drizzle(queryClient, { schema });

  console.log("Starting seed...");

  // 1. Organization
  console.log("Creating organization...");
  await db.insert(schema.organizations).values({
    id: ORG_ID,
    name: ORG_NAME,
    slug: ORG_SLUG,
    description: "Fundacion dedicada a proyectos sociales en Venezuela",
    country: "Venezuela",
    status: "active",
  }).onConflictDoNothing();

  // 2. SUPER_ADMIN user
  console.log("Creating SUPER_ADMIN user...");
  let adminUserId: string;

  const existingUser = await db.select().from(schema.users)
    .where(eq(schema.users.email, adminEmail))
    .limit(1);

  if (existingUser.length > 0) {
    adminUserId = existingUser[0].id;
    console.log("Admin user already exists:", adminUserId);
  } else {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPassword, salt);

    const inserted = await db.insert(schema.users).values({
      organizationId: ORG_ID,
      email: adminEmail,
      passwordHash,
      role: "SUPER_ADMIN",
      status: "active",
    }).returning();
    adminUserId = inserted[0].id;
    console.log("Admin user created:", adminUserId);
  }

  // 3. Person record for admin
  console.log("Creating person record for admin...");
  const existingPerson = await db.select().from(schema.people)
    .where(eq(schema.people.email, adminEmail))
    .limit(1);

  if (existingPerson.length > 0) {
    console.log("Person record already exists:", existingPerson[0].id);
  } else {
    const inserted = await db.insert(schema.people).values({
      organizationId: ORG_ID,
      userId: adminUserId,
      firstName: adminFirstName,
      lastName: adminLastName,
      email: adminEmail,
      status: "active",
    }).returning();
    console.log("Person record created:", inserted[0].id);
  }

  // 4. Project Types
  const projectTypes = [
    { name: "Beca", slug: "scholarship", description: "Programa de becas educativas para ninos y jovenes" },
    { name: "Medico", slug: "medical", description: "Campanas y programas de asistencia medica" },
    { name: "Alimentos", slug: "food", description: "Programas de distribucion de alimentos y nutricion" },
    { name: "Emergencia", slug: "emergency", description: "Asistencia en situaciones de emergencia y desastres" },
  ];

  console.log("Creating project types...");
  for (const pt of projectTypes) {
    const existing = await db.select().from(schema.projectTypes)
      .where(eq(schema.projectTypes.slug, pt.slug))
      .limit(1);

    if (existing.length > 0) {
      console.log("  Project type already exists:", pt.slug);
    } else {
      await db.insert(schema.projectTypes).values({
        organizationId: ORG_ID,
        name: pt.name,
        slug: pt.slug,
        description: pt.description,
      });
      console.log("  Created:", pt.slug);
    }
  }

  console.log("\nSeed completed successfully!");
  console.log("-".repeat(40));
  console.log("Organization:", ORG_NAME, "(".concat(ORG_SLUG, ")"));
  console.log("Admin email:", adminEmail);
  console.log("-".repeat(40));

  await queryClient.end();
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
