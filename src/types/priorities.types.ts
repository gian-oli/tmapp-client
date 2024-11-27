export interface Priority {
    id: number;
    priority_name: string;
    created_at?: string; // Use `string` if you are working with ISO date strings
    updated_at?: string; // Same as above
    deleted_at?: string | null; // `null` if the field can be null
}