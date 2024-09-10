import { defineStore } from "pinia";
import axios from "axios";
import { ApiResponse } from "@/types/utils.types";
import { Statuses } from "@/types/statuses.types";


export const useStatusesStore = defineStore({
  id: "statuses",
  state: () => ({
    statuses: [] as Statuses[],
  }),
  actions: {
    async setStatuses(): Promise<Statuses[]> {
      try {
        const response = await axios.get<ApiResponse<Statuses[]>>("statuses");
        this.statuses = response.data.data;
        return response.data.data;
      } catch (error) {
        throw error;
      }
    },
  },
  getters: {
    getStatuses: (state) => state.statuses,
  },
});
