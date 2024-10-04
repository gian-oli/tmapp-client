import { ApiResponse, Swimlane } from "@/types";
import { apiCall } from "@/utils/api-call";
import axios from "axios";
import { defineStore } from "pinia";

export const useSwimlaneStore = defineStore({
  id: "swimlane",
  state: () => ({
    stopRequests: false,
  }),
  actions: {
    triggerStop() {
      this.stopRequests = true;
    },
    resetStop() {
      this.stopRequests = false;
    },
    async storeSwimlane(data: {
      swimlane_name?: string;
      project_id: number;
      project_type: string;
    }): Promise<Swimlane> {
      return apiCall(
        async (controller) => {
          const result = await axios.post<ApiResponse<Swimlane>>(
            "swimlane",
            data,
            {
              signal: controller.signal,
            }
          );
          return result.data.data;
        },
        () => this.stopRequests,
        2000
      );
    },
    async deleteSwimlane(id: number): Promise<Swimlane> {
      return apiCall(
        async (controller) => {
          const result = await axios.delete<ApiResponse<Swimlane>>(
            `swimlane/${id}`,
            {
              signal: controller.signal,
            }
          )
          return result.data.data
        },
        () => this.stopRequests,
        3000
      )
    }
  },
  getters: {},
});
