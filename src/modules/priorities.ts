import { defineStore } from "pinia";
import axios from "axios";
import { ApiResponse } from "@/types/utils.types";
import { Priority } from "@/types/priorities.types";


export const usePrioritiesStore = defineStore({
  id: "priorities",
  state: () => ({
    priorities: [] as Priority[],
  }),
  actions: {
    async setPriorities(): Promise<Priority[]> {
      try {
        const response = await axios.get<ApiResponse<Priority[]>>("priorities");
        this.priorities = response.data.data;
        return response.data.data;
      } catch (error) {
        throw error;
      }
    },
  },
  getters: {
    getPriorities: (state) => state.priorities,
  },
});
