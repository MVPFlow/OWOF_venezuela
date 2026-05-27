import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export interface SessionState {
	user: User | null;
	isLoading: boolean;
}

export function useSupabaseSession(): SessionState {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Get initial session
		supabase.auth.getUser().then(({ data: { user } }) => {
			setUser(user);
			setIsLoading(false);
		});

		// Listen for auth state changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setUser(session?.user ?? null);
			setIsLoading(false);
		});

		return () => {
			subscription.unsubscribe();
		};
	}, []);

	return { user, isLoading };
}