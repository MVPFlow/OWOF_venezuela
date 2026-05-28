"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { personSchema } from "../schemas/person.schema";
import type { PersonInput } from "../schemas/person.schema";

interface UpdatePersonInput extends PersonInput {
  id: string;
}

export async function updatePerson(input: UpdatePersonInput) {
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

  const { data: userData } = await supabase
    .from("users")
    .select("organization_id")
    .eq("id", user.id)
    .single();

  const userOrg = userData as unknown as {
    organization_id: string | null;
  } | null;

  if (!userOrg?.organization_id) {
    return {
      success: false as const,
      error: { general: ["Error al obtener la organización del usuario"] },
    };
  }

  const { data: existingPerson } = await supabase
    .from("people")
    .select("organization_id")
    .eq("id", input.id)
    .single();

  const existingOrg = existingPerson as unknown as {
    organization_id: string;
  } | null;

  if (!existingOrg) {
    return {
      success: false as const,
      error: { general: ["Persona no encontrada"] },
    };
  }

  if (existingOrg.organization_id !== userOrg.organization_id) {
    return {
      success: false as const,
      error: { general: ["No tienes permiso para editar esta persona"] },
    };
  }

  const updateData = {
    first_name: parsed.data.first_name,
    last_name: parsed.data.last_name,
    email: parsed.data.email || null,
    phone: parsed.data.phone || null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("people")
    .update(updateData as never)
    .eq("id", input.id);

  if (error) {
    console.error("Error updating person:", error);
    return {
      success: false as const,
      error: { general: ["Error al actualizar la persona"] },
    };
  }

  revalidatePath("/dashboard/people");
  redirect("/dashboard/people");
}
