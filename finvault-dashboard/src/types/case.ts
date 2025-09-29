export interface AirtableRecord {
	id: string;
	fields: {
		"Case ID": string;
		Status:
			| "New"
			| "Under Investigation"
			| "Closed - Fraud"
			| "Closed - Legitimate";
		Assignee?: {
			id: string;
			email: string;
			name: string;
		};
		"Risk Score": number;
		"Risk Reason": string;
		"Customer Name": string;
		"Transaction Amount": number;
		"Transaction Country": string;
		"Customer ID": string;
		"Received At": string;
	};
}
