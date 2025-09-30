// src/App.tsx

import { useEffect, useState } from "react";
import { getNewCases } from "./services/airtableService";
import type { AirtableRecord } from "./types/case";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { CaseDetailPanel } from "./components/CaseDetailPanel";
import { Toaster } from "sonner";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Auth } from "./components/Auth";
import { Button } from "./components/ui/button";
import { useAuth } from "./context/AuthContext";
import { supabase } from "./lib/supabaseClient";
import { Loader2 } from "lucide-react"; // Import the spinner for loading state

function Dashboard() {
	const { user } = useAuth();
	const [cases, setCases] = useState<AirtableRecord[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedCase, setSelectedCase] = useState<AirtableRecord | null>(null);
	const [isSheetOpen, setIsSheetOpen] = useState(false);

	useEffect(() => {
		// --- DEBUG LOG #1 ---
		console.log("Dashboard component has mounted. Starting to fetch cases...");

		setIsLoading(true);
		getNewCases()
			.then((data) => {
				// --- DEBUG LOG #2 ---
				console.log("Successfully fetched data from Airtable:", data);
				setCases(data);
			})
			.catch((error) => {
				// --- DEBUG LOG #3 ---
				console.error("An error occurred while fetching cases:", error);
			})
			.finally(() => {
				// --- DEBUG LOG #4 ---
				console.log("Finished fetching. Setting isLoading to false.");
				setIsLoading(false);
			});
	}, []); // The empty dependency array means this runs only once on mount

	const handleCaseUpdate = (updatedRecord: AirtableRecord) => {
		const remainingCases = cases.filter((c) => c.id !== updatedRecord.id);
		setCases(remainingCases);
		if (remainingCases.length > 0) {
			setSelectedCase(remainingCases[0]);
		} else {
			setSelectedCase(null);
		}
	};

	const handleRowClick = (record: AirtableRecord) => {
		setSelectedCase(record);
		setIsSheetOpen(true);
	};

	// --- DEBUG LOG #5 ---
	console.log("Rendering Dashboard component with state:", {
		isLoading,
		numberOfCases: cases.length,
	});

	return (
		<>
			<Toaster richColors position="top-right" />
			<main className="container mx-auto py-8">
				<header className="mb-8 flex justify-between items-center border-b pb-4">
					<div>
						<h1 className="text-4xl font-bold tracking-tight">
							FinVault Case Queue
						</h1>
						<p className="text-muted-foreground">
							Logged in as: <strong>{user?.email}</strong>
						</p>
					</div>
					<Button variant="outline" onClick={() => supabase.auth.signOut()}>
						Log Out
					</Button>
				</header>

				{/* Re-adding the full table structure that might have been lost */}
				<div className="border rounded-lg shadow-sm">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Case ID</TableHead>
								<TableHead>Customer Name</TableHead>
								<TableHead>Country</TableHead>
								<TableHead className="text-right">Amount (NGN)</TableHead>
								<TableHead className="text-right">Risk Score</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{isLoading ? (
								<TableRow>
									<TableCell colSpan={5} className="text-center h-48">
										<div className="flex justify-center items-center">
											<Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading
											Cases...
										</div>
									</TableCell>
								</TableRow>
							) : cases.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={5}
										className="text-center h-48 text-muted-foreground"
									>
										The "New" queue is clear. Well done!
									</TableCell>
								</TableRow>
							) : (
								cases.map((record) => (
									<TableRow
										key={record.id}
										onClick={() => handleRowClick(record)}
										className="cursor-pointer hover:bg-muted/50"
									>
										<TableCell className="font-medium">
											{record.fields["Case ID"]}
										</TableCell>
										<TableCell>{record.fields["Customer Name"]}</TableCell>
										<TableCell>
											{record.fields["Transaction Country"]}
										</TableCell>
										<TableCell className="text-right">
											{record.fields["Transaction Amount"]?.toLocaleString()}
										</TableCell>
										<TableCell className="text-right font-bold text-lg">
											{record.fields["Risk Score"]}
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>
			</main>

			<Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
				<SheetContent className="w-full md:w-[600px] sm:max-w-none">
					<CaseDetailPanel
						caseRecord={selectedCase}
						onCaseUpdate={handleCaseUpdate}
						onClose={() => setIsSheetOpen(false)}
					/>
				</SheetContent>
			</Sheet>
		</>
	);
}

function App() {
	return (
		<Auth>
			<Dashboard />
		</Auth>
	);
}

export default App;
