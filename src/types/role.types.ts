export interface Role {
    id: number;
    role_name: string;
    created_at: EpochTimeStamp;
    updated_at: EpochTimeStamp;
    deleted_at: EpochTimeStamp | null;
}