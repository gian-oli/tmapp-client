import { defineStore } from "pinia";
import axios from "axios";
import { ApiResponse, LoginForm, LoginResponseType, Profile } from "@/types";

export const useLoginStore = defineStore({
  id: "login",
  state: () => ({
    profile: {} as Profile,
  }),
  actions: {
    async setLogin(data: LoginForm) {
      const result = await axios.post<ApiResponse<LoginResponseType>>("login", data);
      return result.data
    },
    async setProfile() {
      const accessToken = sessionStorage.getItem("access_token");
      try {
        const response = await axios.get<ApiResponse<Profile>>("user", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        this.profile = response.data.data;
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
  },
  getters: {
    getProfile: (state) => state.profile,
  },
});
