import { Column } from "./columns.types";

export interface Swimlane {
    id: number;
    swimlane_name: string;
    project_id: number;
    created_at: string;
    updated_at: string;
    columns: Column[];
  }