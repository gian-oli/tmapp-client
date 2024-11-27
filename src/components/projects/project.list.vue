<script setup lang="ts">
import { Project } from '@/types/projects.types';
import { inject, Ref } from 'vue';

const { project, viewProject } = defineProps<{
    project: Project,
    viewProject: (data: Project) => void
}>()

const stateViewProject = inject('stateViewProject') as Ref<Project>
</script>

<template>
    <!-- <div 
        @click="viewProject(project)"
        :class="`w-full cursor-pointer border-b py-3 transition-colors duration-150 ${
            stateViewProject?.id == project.id ? 'bg-indigo-50 border-indigo-300' : 'hover:bg-gray-50 border-gray-200'
        }`">
        <div class="flex justify-between items-center px-4">
            <div class="text-left">
                <p class="font-semibold text-gray-800 text-base truncate">
                    {{ project.project_name }}
                </p>
                <p class="text-sm text-gray-500">{{ project.project_type }}</p>
                <p class="text-xs text-gray-400 mt-1">
                    Deadline: <span class="text-gray-600">{{ project.deadline || 'No deadline set' }}</span>
                </p>
            </div>

            <div class="text-right text-sm">
                <p class="uppercase text-gray-400 font-semibold">Completed</p>
                <p class="text-gray-600">{{ project.finished_at || '-' }}</p>
            </div>
        </div>
    </div> -->

    <div :class="`p-3 my-1 cursor-pointer rounded-lg transition-colors duration-200 ${stateViewProject?.id === project.id ? 'bg-blue-100 border-l-4 border-blue-300' : 'hover:bg-blue-50'
        }`" @click="viewProject(project)">
        <p class="font-medium text-gray-800">{{ project.project_name }}</p>
        <p class="text-xs text-gray-500">{{ project.project_type }}</p>
        <p class="text-xs text-gray-400 mt-1">Deadline: {{ project.deadline || 'No deadline' }}</p>
    </div>
</template>
