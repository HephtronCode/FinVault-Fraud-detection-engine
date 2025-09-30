// src/services/airtableService.ts

import axios from 'axios';
import type { AirtableRecord, CaseStatus } from '@/types/case';

// Get credentials securely from environment variables
const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
const TABLE_ID = import.meta.env.VITE_AIRTABLE_TABLE_ID;
const PAT = import.meta.env.VITE_AIRTABLE_PAT;

const airtableApi = axios.create({
  baseURL: `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`,
  headers: {
    Authorization: `Bearer ${PAT}`,
  },
});

/**
 * Fetches all records from the table with a "New" status.
 * @returns A promise that resolves to an array of Airtable records.
 */
export const getNewCases = async (): Promise<AirtableRecord[]> => {
  try {
    const response = await airtableApi.get('/', {
      params: {
        filterByFormula: '{Status} = "New"',
        sort: [{ field: 'Received At', direction: 'desc' }],
      },
    });
    return response.data.records;
  } catch (error) {
    console.error("Failed to fetch new cases from Airtable:", error);
    return []; // Return an empty array on failure
  }
};

/**
 * Updates the 'Status' field of a specific record in Airtable.
 * @param recordId The unique ID of the Airtable record (rec...).
 * @param newStatus The new status to set for the case.
 * @returns A promise that resolves to the fully updated Airtable record.
 */
export const updateCaseStatus = async (recordId: string, newStatus: CaseStatus): Promise<AirtableRecord> => {
  try {
    // Note: We use PATCH to only update specified fields, not the whole record.
    const response = await airtableApi.patch(`/${recordId}`, {
      fields: {
        Status: newStatus,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to update case ${recordId} to status ${newStatus}:`, error);
    // In a real production app, we would implement more robust error handling,
    // like showing a notification to the user.
    throw error;
  }
};