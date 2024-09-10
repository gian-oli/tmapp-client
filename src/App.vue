<script setup lang="ts">
import { computed, provide, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import { useUsersStore, usePrioritiesStore, useStatusesStore, useLoginStore, useLoadingStore, useProjectsStore } from './modules';

const router = useRouter();
const route = useRoute();
const userStore = useUsersStore();
const priorityStore = usePrioritiesStore();
const statusStore = useStatusesStore();
const loginStore = useLoginStore();
const loadingStore = useLoadingStore();
const projectStore = useProjectsStore();

// Provide computed values
provide('users', computed(() => userStore.getUsers));
provide('priorities', computed(() => priorityStore.getPriorities));
provide('statuses', computed(() => statusStore.getStatuses));
provide('profile', computed(() => loginStore.getProfile));

// Fetch and initialize data on component mount
onMounted(async () => {
  const token = sessionStorage.getItem('access_token');
  if (!token && route.name !== 'Login') return router.push({ name: 'Login' });

  axios.defaults.headers.common.Authorization = `Bearer ${token}`;

  try {
    const response = await loginStore.setProfile();
    if (response?.token) {
      sessionStorage.setItem('access_token', response?.token);
      await Promise.all([
        userStore.setUsers(),
        priorityStore.setPriorities(),
        statusStore.setStatuses()
      ]);
    } else {
      router.push({ name: 'Login' });
    }
  } catch {
    router.push({ name: 'Login' });
  }

  window.addEventListener('keydown', handleEscape);
  onUnmounted(() => window.removeEventListener('keydown', handleEscape));
});

// Escape key listener for canceling requests
const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && loadingStore.isLoading && loadingStore.isCancelableRequest) {
    projectStore.triggerStop();
  }
};

// Route guard: verify profile on each navigation
router.beforeEach(async (to, _, next) => {
  loadingStore.setLoading(true);
  const token = sessionStorage.getItem('access_token');

  if (to.name === 'Login' && token) return next({ name: 'Dashboard' });
  if (!token) return next({ name: 'Login' });

  axios.defaults.headers.common.Authorization = `Bearer ${token}`;

  try {
    const response = await loginStore.setProfile();
    if (response?.token) sessionStorage.setItem('access_token', response?.token);
    next();
  } catch {
    next({ name: 'Login' });
  } finally {
    loadingStore.setLoading(false);
  }
});
</script>

<template>
 <div v-if="loadingStore.isLoading" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
    <!-- Coffee container -->
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
