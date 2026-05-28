"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { personSchema } from "../schemas/person.schema";
import type { PersonInput } from "../schemas/person.schema";

export async function createPerson(input: PersonInput) {
  const supabase = await createClient();

  const parsed = personSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false as const,
      error: { general: ["No autenticado"] },
    };
  }

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("organization_id")
    .eq("id", user.id)
    .single();

  const userOrg = userData as unknown as {
    organization_id: string | null;
  } | null;

  if (userError || !userOrg?.organization_id) {
    return {
      success: false as const,
      error: { general: ["Error al obtener la organización del usuario"] },
    };
  }

  const insertData = {
    first_name: parsed.data.first_name,
    last_name: parsed.data.last_name,
    email: parsed.data.email || null,
    phone: parsed.data.phone || null,
    organization_id: userOrg.organization_id,
    status: "active",
  };

  const { error } = await supabase.from("people").insert(insertData as never);

  if (error) {
    console.error("Error creating person:", error);
    return {
      success: false as const,
      error: { general: ["Error al crear la persona"] },
    };
  }

  revalidatePath("/dashboard/people");
  redirect("/dashboard/people");
}
