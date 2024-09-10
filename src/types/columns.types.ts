import { Task } from "./index";

export interface Column {
    id: number;
    column_name: string;
    swimlane_id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    tasks: Task[];
  }