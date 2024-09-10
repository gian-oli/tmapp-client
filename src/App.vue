<script setup lang="ts">
import { computed, provide, onMounted, onUnmounted } from 'vue';
import { useUsersStore, usePrioritiesStore, useStatusesStore, useLoginStore, useLoadingStore, useProjectsStore } from './modules';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const route = useRoute();
const userStore = useUsersStore();
const priorityStore = usePrioritiesStore();
const statusStore = useStatusesStore();
const loginStore = useLoginStore();
const loadingStore = useLoadingStore();
const projectStore = useProjectsStore();

// Provide computed store values to the app
const users = computed(() => userStore.getUsers);
const priorities = computed(() => priorityStore.getPriorities);
const statuses = computed(() => statusStore.getStatuses);
const profile = computed(() => loginStore.getProfile);

provide('users', users);
provide('priorities', priorities);
provide('statuses', statuses);
provide('profile', profile);

// Escape key listener function
const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && loadingStore.isLoading && loadingStore.isCancelableRequest) {
    projectStore.triggerStop();
  }
};

// Fetch data and handle token validation
const fetchInitialData = async () => {
  const accessToken = sessionStorage.getItem('access_token');
  if (!accessToken && route.name !== 'Login') {
    router.push({ name: 'Login' });
    return;
  }

  axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

  try {
    const response = await loginStore.setProfile();
    if (response?.token) {
      sessionStorage.setItem('access_token', response.token);
      await userStore.setUsers();
      await priorityStore.setPriorities();
      await statusStore.setStatuses();
    } else {
      console.log('No token found in profile response. Redirecting to Login.');
      router.push({ name: 'Login' });
    }
  } catch (error) {
    console.error('Error fetching profile or other data:', error);
    router.push({ name: 'Login' });
  }
};

onMounted(async () => {
  await fetchInitialData();
  window.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscape);
});

router.beforeEach(async (to, _, next) => {
  loadingStore.setLoading(true);

  const accessToken = sessionStorage.getItem('access_token');

  if (to.name === 'Login') {
    if (!accessToken) {
      loadingStore.setLoading(false);
      next();
      return;
    } else {
      next({ name: 'Dashboard' });
      return;
    }
  }

  if (!accessToken) {
    loadingStore.setLoading(false);
    next({ name: 'Login' });
    return;
  }

  axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  
  try {
    const response = await loginStore.setProfile();
    if (response?.token) {
      sessionStorage.setItem('access_token', response.token);
      next();
    } else {
      next({ name: 'Login' });
    }
  } catch (error) {
    next({ name: 'Login' });
  } finally {
    loadingStore.setLoading(false);
  }
});
</script>

<template>
  <div v-if="loadingStore.isLoading" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
    <div class="relative flex items-center justify-center">
      <div class="pendulum w-pendulum-size h-pendulum-size bg-blue-600 rounded-full absolute flex flex-col justify-end top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 origin-custom animate-pendulum">
        <p class="font-extrabold text-white">tmapp_</p>
      </div>
      <button v-if="loadingStore.isCancelableRequest && route.name == 'Projects'" 
              @click="projectStore.triggerStop()" 
              class="mt-40 rounded-md text-sm py-2 px-4 animate-pulse text-white italic">
        Press Esc to cancel Request
      </button>
    </div>
  </div>
  <router-view></router-view>
</template>
