import { ApiResponse, GanttChart, Schedule } from "@/types";
import { ActualDates, PlanDates } from "@/types/schedule.types";
import { apiCall } from "@/utils/api-call";
import axios from "axios";
import { defineStore } from "pinia";

export const useGanttChartStore = defineStore({
  id: "",
  state: () => ({
    ganttChart: [] as GanttChart[],
  }),
  actions: {
    async loadGanttCharts(): Promise<GanttChart[]> {
      return apiCall(async (controller) => {
        const response = await axios.get<ApiResponse<GanttChart[]>>(
          "gantt-chart",
          {
            signal: controller.signal,
          }
        );
        this.ganttChart = response.data.data;
        return response.data.data;
      });
    },
    async storeGanttChart(form: {
      name: string;
      date_from: string;
      date_to: string;
    }): Promise<GanttChart> {
      return apiCall(async (controller) => {
        const result = await axios.post<ApiResponse<GanttChart>>(
          "gantt-chart",
          form,
          {
            signal: controller.signal,
          }
        );
        return result.data.data;
      });
    },
    async storeSchedule(form: {
      name: string;
      user_id: string;
      status: string;
      gantt_chart_id: number;
    }): Promise<Schedule> {
      return apiCall(async (controller) => {
        const result = await axios.post<ApiResponse<Schedule>>(
          "schedule",
          form,
          {
            signal: controller.signal,
          }
        );
        return result.data.data;
      });
    },
    async storePlanDate(payload: {
      date: string;
      time_spent: number;
      schedule_id: number | string;
    }): Promise<PlanDates> {
      return apiCall(async (controller) => {
        const result = await axios.post<ApiResponse<PlanDates>>(
          "plan-date",
          payload,
          {
            signal: controller.signal,
          }
        );
        return result.data.data;
      });
    },
    async deletePlanDate(id: number): Promise<PlanDates> {
      return apiCall(async (controller) => {
        const result = await axios.delete<ApiResponse<PlanDates>>(
          `plan-date/${id}`,
          {
            signal: controller.signal,
          }
        );
        return result.data.data;
      });
    },
    async storeActualDate(payload: {
      date: string;
      time_spent: number;
      schedule_id: number;
    }): Promise<ActualDates> {
      return apiCall(async (controller) => {
        const result = await axios.post<ApiResponse<ActualDates>>(
          "actual-date",
          payload,
          {
            signal: controller.signal,
          }
        );
        return result.data.data;
      });
    },
    // async editActualDate(payload: {
    //   date: string;
    //   note: string;
    //   time_spent: number;
    //   schedule_id: number;
    // }): Promise<ActualDates> {
    //   return apiCall(async (controller) => {
    //     const result = await axios.put<ApiResponse<ActualDates>>(
    //       `actual-date/${payload.schedule_id}`,
    //       payload,
    //       {
    //         signal: controller.signal,
    //       }
    //     );
    //     return result.data.data;
    //   });
    // },
    async deleteActualDate(id: number): Promise<ActualDates> {
      return apiCall(async (controller) => {
        const result = await axios.delete<ApiResponse<ActualDates>>(
          `actual-date/${id}`,
          {
            signal: controller.signal,
          },
        );
        return result.data.data;
      });
    },
    async updateSchedule(
      id: number,
      data: { status?: string, percent_completed?: number }
    ): Promise<Schedule> {
      return apiCall(async () => {
        const result = await axios.put<ApiResponse<Schedule>>(
          `schedule/${id}`,
          data
        );
        return result.data.data;
      });
    },
    async updatePlanDates(
      id: number,
      data: { dates: string[]}
    ): Promise<PlanDates[]> {
      return apiCall(async () => {
        const result = await axios.put<ApiResponse<PlanDates[]>>(
          `plan-date/${id}`,
          data
        );
        return result.data.data;
      });
    },
    async updateActualDates(
      id: number,
      data: { dates: string[]}
    ): Promise<ActualDates[]> {
      return apiCall(async () => {
        const result = await axios.put<ApiResponse<ActualDates[]>>(
          `actual-date/${id}`,
          data
        );
        return result.data.data;
      });
    }
  },
  getters: {
    getGanttCharts: (state) => state.ganttChart,
  },
});
