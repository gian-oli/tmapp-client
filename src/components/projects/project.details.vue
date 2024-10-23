<script setup lang="ts">
import { computed, provide, ref } from 'vue';
import { useProjectsStore } from '@/modules';
import { AkCircleChevronDown, AkCircleChevronUp, AnOutlinedEdit, CaTaskRemove } from '@kalimahapps/vue-icons';
// import { format } from 'date-fns';
import { Button } from '../utilities';

const projectStore = useProjectsStore()

/* Initialize Project */
const project = computed(() => projectStore.getSingleProject)

/* Emit updates: user and project */
const emit = defineEmits<{
    (event: 'update:user_id', value: number): void;
    (event: 'update:project_id', value: number): void;
}>()

/* Handles collapse buttons - design */
const swimlaneState = ref<{ [key: number]: boolean }>({})
/* Collapse Toggler */
const toggleSwimlane = (id: number) => {
    swimlaneState.value[id] = !swimlaneState.value[id];
}
/* Provide selectedProject: for injection of computed project */
provide('selectedProject', project)

</script>

<template>
    <div v-if="project != null || project != undefined">
        <div class="bg-blue-500 rounded-t text-white p-[10px] text-md font-bold mb-1 sticky top-0 z-10 flex justify-between items-center">
            <p>{{ project.project_name }}</p>
            <p>System {{ project.project_type }}</p>
        </div>
        <div class="flex h-screen">
            <!-- Project Settings - ROUTES -->
            <div class="min-w-40 font-medium bg-blue-50 h-full">
                <p class="p-2 bg-blue-100">Project Settings</p>
                <ul class="space-y-2 p-2">
                    <li>
                        <router-link active-class="bg-blue-200 font-bold" class="px-2 py-1 rounded hover:font-bold"
                            :to="{ name: 'TaskManagement' }">Task
                        </router-link>
                    </li>
                    <li>
                        <router-link v-if="project.project_type === 'Development'" active-class="bg-blue-200 font-bold" class="px-2 py-1 rounded hover:font-bold"
                            :to="{ name: 'Swimlane' }">Swimlane
                        </router-link>
                    </li>
                    <li>
                        <router-link active-class="bg-blue-200 font-bold" class="px-2 py-1 rounded hover:font-bold"
                            :to="{ name: 'TeamMember' }">Team Members
                        </router-link>
                    </li>
                    <li>
                        <router-link active-class="bg-blue-200 font-bold" class="px-2 py-1 rounded hover:font-bold"
                            :to="{ name: 'Upload' }">Upload
                        </router-link>
                    </li>
                    <li></li>
                </ul>
            </div>
            <!-- Router view -->
            <div class="p-3 w-80 h-max  flex-1 ">
                <router-view />
            </div>
            <!-- Swimlane List -->
            <div class="px-2 space-y-1 min-w-80 bg-blue-50 max-w-80">
                <p class="p-2 bg-blue-100 font-medium">Swimlane</p>
                <div v-for="swimlane in project.swimlanes" :key="swimlane.id" class="bg-gray-100 duration-100">

                    <div class="p-1 flex items-center justify-between">
                        <p class="font-medium uppercase">{{ swimlane.swimlane_name }}</p>
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
                            <!-- Display column tasks -->
                                <div v-if="column.tasks.length > 0" class="space-y-1">
                                <!-- Render Task Content -->
                                    <li v-for="task in column.tasks" :key="task.id"
                                        class="border border-l-blue-400 p-2 font-medium space-y-1">

                                        <span class="w-full flex justify-end gap-2">
                                            <div :style="{ backgroundColor: task.color_name || '#fff'}" class="flex-1 px-1 text-xs">
                                                #{{ task.id }}
                                            </div>

                                            <div class="flex gap-1 items-center">
                                                <Button color="secondary" class="text-yellow-700" title="Edit Task">
                                                    <AnOutlinedEdit />
                                                </Button>
                                                <Button color="danger" class="text-yellow-700" title="Remove Task">
                                                    <CaTaskRemove />
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
                                            <p>{{ task.user_id ? task.user.username : 'No member assigned' }}</p>
                                            <!-- <p class="flex  items-center gap-1">
                                            <div
                                                :class="`w-3 h-3 rounded-full ${format(task.due_date, 'yyyy-MM-dd') <= format(new Date(), 'yyyy-MM-dd') ? 'border-2 border-red-200 bg-red-600 animate-pulse' : 'border-green-200 bg-green-600'} inline-flex`">
                                            </div>{{ task.due_date }}</p> -->
                                        </span>

                                    </li>
                                </div>
                                <!-- Display if there are no task in a specific column -->
                                <div v-else>
                                    <p class="text-center">No tasks found</p>
                                </div>

                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>