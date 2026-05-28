"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function archivePerson(personId: string) {
  const supabase = await createClient();

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

  const organization_id = userOrg?.organization_id ?? user.id;

  const { data: existingPerson } = await supabase
    .from("people")
    .select("organization_id")
    .eq("id", personId)
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

  if (existingOrg.organization_id !== organization_id) {
    return {
      success: false as const,
      error: { general: ["No tienes permiso para archivar esta persona"] },
    };
  }

  const updateData = {
    status: "archived" as const,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("people")
    .update(updateData as never)
    .eq("id", personId);

  if (error) {
    console.error("Error archiving person:", error);
    return {
      success: false as const,
      error: { general: ["Error al archivar la persona"] },
    };
  }

  revalidatePath("/dashboard/people");
  return { success: true as const };
}
