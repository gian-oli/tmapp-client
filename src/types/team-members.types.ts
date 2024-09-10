export interface TeamMember {
    team_member_id: number,
    username: string,
    email: string,
    role: string
}

export interface TeamMemberStoreTypes {
    project_id: number,
    user_id: number
}

export interface TeamMemberCheckboxType {
    user_id: number[]
}