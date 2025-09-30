// src/types/case.ts

// We export this type to make it reusable in other files.
export type CaseStatus = 'New' | 'Under Investigation' | 'Closed - Fraud' | 'Closed - Legitimate';

export interface AirtableRecord {
  id: string; // The unique Airtable Record ID (rec...)
  createdTime: string;
  fields: {
    'Case ID': string; // Our internal transaction_id
    Status: CaseStatus;
    'Risk Score': number;
    'Risk Reasons': 'string';
    'Customer Name': 'string';
    'Transaction Amount': number;
    'Transaction Country': 'string';
    'Customer ID': 'string';
    'Received At': 'string';
  };
}