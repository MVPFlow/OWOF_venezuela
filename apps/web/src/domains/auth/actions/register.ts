"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { registerSchema } from "../schemas";
import type { RegisterInput } from "../schemas";

export async function register(input: RegisterInput) {
  const supabase = await createClient();

  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { email, password } = parsed.data;

  // Create the user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    return {
      success: false as const,
      error: {
        general: [authError.message],
      },
    };
  }

  const userId = authData.user?.id;
  if (!userId) {
    return {
      success: false as const,
      error: {
        general: ["No se pudo crear el usuario. Intenta de nuevo."],
      },
    };
  }

  // Insert into public.users with default organization
  const newUser = {
    id: userId,
    email,
    organization_id: "default",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { error: insertError } = await supabase
    .from("users")
    .insert(newUser as never);

  if (insertError) {
    // Rollback: delete the auth user if the DB insert fails
    await supabase.auth.admin.deleteUser(userId);

    return {
      success: false as const,
      error: {
        general: ["Error al crear el perfil de usuario. Intenta de nuevo."],
      },
    };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
