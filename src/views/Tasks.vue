<script setup lang="ts">
import ProjectList from "@/components/projects/project.list.vue";
import Button from "@/components/utilities/Button.vue";
import { useProjectsStore, useTasksStore } from "@/modules";
import {  Profile, Project } from "@/types";
import { AkCircleChevronUp, AkCircleChevronDown, AkCircleChevronLeftFill, AkCircleChevronRightFill, BsEyeFill } from "@kalimahapps/vue-icons";
import { differenceInSeconds } from "date-fns";
import { computed, inject, onMounted, provide, ref, Ref, watch } from "vue";

const projectStore = useProjectsStore()
const taskStore = useTasksStore()

const inject_profile = inject("profile") as Ref<Profile>;
const profile = computed(() => inject_profile.value)
// const projects = computed(() => projectStore.getProjects)
const myProjects = computed(() => projectStore.getMyProjects)

const stateViewProject = ref<Project>();

const viewProject = (data: Project) => {
    stateViewProject.value = data
    console.log(data)
}

provide('stateViewProject', stateViewProject);

onMounted(() => {
    projectStore.loadMyProjects(profile.value.id)
});

watch(stateViewProject, async (newValue) => {
    if (newValue) {
        await projectStore.setSingleProject(newValue.id).then((res) => console.log(res));
    }
});

const testingSwimlane = computed(() => {
    const project = projectStore.getSingleProject;
    if (project && project.swimlanes) {
        const swimlane = project.swimlanes.find(swimlane =>
            swimlane.swimlane_name.toLowerCase() === profile.value.username.toLowerCase()
        );
        return swimlane?.columns ?? null;  // Return null if columns are undefined or empty
    }
    return null;  // Return null if project or swimlanes are undefined
});

const developmentSwimlane = computed(() => {
    const project = projectStore.getSingleProject;
    if (project && project.swimlanes) {
        return project.swimlanes ?? null;  // Return null if swimlanes are undefined
    }
    return null;  // Return null if project or swimlanes are undefined
});

/* Handles collapse buttons - design */
const swimlaneState = ref<{ [key: number]: boolean }>({})
/* Collapse Toggler */
const toggleSwimlane = (id: number) => {
    swimlaneState.value[id] = !swimlaneState.value[id];
}
/* Backlog to Ready */
const batchReady = async (swimlane_id: number, column_id: number) => {
    try {
        const result = await taskStore.backlogToReady(swimlane_id, column_id)
        if (result) {
            await projectStore.setSingleProject(stateViewProject.value?.id)
        }
    } catch (e) {
        console.error(e)
    }
}

const toNextColumn = async (swimlane_id: number, task_id: number) => {
    try {
        const result = await taskStore.nextColumn(swimlane_id, task_id)
        if (result) {
            await projectStore.setSingleProject(stateViewProject.value?.id)
        }
    } catch (e) {
        console.error(e)
    }
}
const toPreviousColumn = async (swimlane_id: number, task_id: number) => {
    try {
        const result = await taskStore.previousColumn(swimlane_id, task_id)
        if (result) {
            await projectStore.setSingleProject(stateViewProject.value?.id)
        }
    } catch (e) {
        console.error(e)
    }
}

const formatTimeSpent = (start_date: string, finished_at: string) => {
    // Convert the start and finish times to JavaScript Date objects
    const start = new Date(start_date);
    const finish = new Date(finished_at);

    // Calculate the difference in seconds
    const totalSeconds = differenceInSeconds(finish, start);

    // Convert seconds to hh:mm:ss format
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
}

</script>
<template>
    <div class="p-2 bg-white flex h-full gap-2">
        <div class="min-w-80 max-w-80">
            <p class="font-medium bg-blue-500 py-[10px] px-1 text-white rounded-t text-xs">MY PROJECTS</p>
            <div v-for="project in myProjects" :key="project.id"
                :class="`border-l-2 ${project.status_id == 3 ? 'border-red-400' : project.status_id == 2 ? 'border-yellow-400' : 'border-green-400'}`">
                <ProjectList :viewProject="viewProject" :project="project" />
            </div>
        </div>

        <div class="space-y-2 w-full border overflow-y-auto"
            v-if="projectStore.getSingleProject.project_type == 'Testing'">
            <div class="p-2 bg-blue-500 rounded-t text-white sticky top-0 z-20">{{ stateViewProject?.project_name }} -
                {{
                    stateViewProject?.project_type }}</div>
            <div class="flex justify-evenly w-full gap-2 px-2">
                <div v-for="column in testingSwimlane" :key="column.id" class="space-y-1 w-full h-full">
                    <span class="font-medium flex justify-between bg-gray-100 p-2">
                        <p>{{ column.column_name }}</p>
                        <Button v-if="column.column_name == 'Backlog'" :disabled="column.tasks.length == 0"
                            @click="batchReady(column.swimlane_id, column.id)"
                            class="disabled:opacity-50 disabled:pointer-events-none">All To
                            Ready</Button>
                    </span>

                    <div class="">
                        <!-- Display column tasks -->
                        <div v-if="column.tasks.length > 0" class="space-y-1 h-full">
                            <!-- Render Task Content -->
                            <div v-for="task in column.tasks" :key="task.id"
                                class="border border-l-blue-400 p-2 font-medium space-y-1">

                                <span class="w-full flex justify-end gap-2">
                                    <div class="flex gap-1 items-center">
                                        <Button @click="toPreviousColumn(column.swimlane_id, task.id)" color="secondary"
                                            class="text-yellow-700" title="Previous Column">
                                            <AkCircleChevronLeftFill />
                                        </Button>
                                    </div>
                                    <div :style="{ backgroundColor: task.color_name || '#fff' }"
                                        class="flex-1 px-1 text-xs">
                                        #{{ task.id }}
                                    </div>

                                    <div class="flex gap-1 items-center">
                                        <Button @click="toNextColumn(column.swimlane_id, task.id)" color="danger"
                                            class="text-yellow-700" title="Next Column">
                                            <AkCircleChevronRightFill />
                                        </Button>
                                    </div>
                                </span>

                                <span class="flex justify-between items-center">
                                    <p class="truncate max-w-[20ch]">{{ task.title }}</p>
                                    <p class="flex  items-center gap-1">
                                    <div
                                        :class="`w-3 h-3 rounded-full border-2 ${task.priority_id == 3 ? ' border-red-200 bg-red-600 inline-flex animate-pulse' : task.priority_id == 2 ? 'border-yellow-200 bg-yellow-600 animate-spin' : 'border-green-200 bg-green-600'}`">
                                    </div>{{ task.priorities.priority_name }}</p>
                                </span>

                                <span class="flex justify-between items-center">
                                    <p class="capitalize">{{ task.user_id ? task.user.username : 'No member assigned' }}
                                    </p>
                                    <!-- <p class="flex  items-center gap-1">
                                    <div
                                        :class="`w-3 h-3 rounded-full ${format(task.due_date, 'yyyy-MM-dd') <= format(new Date(), 'yyyy-MM-dd') ? 'border-2 border-red-200 bg-red-600 animate-pulse' : 'border-green-200 bg-green-600'} inline-flex`">
                                    </div>{{ format(task.due_date, 'yyyy-MM-dd') }}</p> -->
                                </span>
                                <span class="flex justify-between items-center">
                                    <p>Start:</p>
                                    <p>{{ task.start_date ?? '-' }}</p>
                                </span>
                                <span class="flex justify-between items-center">
                                    <p>Finish:</p>
                                    <p>{{ task.finished_at ?? '-' }}</p>
                                </span>
                                <span class="flex justify-between items-center">
                                    <p>Time Spent:</p>
                                    <p>{{ task.start_date && task.finished_at ?
                                        formatTimeSpent(task.start_date, task.finished_at) : '-' }}</p>
                                </span>
                                <span class="w-full flex justify-end">
                                    <Button class="flex items-center gap-1">
                                        <BsEyeFill />View
                                    </Button>
                                </span>
                            </div>
                        </div>
                        <!-- Display if there are no task in a specific column -->
                        <div v-else>
                            <p class="text-center">No tasks found</p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        <div v-else class="w-full space-y-2 border overflow-y-scroll">
            <div class="p-2 bg-blue-500 rounded-t text-white sticky top-0 z-20">{{ stateViewProject?.project_name }} -
                {{
                    stateViewProject?.project_type }}</div>
            <div class="flex flex-col w-full px-2">
                <div v-for="swimlane in developmentSwimlane" :key="swimlane.id" class="bg-gray-100 duration-100">

                    <div class="p-1 flex items-center justify-between group cursor-pointer"
                        @click="toggleSwimlane(swimlane.id)">
                        <p class="font-medium uppercase">{{ swimlane.swimlane_name }}</p>
                        <button>
                            <component :is="swimlaneState[swimlane.id] ? AkCircleChevronUp : AkCircleChevronDown"
                                class="size-4 text-gray-600 group-hover:text-black" />
                        </button>
                    </div>

                    <div
                        :class="` flex justify-evenly gap-2 text-opacity-100 duration-200 ease-in-out bg-white border overflow-y-auto ${swimlaneState[swimlane.id] ? 'h-[30rem]' : 'h-0 text-[0px]'}`">
                        <!-- Render Swimlane Content -->
                        <div v-for="column in swimlane.columns" :key="column.id" class="space-y-1 w-full h-full p-2">

                            <span class="font-medium flex justify-between bg-gray-100 p-1">
                                <p>{{ column.column_name }}</p>
                                <Button v-if="column.column_name == 'Backlog'" :disabled="column.tasks.length == 0"
                                    @click="batchReady(column.swimlane_id, column.id)"
                                    class="disabled:opacity-50 disabled:pointer-events-none">All To
                                    Ready</Button>
                            </span>

                            <div class=" ">
                                <!-- Display column tasks -->
                                <div v-if="column.tasks.length > 0" class="space-y-1 h-full">
                                    <!-- Render Task Content -->
                                    <ul v-for="task in column.tasks" :key="task.id" class="">
                                        <li v-if="task.user_id === profile.id"
                                            class="border border-l-blue-400 p-2 font-medium space-y-1">

                                            <span class="w-full flex justify-end gap-2">
                                                <div class="flex gap-1 items-center">
                                                    <Button @click="toPreviousColumn(swimlane.id, task.id)"
                                                        color="secondary" class="text-yellow-700"
                                                        title="Previous Column">
                                                        <AkCircleChevronLeftFill />
                                                    </Button>
                                                </div>
                                                <div :style="{ backgroundColor: task.color_name || '#fff' }"
                                                    class="flex-1 px-1 text-xs">
                                                    #{{ task.id }}
                                                </div>

                                                <div class="flex gap-1 items-center">
                                                    <Button @click="toNextColumn(swimlane.id, task.id)" color="danger"
                                                        class="text-yellow-700" title="Next Column">
                                                        <AkCircleChevronRightFill />
                                                    </Button>
                                                </div>
                                            </span>

                                            <span class="flex justify-between items-center">
                                                <p class="truncate max-w-[20ch]">{{ task.title }}</p>
                                                <div class="flex  items-center gap-1 ">
                                                    <div
                                                        :class="`w-3 h-3 rounded-full border-2 ${task.priority_id == 3 ? ' border-red-200 bg-red-600 inline-flex animate-pulse' : task.priority_id == 2 ? 'border-yellow-200 bg-yellow-600 animate-spin' : 'border-green-200 bg-green-600'}`">
                                                    </div>
                                                    <p class="capitalize">{{ task.priorities.priority_name }}</p>
                                                </div>
                                            </span>

                                            <span class="flex justify-between items-center">
                                                <p class="capitalize">
                                                    {{ task.user_id ? task.user.username : 'No member assigned' }}
                                                </p>
                                                <div class="flex  items-center gap-1">
                                                    <!-- <div
                                                        :class="`w-3 h-3 rounded-full ${format(task.due_date, 'yyyy-MM-dd') <= format(new Date(), 'yyyy-MM-dd') ? 'border-2 border-red-200 bg-red-600 animate-pulse' : 'border-green-200 bg-green-600'} inline-flex`">
                                                    </div>{{ format(task.due_date, 'yyyy-MM-dd') }} -->
                                                </div>
                                            </span>
                                            <span class="flex justify-between items-center">
                                                <p>Start:</p>
                                                <p>{{ task.start_date ?? '-' }}</p>
                                            </span>
                                            <span class="flex justify-between items-center">
                                                <p>Finish:</p>
                                                <p>{{ task.finished_at ?? '-' }}</p>
                                            </span>
                                            <span class="flex justify-between items-center">
                                                <p>Time Spent:</p>
                                                <p>{{ task.start_date && task.finished_at ?
                                                    formatTimeSpent(task.start_date, task.finished_at) : '-' }}</p>
                                            </span>
                                            <span class="w-full flex justify-end">
                                                <Button class="flex items-center gap-1">
                                                    <BsEyeFill />View
                                                </Button>
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                                <!-- Display if there are no task in a specific column -->
                                <div v-else>
                                    <p class="text-center">No tasks found</p>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
