"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginSchema } from "../schemas";
import type { LoginInput } from "../schemas";

export async function login(input: LoginInput) {
	const supabase = await createClient();

	const parsed = loginSchema.safeParse(input);
	if (!parsed.success) {
		return {
			success: false as const,
			error: parsed.error.flatten().fieldErrors as Record<string, string[]>,
		};
	}

	const { email, password } = parsed.data;

	const { error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (error) {
		return {
			success: false as const,
			error: {
				general: [error.message],
			},
		};
	}

	revalidatePath("/", "layout");
	redirect("/dashboard");
}