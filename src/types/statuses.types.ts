export interface Statuses {
    id: number;
    status: 'Pending' | 'Ongoing' | 'Finished';
    created_at: string;  // ISO 8601 date string
    updated_at: string;  // ISO 8601 date string
    deleted_at: string | null;  // ISO 8601 date string or null
}