import { defineStore } from "pinia";
import axios from "axios";
import { User } from "@/types/users.types";
import { ApiResponse } from "@/types/utils.types";

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
        throw error
      }
    },
  },
  getters: {
    getUsers: (state) => state.users,
  },
});
