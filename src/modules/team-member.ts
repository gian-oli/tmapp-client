import { defineStore } from "pinia";
import axios from "axios";
import { ApiResponse } from "@/types/utils.types";
import { TeamMember } from "@/types/team-members.types";
import { apiCall } from "@/utils/api-call";


export const useTeamMembersStore = defineStore({
  id: "team-members",
  state: () => ({
  }),
  actions: {
    async storeTeamMember(data: {
      user_id: number;
      project_id: number;
    }): Promise<TeamMember | "No Id Validation Error"> {
      return apiCall(async () => {
        const response = await axios.post<ApiResponse<TeamMember>>('team-members', data)
        return response.data.data
      })
    },
  },
  getters: {
  },
});
