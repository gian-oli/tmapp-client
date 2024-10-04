import { defineStore } from "pinia";
import axios from "axios";
import { ApiResponse, Task, TasksFormTypes } from "@/types";
import { apiCall } from "@/utils/api-call";

export const useTasksStore = defineStore({
  id: "tasks",
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
    async storeTask(data: TasksFormTypes) {
      return apiCall(
        async () => {
          const response = axios.post<ApiResponse<TasksFormTypes>>(
            "tasks",
            data
          );
          return response;
        },
        () => this.stopRequests
      );
    },
    async updateTask(data: TasksFormTypes, id: number) {
      return apiCall(
        async () => {
          const response = await axios.put<ApiResponse<TasksFormTypes>>(
            `tasks/${id}`,
            data
          );
          return response;
        },
        () => this.stopRequests,
        2000
      );
    },
    async batchTaskStore(data: {tasks: TasksFormTypes[]}){
      return apiCall(
        async () => {
          const response = await axios.post<ApiResponse<TasksFormTypes[]>>(
            "batch-tasks",
            data
          );
          return response;
        },
        () => this.stopRequests,
        1000
      );
    },
    async backlogToReady(swimlane_id: number, column_id: number){
      return apiCall(
        async () => {
          const response = await axios.put<ApiResponse<number[]>>(`backlog-to-ready/${swimlane_id}/${column_id}`)
          return response
        },
        () => this.stopRequests,
        2000
      )
    },
    async nextColumn(swimlane_id: number , task_id: number) {
      return apiCall(
        async () => {
          const response = await axios.put<ApiResponse<Task>>(`next-column/${swimlane_id}/${task_id}`)
          return response
        },
        () => this.stopRequests,
        500
      )
    },
    async previousColumn(swimlane_id: number , task_id: number) {
      return apiCall(
        async () => {
          const response = await axios.put<ApiResponse<Task>>(`previous-column/${swimlane_id}/${task_id}`)
          return response
        },
        () => this.stopRequests,
        500
      )
    }
  },
  getters: {},
});
