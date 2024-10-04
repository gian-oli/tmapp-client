<script setup lang="ts">
import { computed, provide, watch } from "vue";
import {
  useUsersStore,
  usePrioritiesStore,
  useStatusesStore,
  useLoginStore,
  useLoadingStore,
  useProjectsStore,
  useSwimlaneStore,
  useTasksStore,
  useRoleStore,
} from "./modules";
import { useRouter } from "vue-router";
import axios from "axios";
import { HeOutlineStop } from "@kalimahapps/vue-icons";

const router = useRouter();
const userStore = useUsersStore();
const priorityStore = usePrioritiesStore();
const statusStore = useStatusesStore();
const loginStore = useLoginStore();
const loadingStore = useLoadingStore();
const projectStore = useProjectsStore();
const swimlaneStore = useSwimlaneStore();
const taskStore = useTasksStore();
const roleStore = useRoleStore();

// Provide computed store values to the app
const users = computed(() => userStore.getUsers);
const priorities = computed(() => priorityStore.getPriorities);
const statuses = computed(() => statusStore.getStatuses);
const profile = computed(() => loginStore.getProfile);
const isLoading = computed(() => loadingStore.isLoading);
const role = computed(() => roleStore.getRoles)

provide("users", users);
provide("priorities", priorities);
provide("statuses", statuses);
provide("profile", profile);
provide("roles", role);

// Escape key listener function
const handleEscape = (event: KeyboardEvent) => {
  if (
    event.key === "Escape" &&
    loadingStore.isLoading &&
    loadingStore.isCancelableRequest
  ) {
    projectStore.triggerStop();
    swimlaneStore.triggerStop();
    taskStore.triggerStop();
    window.removeEventListener("keydown", handleEscape);
  }
};

router.beforeEach(async (to, _, next) => {
  if (loadingStore.isLoading) {
    return; // Prevent navigation while loading
  }

  loadingStore.setLoading(true);

  const accessToken = sessionStorage.getItem("access_token");

  if (to.name === "Register") {
    loadingStore.setLoading(false);
    return next(); // Allow navigation to Register
  }

  if (to.name === "Login") {
    if (!accessToken) {
      loadingStore.setLoading(false);
      return next(); // Proceed to login if no token
    } else {
      loadingStore.setLoading(false);
      return next({ name: "Dashboard" }); // Redirect if already logged in
    }
  }

  if (!accessToken) {
    loadingStore.setLoading(false);
    return next({ name: "Login" }); // Redirect to login if no token
  }

  axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

  try {
    const response = await loginStore.setProfile();
    if (response?.token) {
      sessionStorage.setItem("access_token", response.token);
      return next(); // Proceed if token is valid
    } else {
      sessionStorage.removeItem("access_token");
      return next({ name: "Login" }); // Redirect to login if token is invalid
    }
  } catch (error) {
    console.log("Error fetching profile:", error);
    return next({ name: "Login" }); // Redirect to login on error
  } finally {
    loadingStore.setLoading(false);
  }
});


watch(
  () => isLoading.value,
  (newval) => {
    if (newval) {
      window.addEventListener("keydown", handleEscape);
    } else {
      window.removeEventListener("keydown", handleEscape);
      projectStore.resetStop();
      swimlaneStore.resetStop();
      taskStore.resetStop();
    }
  }
);
</script>

<template>
  <div v-if="loadingStore.isLoading" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
    <div class="relative flex items-center justify-center">
      <div
        class="pendulum w-pendulum-size h-pendulum-size bg-blue-600 rounded-full absolute flex flex-col justify-end top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 origin-custom animate-pendulum">
        <p class="font-extrabold text-white">tmapp_</p>
      </div>
      <button v-if="loadingStore.isCancelableRequest" class="mt-40 rounded-md text-sm py-2 px-4 animate-pulse">
        <p v-if="projectStore.stopRequests || swimlaneStore.stopRequests"
          class="text-lg animate-pulse text-red-800 flex items-center gap-1 bg-white font-extrabold p-2 rounded">
          <HeOutlineStop class="size-5" />Request Aborted
        </p>
        <p v-else>Press Esc to cancel Request</p>
      </button>
    </div>
  </div>
  <router-view></router-view>
</template>
