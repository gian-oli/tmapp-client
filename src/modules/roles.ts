import { Role } from "@/types";
import { apiCall } from "@/utils/api-call";
import axios from "axios";
import { defineStore } from "pinia";

export const useRoleStore = defineStore({
    id: 'role',
    state: () => ({
        roles: []
    }),
    actions: {
        async loadRoles(): Promise<Role[]> {
            return apiCall(async () => {
                const response = await axios.get('/role')
                this.roles = response.data.data
                return response.data.data
            })
        },
    },
    getters: {
        getRoles: (state) => state.roles
    }
})