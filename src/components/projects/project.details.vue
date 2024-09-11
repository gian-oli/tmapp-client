<script setup lang="ts">
import { computed, provide, ref } from 'vue';
import { useProjectsStore } from '@/modules';
import { AkCircleChevronDown, AkCircleChevronUp } from '@kalimahapps/vue-icons';
import { format } from 'date-fns';

const projectStore = useProjectsStore()

const project = computed(() => projectStore.getSingleProject)


const emit = defineEmits<{
    (event: 'update:user_id', value: number): void;
    (event: 'update:project_id', value: number): void;
}>()

const swimlaneState = ref<{ [key: number]: boolean }>({})

const toggleSwimlane = (id: number) => {
    swimlaneState.value[id] = !swimlaneState.value[id];
}

provide('selectedProject', project)

</script>

<template>
    <div v-if="project != null || project != undefined">
        <div class="bg-blue-500 rounded-t text-white p-[10px] text-md font-bold mb-1">
            {{ project.project_name }}
        </div>
        <div class="flex h-screen">
            <div class="min-w-40 font-medium bg-blue-50 h-full">
                <p class="p-2 bg-blue-100">Project Settings</p>
                <ul class="space-y-2 p-2">
                    <li>
                        <router-link active-class="bg-blue-200 font-bold" class="px-2 py-1 rounded hover:font-bold"
                            :to="{ name: 'TaskManagement' }">Task
                        </router-link>
                    </li>
                    <li>
                        <router-link active-class="bg-blue-200 font-bold" class="px-2 py-1 rounded hover:font-bold"
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
            <div class="p-3 w-80 h-max  flex-1 ">
                <router-view />
            </div>
            <div class="px-2 space-y-1 min-w-80 bg-blue-50 max-w-80">
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
                                    <li v-for="task in column.tasks" :key="task.id" class="border p-2 font-medium">
                                        <span class="flex justify-between items-center">
                                            <p>{{ task.title }}</p>
                                            <p class="flex  items-center gap-1">
                                            <div
                                                :class="`w-3 h-3 rounded-full border-2 ${task.priority_id == 3 ? ' border-red-200 bg-red-600 inline-flex animate-pulse' : task.priority_id == 2 ? 'border-yellow-200 bg-yellow-600 animate-spin' : 'border-green-200 bg-green-600'}`">
                                            </div>{{ task.priorities.priority_name }}</p>
                                        </span>
                                        <span class="flex justify-between items-center">
                                            <p>{{ task.user_id ? task.user.username : 'No member assigned' }}</p>
                                            <p class="flex  items-center gap-1">
                                            <div
                                                :class="`w-3 h-3 rounded-full ${format(task.due_date, 'yyyy-MM-dd') <= format(new Date(), 'yyyy-MM-dd') ? 'border-2 border-red-200 bg-red-600 animate-pulse' : 'border-green-200 bg-green-600'} inline-flex`">
                                            </div>{{ task.due_date }}</p>
                                        </span>
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
    </div>
</template>