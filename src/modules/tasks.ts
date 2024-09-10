import { defineStore } from "pinia";
import axios from "axios";
import { ApiResponse, TasksFormTypes } from "@/types";
import { apiCall } from "@/utils/api-call";


export const useTasksStore = defineStore({
  id: "tasks",
  state: () => ({}),
  actions: {
    async setTaskStore(data: TasksFormTypes) {
      return apiCall(async () => {
        const response = axios.post<ApiResponse<TasksFormTypes>>(
          "tasks",
          data
        );
        return response;
      })
    },
    async updateTask(data: TasksFormTypes, id: number) {
      return apiCall(async () => {
        const response = await axios.put<ApiResponse<TasksFormTypes>>(
          `tasks/${id}`,
          data
        );
        return response;
      })
    }
  },
  getters: {},
});
