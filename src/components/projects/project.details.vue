<script setup lang="ts">
import { computed, provide, ref } from 'vue';
import { useProjectsStore } from '@/modules';
import { AkCircleChevronDown, AkCircleChevronUp, AnOutlinedEdit, CaTaskRemove } from '@kalimahapps/vue-icons';

const projectStore = useProjectsStore();
const project = computed(() => projectStore.getSingleProject);

const emit = defineEmits<{
    (event: 'update:user_id', value: number): void;
    (event: 'update:project_id', value: number): void;
}>();

const swimlaneState = ref<{ [key: number]: boolean }>({});
const toggleSwimlane = (id: number) => {
    swimlaneState.value[id] = !swimlaneState.value[id];
};
provide('selectedProject', project);

const projectRoutes = [
    { name: 'TaskManagement', label: 'Task Management' },
    { name: 'Swimlane', label: 'Swimlane', condition: project?.value?.project_type === 'Development' },
    { name: 'TeamMember', label: 'Team Members' },
    { name: 'Upload', label: 'Upload' },
];
</script>

<template>
    <div v-if="project">
        <!-- Project Header -->
        <div class="bg-blue-500 text-white p-4 font-semibold sticky top-0 z-10 flex justify-between items-center shadow-sm rounded-t-lg">
            <p>{{ project.project_name }}</p>
            <p>System: {{ project.project_type }}</p>
        </div>

        <div class="flex bg-gray-50">
            <!-- Sidebar - Project Settings -->
            <aside class="w-64 bg-white border-r shadow-md p-3">
                <p class="font-semibold text-blue-600">Project Settings</p>
                <ul class="space-y-2 mt-4">
                    <li v-for="route in projectRoutes" :key="route.name">
                        <router-link 
                            :to="{ name: route.name }"
                            class="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-blue-500 transition-colors"
                            active-class="font-semibold bg-gray-100 text-blue-600"
                        >
                            {{ route.label }}
                        </router-link>
                    </li>
                </ul>
            </aside>

            <!-- Main Content - Router View -->
            <main class="flex-1 h-full overflow-y-auto bg-white shadow-md rounded-lg p-6 space-y-6">
                <router-view />
            </main>

            <!-- Swimlane Section -->
            <aside class="w-64 bg-white border-l shadow-md overflow-hidden">
                <p class="p-3 font-semibold text-blue-600">Swimlanes</p>
                <div class="overflow-y-auto h-[calc(100vh-200px)]">
                    <div v-for="swimlane in project.swimlanes" :key="swimlane.id" class="border-b">
                        <!-- Swimlane Header -->
                        <div class="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-50 transition" @click="toggleSwimlane(swimlane.id)">
                            <p class="font-semibold uppercase text-gray-800">{{ swimlane.swimlane_name }}</p>
                            <component :is="swimlaneState[swimlane.id] ? AkCircleChevronUp : AkCircleChevronDown" class="text-gray-500 hover:text-gray-700 transition" />
                        </div>

                        <!-- Swimlane Content -->
                        <div :class="swimlaneState[swimlane.id] ? 'max-h-64 transition-all overflow-y-auto' : 'max-h-0 overflow-hidden transition-all'">
                            <div v-for="column in swimlane.columns" :key="column.id" class="px-4 py-3 bg-gray-50 border-t">
                                <p class="font-semibold text-gray-700">{{ column.column_name }}</p>
                                <ul class="space-y-3 mt-2">
                                    <li v-for="task in column.tasks" :key="task.id" class="bg-white shadow rounded-lg p-3 flex flex-col space-y-2">
                                        <div class="flex justify-between items-center">
                                            <p class="truncate font-medium text-gray-900">{{ task.title }}</p>
                                            <div class="flex items-center space-x-2">
                                                <button title="Edit Task" class="text-blue-500 hover:text-blue-600">
                                                    <AnOutlinedEdit />
                                                </button>
                                                <button title="Remove Task" class="text-red-500 hover:text-red-600">
                                                    <CaTaskRemove />
                                                </button>
                                            </div>
                                        </div>
                                        <div class="flex justify-between items-center text-sm text-gray-500">
                                            <p>{{ task.user_id ? task.user.username : 'No member assigned' }}</p>
                                            <span class="flex items-center gap-1">
                                                <div :class="`w-3 h-3 rounded-full ${task.priority_id === 3 ? 'bg-red-500' : task.priority_id === 2 ? 'bg-yellow-500' : 'bg-green-500'}`"></div>
                                                <span>{{ task.priorities.priority_name }}</span>
                                            </span>
                                        </div>
                                    </li>
                                    <li v-if="!column.tasks.length" class="text-center text-gray-500 p-3 bg-gray-50 rounded-lg">
                                        No tasks found
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    </div>
</template>

<style scoped>
body {
    font-family: Arial, sans-serif;
}

/* Additional styles for scrollbar */
.overflow-y-auto::-webkit-scrollbar {
    width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.5);
}
</style>
