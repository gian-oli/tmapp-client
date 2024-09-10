<script setup lang="ts">
import { format } from 'date-fns';
import { useRoute, useRouter } from 'vue-router';
import { AnOutlinedPlusSquare, BsPencilSquare, AnOutlinedUsergroupAdd, AkTrashCan, AkArrowBackThickFill } from '@kalimahapps/vue-icons';
import { computed, onMounted, provide, ref, watch } from 'vue';

import { Project, ProjectFormTypes, TasksFormTypes } from '@/types';
import { ProjectDetails, ProjectList, ProjectModal } from '@/components/projects';
import { Button, Modal } from '@/components/utilities';
import { useUsersStore, usePrioritiesStore, useStatusesStore, useProjectsStore, useTasksStore } from '@/modules';
import { TaskModal } from '@/components/tasks';

const projectStore = useProjectsStore();
const userStore = useUsersStore()
const priorityStore = usePrioritiesStore()
const statusStore = useStatusesStore()
const tasksStore = useTasksStore()

const route = useRoute()
const router = useRouter()

const showProjectStoreModal = ref(false);
const showTaskStoreModal = ref(false)
/**Project form */
const initialProjectFormState: ProjectFormTypes = {
  user_id: '',
  project_name: '',
  deadline: format(new Date(), 'yyyy-MM-dd'),
  priority_id: 1,
  status_id: 1
};
const post_project_form = ref<ProjectFormTypes>({
  ...initialProjectFormState
})
/**Ticket Form */
const initialTaskFormState: TasksFormTypes = {
  title: '',
  description: '',
  due_date: format(new Date(), 'yyyy-MM-dd'),
  assigned_by: '',
  priority_id: 1,
  status_id: 1,
  user_id: null,
  project_id: null
}
const post_task_form = ref<TasksFormTypes>({
  ...initialTaskFormState
})

/**Viewing */
const stateViewProject = ref<Project>();

const viewProject = (data: Project) => {
  stateViewProject.value = data;
};

// const users = computed(() => userStore.getUsers)
// const priorities = computed(() => priorityStore.getPriorities)
// const statuses = computed(() => statusStore.getStatuses)

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

/**Storing of new Tickets */
const storeTask = async () => {
  //get auth profile for assigned by condition for authentication
  post_task_form.value.assigned_by = 'gianoliver.maaghop@gmail.com'
  if (!stateViewProject.value?.id || !stateViewProject.value?.id == undefined) {
    console.log('Select a project') // change to toast or alert
  }

  try {
    const response = await tasksStore.setTaskStore(post_task_form.value)
    if (response) {
      projectStore.setSingleProject(post_task_form.value.project_id)
      showTaskStoreModal.value = false
      post_task_form.value = { ...initialTaskFormState }
    }
  } catch (error) {
    throw error
  }

}

/**Conditionally hides project list and project details to view TeamMember Child Route */
const isTeamMemberRouteActive = computed(() => {
  return route.matched.some(record => record.path.startsWith('/projects/team-member'))
})
/**Go back to previous project details */
const toProjectDetails = () => {
  if (route.name != 'Projects') {
    router.back()
  }
}

/**Watching the state view project movement, updates design */
watch(stateViewProject, async (newValue) => {
  if (newValue) {
    await projectStore.setSingleProject(newValue.id).then((res) => console.log(res));
  }
});

watch(route, (newVal) => {
  if (newVal.name == 'Projects') {
    projectStore.setSingleProject(stateViewProject.value?.id)
  }
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
      <!-- <div class="flex flex-wrap gap-1 items-center justify-center
                  min-[426px]:flex-row max-[425px]:grid grid-cols-2 bg-white py-2 px-1 shadow-md shadow-gray-400">
        Buttons with icons
        <Button @click="toProjectDetails" v-if="isTeamMemberRouteActive" color="back">
          <AkArrowBackThickFill class="text-gray-600 w-5 h-5" /> Project Details
        </Button>
        <Button color="secondary">
          <BsPencilSquare class="text-yellow-600 w-5 h-5" /> Edit Project
        </Button>
        <router-link :to="{ name: 'TeamMember' }"
          class="inline-flex items-center gap-1 p-1 font-medium rounded outline-none bg-orange-200 hover:bg-orange-300">
          <AnOutlinedUsergroupAdd class="text-orange-800 w-5 h-5" /> Add/Remove Team Member
        </router-link>
        <Button color="danger">
          <AkTrashCan class="text-red-800 w-5 h-5" /> Delete Project
        </Button>
      </div> -->
      <!-- Project List -->
      <div class="flex gap-2 h-full">
        <div class="h-[60%] ">
          <div class="text-xs font-bold uppercase px-1 sticky top-0 bg-blue-500 text-white rounded-t py-1 text-center flex items-center justify-between">
            Project List
            <Button @click="showProjectStoreModal = !showProjectStoreModal">
              <AnOutlinedPlusSquare class="text-blue-800 w-5 h-5" /> <p class="text-blue-800">Add Project</p>
            </Button>
          </div>
          <div v-if="projectStore.getProjects.length > 0" class="min-w-72 max-w-80 overflow-y-auto ">
            <div v-for="project in projectStore.getProjects" :key="project.id" class="w-full">
              <ProjectList :viewProject="viewProject" :project="project" />
            </div>
          </div>
          <p v-else class="text-center font-medium bg-blue-50 py-1">There's no project at the moment.</p>
        </div>
        <!-- Project Details or No Selection Message -->
        <div class=" h-full w-full overflow-y-auto">
          <ProjectDetails :toggle-ticket-store-modal="toggleTasksStoreModal" v-if="stateViewProject"
            @update:user_id="post_task_form.user_id = $event" @update:project_id="post_task_form.project_id = $event" />
          <p v-else class="text-center font-medium text-xs">No project selected</p>
        </div>
      </div>
    </div>

    <!-- Project Store Modal Component -->
    <Modal :visible="showProjectStoreModal" @update:visible="showProjectStoreModal = $event">
      <ProjectModal :post_project_form="post_project_form" :storeProject="storeProject" />
    </Modal>
    <!-- Ticket Store Modal Component -->
    <Modal :visible="showTaskStoreModal" @update:visible="showTaskStoreModal = $event">
      <TaskModal store :submit-fn="storeTask" :task_form="post_task_form" />
    </Modal>
  </div>
</template>
