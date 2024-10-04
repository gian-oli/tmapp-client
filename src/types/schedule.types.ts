import { Project } from "./projects.types";
import { User } from "./users.types";

export interface PlanDates {
    id: number;
    date: string;
    time_spent: number;
}

export interface ActualDates {
    id: number;
    date: string;
    note: string;
    time_spent: number;
}


export interface Schedule {
    id: number;
    name: string;
    status: string;
    user_id: number;
    gantt_chart_id: number;
    percent_completed: string | null;
    plan_dates: PlanDates[] | [];
    actual_dates: ActualDates[] | [];
    projects?: Project[] | null;
    users: User[];
    [key: string]: any;
  }