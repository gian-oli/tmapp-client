import { Schedule } from "./schedule.types";

export interface GanttChart {
  id: number;
  name: string;
  status: string | null;
  date_from: string;
  date_to: string;
  percent_completed: string | null;
  schedules?: Schedule[];
}
