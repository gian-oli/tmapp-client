<script setup lang="ts">
// import { format } from 'date-fns';
import { useRoute } from 'vue-router';
// import { AnOutlinedPlusSquare } from '@kalimahapps/vue-icons';
import { inject, onMounted, provide, ref, watch } from 'vue';

import { Project } from '@/types';
import { ProjectDetails } from '@/components/projects';
// import { Button, Modal } from '@/components/utilities';
import { useUsersStore, usePrioritiesStore, useStatusesStore, useProjectsStore } from '@/modules';
import { ToastService } from '@/components/utilities/Toast/useToast';

const projectStore = useProjectsStore();
const userStore = useUsersStore();
const priorityStore = usePrioritiesStore();
const statusStore = useStatusesStore();
const route = useRoute();

// const showProjectStoreModal = ref(false);
const showTaskStoreModal = ref(false);

/** Project form */
// const initialProjectFormState: ProjectFormTypes = {
//   user_id: '',
//   project_name: '',
//   project_type: 'Development',
//   deadline: format(new Date(), 'yyyy-MM-dd'),
//   priority_id: 1,
//   status_id: 1,
// };
// const post_project_form = ref<ProjectFormTypes>({ ...initialProjectFormState });

/** Viewing */
const stateViewProject = ref<Project>();

const viewProject = (data: Project) => {
  stateViewProject.value = data;
};

const toggleTasksStoreModal = () => {
  showTaskStoreModal.value = true;
};

/** Storing new Projects */
// const storeProject = async () => {
//   try {
//     const response = await projectStore.setProjectStore(post_project_form.value);
//     if (response) {
//       projectStore.setProjects();
//       post_project_form.value = { ...initialProjectFormState };
//       showProjectStoreModal.value = false;
//     }
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

/** Watching the state view project movement, updates design */
watch(stateViewProject, async (newValue) => {
  if (newValue) {
    await projectStore.setSingleProject(newValue.id).then((res) => console.log(res));
  }
});

watch(route, () => {
  projectStore.setSingleProject(stateViewProject.value?.id);
});

provide('stateViewProject', stateViewProject);

const toast = inject<ToastService>('toast')

/** Initialized page */
onMounted(() => {
  projectStore.setProjects();
  userStore.setUsers();
  priorityStore.setPriorities();
  statusStore.setStatuses();
  if(projectStore.getProjects && userStore.getUsers && priorityStore.getPriorities && statusStore.getStatuses){
    toast?.success('Successfully load all required data.', 'Success', 3000)
  }
});
</script>

<template>
    <!-- Header -->
    <div
      class="flex items-center justify-between mb-4 p-3 bg-blue-100 text-blue-700 font-semibold rounded-lg shadow-sm w-fit">
      <span>Projects Overview</span>
    </div>

    <!-- Content Layout -->
    <div class="flex gap-6 h-full">
      <!-- Project List -->
      <div class="flex-shrink-0 w-80 h-[80vh] overflow-y-auto bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
        <h3 class="font-semibold text-gray-600 text-center mb-3 w-">Project List</h3>
        <div v-if="projectStore.getProjects.length > 0">
          <div v-for="project in projectStore.getProjects" :key="project.id" :class="`p-3 my-1 cursor-pointer rounded-lg transition-colors duration-200 ${stateViewProject?.id === project.id ? 'bg-blue-100 border-l-4 border-blue-300' : 'hover:bg-blue-50'
            }`" @click="viewProject(project)">
            <p class="font-medium text-gray-800">{{ project.project_name }}</p>
            <p class="text-xs text-gray-500">{{ project.project_type }}</p>
            <p class="text-xs text-gray-400 mt-1">Deadline: {{ project.deadline || 'No deadline' }}</p>
          </div>
        </div>
        <p v-else class="text-center text-gray-500 font-medium py-4">No projects available at the moment.</p>
      </div>

      <!-- Project Details Section -->
      <div class="flex-grow h-[calc(100vh-200px)] overflow-hidden bg-white rounded-lg border border-gray-200 shadow-sm">
        <ProjectDetails :toggle-ticket-store-modal="toggleTasksStoreModal" v-if="stateViewProject" />
        <div v-else class="text-center font-medium space-y-2 flex flex-col justify-center items-center mt-20 text-gray-400">
          <img src="@/assets/no-items-found.png" class="size-80" />
          <p>No project selected</p>
        </div>
      </div>
    </div>

    <!-- Project Store Modal Component -->
    <!-- <Modal :visible="showProjectStoreModal" @update:visible="showProjectStoreModal = $event">
      <ProjectModal :post_project_form="post_project_form" :storeProject="storeProject" />
    </Modal> -->
</template>

<style scoped>
/* Custom Light Blue Background */
.bg-blue-50 {
  background-color: #f0f9ff;
}

.bg-blue-100 {
  background-color: #dbeafe;
}
</style>
