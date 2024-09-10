<script setup lang="ts">
import { computed, ref } from 'vue';
// import { AkEdit, BxCommentAdd, CaContentView, CaTaskAdd, IcUploadSquare, McTask2Fill, MdAssignmentAdd } from '@kalimahapps/vue-icons';
import { differenceInBusinessDays, format } from 'date-fns';

import { useProjectsStore } from '@/modules';
import { Button, Modal } from '@/components/utilities';
import { Task, TasksFormTypes } from '@/types';
import { AkCircleChevronDown, AkCircleChevronUp } from '@kalimahapps/vue-icons';
// import { TaskModal } from '../tasks';

const props = defineProps<{
    toggleTicketStoreModal: () => void
}>()

const showTaskViewModal = ref(false)
// const commentOrEdit = ref(true)
// const selectedTask = ref<Task | null>(null)

// const initialTaskFormState: TasksFormTypes = {
//     title: '',
//     description: '',
//     due_date: format(new Date(), 'yyyy-MM-dd'),
//     assigned_by: '',
//     priority_id: 1,
//     status_id: 1,
//     user_id: null,
//     project_id: null
// }
// const post_task_form = ref<TasksFormTypes>({
//     ...initialTaskFormState
// })

const projectStore = useProjectsStore()

const project = computed(() => projectStore.getSingleProject)

// const getTaskStatus = (dueDate: string, status_id: number): string => {
//     const daysDifference = differenceInBusinessDays(format(dueDate, 'yyyy-MM-dd'), format(new Date(), 'yyyy-MM-dd'));
//     if (daysDifference < 0 && status_id != 3) return `bg-red-200 shadow-red-400`;
//     if (daysDifference <= -2 && status_id != 3) return 'bg-yellow-200 shadow-yellow-400';
//     if (daysDifference === 0 && status_id != 3) return 'bg-orange-200 shadow-orange-400';
//     return 'bg-blue-100 shadow-blue-400';
// }

const emit = defineEmits<{
    (event: 'update:user_id', value: number): void;
    (event: 'update:project_id', value: number): void;
}>()

// const selected_member = (project_id: number, user_id: number) => {
//     console.log(user_id)
//     emit('update:user_id', user_id)
//     emit('update:project_id', project_id)
//     props.toggleTicketStoreModal()
// }

// const selectTaskToView = (data: Task) => {
//     showTaskViewModal.value = true
//     selectedTask.value = data
// }

// const editTaskSubmit = () => {

// }

const files = ref<File[]>([]);

// const handleFileUpload = (event: Event) => {
//     const target = event.target as HTMLInputElement;
//     if (target.files) {
//         files.value = Array.from(target.files);
//     }
// };
const swimlaneState = ref<{ [key: number]: boolean }>({})

const toggleSwimlane = (id: number) => {
    swimlaneState.value[id] = !swimlaneState.value[id];
}

</script>

<template>
    <div v-if="project != null || project != undefined">
        <div class="bg-blue-500 rounded-t text-white p-[10px] text-md font-bold mb-1">
            {{ project.project_name }}
        </div>
        <!-- {{ project }} -->
        <div class="flex h-screen">
            <div class="min-w-40 font-medium bg-blue-50 h-full">
                <p class="p-2 bg-blue-100">Project Settings</p>
                <ul class="space-y-2 p-2">
                    <li>
                    <router-link :to="{name: 'Swimlane'}">Swimlane
                    </router-link>
                    </li>
                    <li>
                    <router-link class="hover:font-bold" :to="{name: 'TeamMember'}">Team Members
                    </router-link>
                    </li>
                    <li>
                    <router-link :to="{name: 'Upload'}">Upload
                    </router-link>
                    </li>
                    <li></li>
                </ul>
            </div>
            <div class="p-3 w-80 h-max  flex-1 ">
               <router-view />
            </div>
            <div class="px-2 space-y-1 min-w-80 bg-blue-50">
                <p class="p-2 bg-blue-100 font-medium">Swimlane</p>
                <div v-for="swimlane in project.swimlanes" :key="swimlane.id" class="bg-gray-100 duration-100">
                    <div class="p-1 flex items-center justify-between">
                        <p class="font-medium">{{ swimlane.swimlane_name }}</p>
                        <button @click="toggleSwimlane(swimlane.id)" class="p-1 group cursor-pointer">
                            <component :is="swimlaneState[swimlane.id] ? AkCircleChevronUp : AkCircleChevronDown"
                                class="size-4 text-gray-600 group-hover:text-black" />
                        </button>
                    </div>
                    <div
                        :class="`text-opacity-100 duration-200 ease-in-out bg-white border overflow-y-auto px-2 ${swimlaneState[swimlane.id] ? 'h-40 ' : 'h-0 text-[0px]'}`">
                        <!-- Render Swimlane Content -->
                        <div v-for="column in swimlane.columns" :key="column.id" class="space-y-1">
                            <p class="font-medium">{{ column.column_name }}</p>
                            <ul class="border p-2">
                                <div v-if="column.tasks.length > 0">
                                    <li v-for="task in column.tasks" :key="task.id">
                                        {{ task.title }}
                                    </li>
                                </div>
                                <div v-else>
                                    <p class="text-center">No tasks found</p>
                                </div>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- <div v-if="project.team_tasks && typeof project.team_tasks === 'object' && project.members_count != 0"
            class="flex max-[425px]:flex-col flex-wrap gap-2 ">
            <div v-for="name in Object.keys(project.team_tasks)" :key="name"
                class="max-h-60 overflow-y-auto bg-blue-100">
                <span
                    class="p-2 flex items-center justify-between px-4 z-20 uppercase font-bold bg-blue-300 sticky top-0">
                    <p>{{ name }}</p>
                    <Button @click="selected_member(project.id, project.team_tasks[name].id)">
                        <CaTaskAdd class="size-4" />
                    </Button>
                </span>
                <span v-if="project.team_tasks[name].count != 0" class="">
                    <ul v-for="task in project.team_tasks[name].data" :key="task.task_id" class="p-2 flex flex-col">
                        <li
                            :class="` group p-2 duration-200 shadow-md relative bg-white rounded-md border border-gray-400 hover:border-blue-400 shadow-gray-50 min-w-60 group ${getTaskStatus(task.due_date, task.status_id)}`">
                            <span class=" flex justify-between ">
                                <p class="font-medium break-words">{{ task.task_title }}</p>
                                <p>{{ task.priority }}</p>
                            </span>
                            <span class="flex justify-between">
                                <p>{{ task.status }}</p>
                                <p class="">{{ task.due_date }}</p>
                            </span>
                            <div @click="selectTaskToView(task)"
                                class="absolute top-0 right-0 h-full w-0 bg-blue-200 group-hover:w-[20%] duration-200 ease-in-out opacity-80 flex items-center justify-center cursor-pointer">
                                <CaContentView class="size-5 text-blue-900" />
                            </div>
                        </li>
                    </ul>
                </span>
                <ul class="p-2 min-w-60" v-else>
                    <li class="shadow-md shadow-gray-400 text-center p-2">No task</li>
                </ul>
            </div>
        </div>
        <div v-else class="space-y-1">
            <p v-if="project.members_count == 0" class="text-center font-medium ">Assign member to this project first.
            </p>
        </div> -->
    </div>
    <Modal :visible="showTaskViewModal" @update:visible="showTaskViewModal = $event">
        <!-- <div class="flex items-center gap-1">
            <McTask2Fill class="size-5 text-blue-600" />Task Details
        </div>
        <div>
            <p class="text-lg font-bold">Task Title: {{ selectedTask?.task_title }}</p>
            <span class="">Task Description:
                <p class="text-justify bg-gray-100 h-40 px-2 break-words overflow-y-auto font-mono text-xs max-h-40">{{
                    selectedTask?.task_description }}</p>
            </span>
            <span class="flex justify-between">Due Date: <p class="font-medium">{{ selectedTask?.due_date }}</p></span>
            <span class="flex justify-between">Priority: <p class="font-medium">{{ selectedTask?.priority }}</p></span>
            <span class="flex justify-between">Status: <p class="font-medium">{{ selectedTask?.status }}</p></span>
        </div>
        <div class="p-1 space-x-1">
            <Button :disabled="commentOrEdit" @click="commentOrEdit = true"
                class="disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none">
                <BxCommentAdd class="size-4" />
                Comment
            </Button>
            <Button :disabled="!commentOrEdit" @click="commentOrEdit = false" color="secondary"
                class="disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none">
                <AkEdit class="size-4" />Edit
            </Button>
        </div>
        <div class="border p-2 ">
            <div v-if="commentOrEdit" class="space-y-3 flex flex-col">
                <label
                    class="bg-blue-200 text-gray-800 text-xs px-4 py-1 rounded cursor-pointer w-max border border-gray-300 hover:bg-blue-100">
                    <input type="file" @change="handleFileUpload" class="hidden" multiple />
                    <p class="flex items-center gap-1">
                        <IcUploadSquare class="size-4" />Upload Supporting Documents
                    </p>
                </label>
                <div v-if="files.length" class="text-xs flex items-center gap-1">
                    <h3 class="text-gray-700 font-medium">Attachments:</h3>
                    <ul class="bg-gray-50 border border-gray-200 rounded p-2 w-full">
                        <li v-for="(file, index) in files" :key="index" class="">
                            {{ file.name }}
                        </li>
                    </ul>
                </div>
                <div
                    class="relative block rounded-md border shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 border-gray-200">
                    <textarea
                        class="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 p-2 w-full text-xs bg-white">
                </textarea>
                    <span
                        class="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white font-medium p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                        Comment
                    </span>
                </div>
                <Button type="submit" class="p-2 w-full text-sm flex items-center justify-center gap-1">
                    <MdAssignmentAdd /> Submit
                </Button>
            </div>
            <TaskModal v-else :submit-fn="editTaskSubmit" :task_form="post_task_form" />
        </div> -->
    </Modal>
</template>