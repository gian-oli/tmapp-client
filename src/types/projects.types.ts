import { Task, User, TeamMember, Swimlane, Statuses, Priority } from "./index";

// Define the Comment interface
export interface Comment {
  id: number;
  comment: string;
  task_id: number;
  user_id: number;
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
  deleted_at: string | null; // ISO 8601 date string or null
}


// Define the Project interface
// export interface Project {
//   id: number;
//   project_name: string;
//   deadline: string; // ISO 8601 date string
//   project_manager_id: number;
//   project_manager: string;
//   project_manager_email: string;
//   priority_id: number;
//   members_count: number;
//   members: TeamMember[]
//   project_priority: string;
//   status_id: number;
//   status: string;
//   team_tasks: TeamTasks;
//   finished_at: string | null
// }

export interface Project {
  id: number;
  project_name: string;
  deadline: string;
  finished_at: string | null;
  user_id: number;
  priority_id: number;
  status_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  manager: User;
  swimlanes: Swimlane[];
  team_members: TeamMember[]; // Assuming team_members can be any type or an empty array
  priorities: Priority;
  statuses: Statuses;
}

export interface ProjectFormTypes {
  user_id: number | string;
  project_name: string;
  deadline: string;
  priority_id: number;
  status_id: number;
}
