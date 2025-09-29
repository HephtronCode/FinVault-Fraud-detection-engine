// src/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_AIRTABLE_BASE_ID: string;
    readonly VITE_AIRTABLE_TABLE_ID: string;
    readonly VITE_AIRTABLE_PAT: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}