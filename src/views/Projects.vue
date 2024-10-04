<script setup lang="ts">
import { format } from 'date-fns';
import { useRoute } from 'vue-router';
import { AnOutlinedPlusSquare } from '@kalimahapps/vue-icons';
import { onMounted, provide, ref, watch } from 'vue';

import { Project, ProjectFormTypes } from '@/types';
import { ProjectDetails, ProjectList, ProjectModal } from '@/components/projects';
import { Button, Modal } from '@/components/utilities';
import { useUsersStore, usePrioritiesStore, useStatusesStore, useProjectsStore } from '@/modules';

const projectStore = useProjectsStore();
const userStore = useUsersStore()
const priorityStore = usePrioritiesStore()
const statusStore = useStatusesStore()
const route = useRoute()

const showProjectStoreModal = ref(false);
const showTaskStoreModal = ref(false)
/**Project form */
const initialProjectFormState: ProjectFormTypes = {
  user_id: '',
  project_name: '',
  project_type: 'Development',
  deadline: format(new Date(), 'yyyy-MM-dd'),
  priority_id: 1,
  status_id: 1
};
const post_project_form = ref<ProjectFormTypes>({
  ...initialProjectFormState
})
/**Viewing */
const stateViewProject = ref<Project>();

const viewProject = (data: Project) => {
  stateViewProject.value = data;
};

const toggleTasksStoreModal = () => {
  showTaskStoreModal.value = true
}

/**Storing of new Projects */
const storeProject = async () => {
  try {
    const response = await projectStore.setProjectStore(post_project_form.value)
    if (response) {
      projectStore.setProjects()
      post_project_form.value = { ...initialProjectFormState }
      showProjectStoreModal.value = false
    }
    return response
  } catch (error) {
    throw error
  }
}

/**Watching the state view project movement, updates design */
watch(stateViewProject, async (newValue) => {
  if (newValue) {
    await projectStore.setSingleProject(newValue.id).then((res) => console.log(res));
  }
});

watch(route, () => {
    projectStore.setSingleProject(stateViewProject.value?.id)
})

provide('stateViewProject', stateViewProject);

/**Initialized page */
onMounted(() => {
  projectStore.setProjects()
  userStore.setUsers();
  priorityStore.setPriorities();
  statusStore.setStatuses()
});
</script>

<template>
  <div class="h-full overflow-hidden bg-white rounded-sm p-2 text-xs">
    <!-- Project View -->
    <div class="space-y-2 h-full">
      <!-- Project List -->
      <div class="flex gap-2 h-full">
        <div class="h-[60%] ">
          <div
            class="text-xs font-bold uppercase px-1 sticky top-0 bg-blue-500 text-white rounded-t py-1 text-center flex items-center justify-between min-w-80">
            Project List
            <Button @click="showProjectStoreModal = !showProjectStoreModal">
              <AnOutlinedPlusSquare class="text-blue-800 w-5 h-5" />
              <p class="text-blue-800">Add Project</p>
            </Button>
          </div>
          <div v-if="projectStore.getProjects.length > 0" class="min-w-72 max-w-80 overflow-y-auto ">
            <div v-for="project in projectStore.getProjects" :key="project.id"
              :class="`w-full border-l-2 ${project.status_id == 3 ? 'border-red-400' : project.status_id == 2 ? 'border-yellow-400' : 'border-green-400'} `">
              <ProjectList :viewProject="viewProject" :project="project" />
            </div>
          </div>
          <p v-else class="text-center font-medium bg-blue-50 py-1">There's no project at the moment.</p>
        </div>
        <!-- Project Details or No Selection Message -->
        <div class=" h-full w-full overflow-y-auto">
          <ProjectDetails :toggle-ticket-store-modal="toggleTasksStoreModal" v-if="stateViewProject" />
          <!-- @update:user_id="post_task_form.user_id = $event" @update:project_id="post_task_form.project_id = $event" -->
          <p v-else class="text-center font-medium text-xs">No project selected</p>
        </div>
      </div>
    </div>

    <!-- Project Store Modal Component -->
    <Modal :visible="showProjectStoreModal" @update:visible="showProjectStoreModal = $event">
      <ProjectModal :post_project_form="post_project_form" :storeProject="storeProject" />
    </Modal>
  </div>
</template>
