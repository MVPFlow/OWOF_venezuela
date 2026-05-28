"use server";

import { createClient } from "@/lib/supabase/server";
import type { Person } from "../types";

export async function getPeople(): Promise<Person[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("No autenticado");
  }

  // Get the user's organization_id
  const { data: userData } = await supabase
    .from("users")
    .select("organization_id")
    .eq("id", user.id)
    .single();

  const userOrg = userData as unknown as {
    organization_id: string | null;
  } | null;

  if (!userOrg?.organization_id) {
    return [];
  }

  const { data, error } = await supabase
    .from("people")
    .select("*")
    .eq("organization_id", userOrg.organization_id)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching people:", error);
    throw new Error("Error al obtener las personas");
  }

  return data as Person[];
}
