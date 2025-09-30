// src/components/CaseDetailPanel.tsx

import { useState } from "react";
import type { AirtableRecord, CaseStatus } from "@/types/case";
import { updateCaseStatus } from "@/services/airtableService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import {
	SheetHeader,
	SheetTitle,
	SheetDescription,
	SheetFooter,
	SheetClose,
} from "@/components/ui/sheet";

// Reusable component for status badges
const StatusBadge = ({ status }: { status: CaseStatus }) => {
	const statusStyles: Record<CaseStatus, string> = {
		New: "bg-blue-500 hover:bg-blue-600",
		"Under Investigation": "bg-yellow-500 hover:bg-yellow-600",
		"Closed - Fraud": "bg-red-500 hover:bg-red-600",
		"Closed - Legitimate": "bg-green-500 hover:bg-green-600",
	};
	return (
		<Badge className={`${statusStyles[status]} text-white shadow-sm`}>
			{status}
		</Badge>
	);
};

interface CaseDetailPanelProps {
	caseRecord: AirtableRecord | null;
	onCaseUpdate: (updatedRecord: AirtableRecord) => void;
	onClose: () => void;
}

export function CaseDetailPanel({
	caseRecord,
	onCaseUpdate,
	onClose,
}: CaseDetailPanelProps) {
	const [isUpdating, setIsUpdating] = useState<CaseStatus | null>(null);

	const handleStatusChange = async (newStatus: CaseStatus) => {
		if (!caseRecord) return;
		setIsUpdating(newStatus);
		toast.info(`Updating status to "${newStatus}"...`);

		try {
			const updatedRecord = await updateCaseStatus(caseRecord.id, newStatus);
			onCaseUpdate(updatedRecord);
			toast.success(`Case status successfully updated!`);
			onClose();
		} catch (error) {
			toast.error("Failed to update status. Please try again.");
		} finally {
			setIsUpdating(null);
		}
	};

	if (!caseRecord) return null;

	const { fields } = caseRecord;

	return (
		<>
			<SheetHeader className="text-left">
				<SheetTitle className="text-2xl">{fields["Case ID"]}</SheetTitle>
				<SheetDescription>
					Detailed view of the transaction and customer profile.
				</SheetDescription>
			</SheetHeader>

			{/* Main content area with padding and spacing */}
			<div className="py-6 space-y-6">
				{/* --- Customer Profile Group --- */}
				<div className="space-y-3">
					<h4 className="font-semibold text-muted-foreground">
						Customer Profile
					</h4>
					{/* The 'flex justify-between' is the key to clean alignment */}
					<div className="flex justify-between items-center text-sm">
						<span>Customer</span> <strong>{fields["Customer Name"]}</strong>
					</div>
					<div className="flex justify-between items-center text-sm">
						<span>Status</span> <StatusBadge status={fields.Status} />
					</div>
					<div className="flex justify-between items-center text-sm">
						<span>Internal ID</span>{" "}
						<code className="text-xs">{fields["Customer ID"]}</code>
					</div>
				</div>
				<Separator />

				{/* --- Risk Profile Group --- */}
				<div className="space-y-3">
					<h4 className="font-semibold text-muted-foreground">Risk Profile</h4>
					<div className="flex justify-between items-center">
						<span className="text-sm">Risk Score</span>
						<strong className="text-2xl font-bold text-red-600">
							{fields["Risk Score"]}
						</strong>
					</div>
					<div className="text-sm space-y-1">
						<span className="text-muted-foreground">Reasons</span>
						<p className="font-semibold text-sm pl-2 border-l-2">
							{fields["Risk Reasons"]}
						</p>
					</div>
				</div>
				<Separator />

				{/* --- Transaction Details Group --- */}
				<div className="space-y-3">
					<h4 className="font-semibold text-muted-foreground">
						Transaction Details
					</h4>
					<div className="flex justify-between items-center">
						<span className="text-sm">Amount</span>
						<strong className="text-lg">
							{fields["Transaction Amount"]?.toLocaleString()} NGN
						</strong>
					</div>
					<div className="flex justify-between items-center text-sm">
						<span>Country</span>
						<strong>{fields["Transaction Country"]}</strong>
					</div>
				</div>
			</div>

			<SheetFooter className="mt-auto">
				<SheetClose asChild>
					<Button variant="outline">Cancel</Button>
				</SheetClose>
				<Button
					className="bg-green-600 hover:bg-green-700 text-white"
					size="sm"
					disabled={!!isUpdating}
					onClick={() => handleStatusChange("Closed - Legitimate")}
				>
					{isUpdating === "Closed - Legitimate" ? (
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					) : null}
					Approve
				</Button>
				<Button
					variant="secondary"
					size="sm"
					disabled={!!isUpdating}
					onClick={() => handleStatusChange("Under Investigation")}
				>
					{isUpdating === "Under Investigation" ? (
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					) : null}
					Investigate
				</Button>
				<Button
					variant="destructive"
					size="sm"
					disabled={!!isUpdating}
					onClick={() => handleStatusChange("Closed - Fraud")}
				>
					{isUpdating === "Closed - Fraud" ? (
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					) : null}
					Confirm Fraud
				</Button>
			</SheetFooter>
		</>
	);
}
