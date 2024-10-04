import { User } from "./users.types";

export interface TeamMember {
    id: number;
    user_id: number;
    project_id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    user: User;
}

export interface TeamMemberStoreTypes {
    project_id: number,
    user_id: number
}

export interface TeamMemberCheckboxType {
    user_id: number[]
}