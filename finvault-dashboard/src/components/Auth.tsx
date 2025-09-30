import { useAuth } from "@/context/AuthContext";
import { LoginPage } from "./LoginPage";
import { Loader2 } from "lucide-react";
import type { JSX } from "react/jsx-runtime";

// This component will wrap our main application content.
export const Auth = ({ children }: { children: JSX.Element }) => {
	const { session, isLoading } = useAuth();

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Loader2 className="h-8 w-8 animate-spin text-slate-400" />
			</div>
		);
	}

	if (!session) {
		return <LoginPage />;
	}

	return children;
};
