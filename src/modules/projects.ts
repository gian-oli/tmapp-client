import { defineStore } from "pinia";
import axios from "axios";
import { Project, ProjectFormTypes } from "@/types/projects.types";
import { ApiResponse } from "@/types/utils.types";
import { apiCall } from "@/utils/api-call";

export const useProjectsStore = defineStore({
  id: "projects",
  state: () => ({
    projects: [] as Project[],
    singleProject: {} as Project,
    stopRequests: false,
  }),
  actions: {
    triggerStop() {
      this.stopRequests = true;
    },

    resetStop() {
      this.stopRequests = false;
    },

    async reloadData() {
      // Reload the projects and other related data
      await this.setProjects();
      // Optionally add other related functions here if needed

      this.resetStop(); // Reset the stopRequests flag to allow new requests
    },

    async setProjects(): Promise<Project[]> {
      // GET requests do not need cancellation logic
      return apiCall(async () => {
        const response = await axios.get<ApiResponse<Project[]>>("projects");
        this.projects = response.data.data;
        return response.data.data;
      });
    },

    async setProjectStore(data: ProjectFormTypes): Promise<Project> {
      // Apply cancellation logic for POST request
      return apiCall(
        async (controller) => {
          const response = await axios.post<ApiResponse<Project>>(
            "projects",
            data,
            {
              signal: controller.signal, // Pass the abort signal to axios
            }
          );
          return response.data.data;
        },
        () => this.stopRequests,
        1000 // Optional delay
      );
    },

    async updateProject(id: number, data: ProjectFormTypes): Promise<Project> {
      // Apply cancellation logic for PUT request
      return apiCall(
        async (controller) => {
          const response = await axios.put<ApiResponse<Project>>(
            `projects/${id}`,
            data,
            {
              signal: controller.signal,
            }
          );
          return response.data.data;
        },
        () => this.stopRequests
      );
    },

    async deleteProject(id: number): Promise<void> {
      // Apply cancellation logic for DELETE request
      return apiCall(
        async (controller) => {
          await axios.delete<ApiResponse<void>>(`projects/${id}`, {
            signal: controller.signal,
          });
        },
        () => this.stopRequests
      );
    },

    async setSingleProject(
      id: number | undefined | null
    ): Promise<Project | "No ID Validation Error"> {
      if (id == undefined || id == null) {
        return "No ID Validation Error";
      }
      // GET request does not need cancellation logic
      return apiCall(
        async (controller) => {
          const response = await axios.get<ApiResponse<Project>>(
            `show-project-full/${id}`,
            {
              signal: controller.signal,
            }
          );
          this.singleProject = response.data.data;
          return response.data.data;
        },
        () => false // No cancellation needed
      );
    },
  },
  getters: {
    getProjects: (state) => state.projects,
    getSingleProject: (state) => state.singleProject,
  },
});
