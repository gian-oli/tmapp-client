export interface TasksFormTypes {
  title: string;
  description: string;
  due_date: string;
  assigned_by: string;
  priority_id: number;
  user_id: number | null;
  status_id: number;
  project_id: number | null;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  due_date: string;
  finished_at: string | null;
  assigned_by: string;
  user_id: number | null;
  priority_id: number;
  column_id: number;
  comments: Comment[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface TaskArray {
  id: number;
  username: string;
  data: Task[];
  count: number;
}

export interface TaskObject {
  id: number;
  username: string;
  data: { [key: number]: Task };
  count: number;
}

// Define a union type for Task data structure
export type TeamTasksGroup = TaskArray | TaskObject;

// Define the TeamTasks interface
export interface TeamTasks {
  [key: string]: TeamTasksGroup;
}
