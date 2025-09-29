import axios from 'axios';
import type { AirtableRecord } from '@/types/case';

// Retrieve Airtable credentials from environment variables.
const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
const TABLE_ID = import.meta.env.VITE_AIRTABLE_TABLE_ID;
const PAT = import.meta.env.VITE_AIRTABLE_PAT;

// Create an Axios instance configured to interact with the Airtable API.
const airtableApi = axios.create({
    // Set the base URL for the Airtable API endpoint.
    baseURL: `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`,
    // Define the authorization header to use the Personal Access Token (PAT).
    headers: {
        Authorization: `Bearer ${PAT}`,
    },
});

// Define a function to fetch new cases from Airtable.
export const getNewCases = async (): Promise<AirtableRecord[]> => {
    try {
        // Use the Airtable API to retrieve records from the specified table.
        const response = await airtableApi.get('/', {
            // Specify parameters to filter and sort the records.
            params: {
                // Filter records to only include those with a "New" status.
                filterByFormula: '{Status} = "New"',
                // Sort records by the "Received At" field in descending order.
                sort: [{ field: 'Received At', direction: 'desc' }],
            },
        });
        // Return the records from the response data.
        return response.data.records;
    } catch (error) {
        console.error("Failed to fetch new cases from Airtable:", error);
        return []; // return an empty array on failure
    }
};