import { defineStore } from "pinia";
import axios from "axios";
import { User } from "@/types/users.types";
import { ApiResponse } from "@/types/utils.types";
import { apiCall } from "@/utils/api-call";

export const useUsersStore = defineStore({
  id: "users",
  state: () => ({
    users: [] as User[],
    user: {} as User,
  }),
  actions: {
    async setUsers(): Promise<User[]> {
      try {
        const response = await axios.get<ApiResponse<User[]>>("users");
        this.users = response.data.data;
        return response.data.data;
      } catch (error) {
        throw error;
      }
    },
    async addUsers(payload: {
      username: string;
      email: string;
      password: string;
      password_confirmation: string;
      role_id: number | string;
    }): Promise<User> {
      return apiCall(async () => {
        const result = await axios.post<ApiResponse<User>>("register", payload);
        return result.data.data;
      });
    },
  },
  getters: {
    getUsers: (state) => state.users,
  },
});
