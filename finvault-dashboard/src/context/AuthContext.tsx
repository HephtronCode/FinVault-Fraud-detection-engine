// src/context/AuthContext.tsx

import { createContext, useState, useEffect, useContext } from "react";
import type { ReactNode } from "react"; // The corrected type-only import
import { supabase } from "@/lib/supabaseClient";
import type { Session, User } from "@supabase/supabase-js"; // This was already correct!

// Define the shape of our context's data
interface AuthContextType {
	session: Session | null;
	user: User | null;
	isLoading: boolean;
}

// Create the context with a default value of `null`
const AuthContext = createContext<AuthContextType | null>(null);

// This is our main provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [session, setSession] = useState<Session | null>(null);
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setIsLoading(true);

		// Check for an existing session when the app loads
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
			setUser(session?.user ?? null);
			setIsLoading(false);
		});

		// Listen for changes in the auth state (e.g., user logs in or out)
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
			setUser(session?.user ?? null);
		});

		// Cleanup the subscription when the component unmounts
		return () => {
			subscription?.unsubscribe();
		};
	}, []);

	const value = {
		session,
		user,
		isLoading,
	};

	// The isLoading check prevents showing the app before the session is known
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// A custom "hook" to make using our context easier
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined || context === null) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
