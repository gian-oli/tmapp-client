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
    <div :class="` w-full cursor-pointer  ${stateViewProject?.id == project.id ? 'bg-blue-200' : 'bg-gray-100'}`">
        <span @click="viewProject(project)"
            :class="`flex justify-between  py-1 px-5 text-xs w-full ${stateViewProject?.id == project.id ? 'text-black' : 'text-gray-500 min-[769px]:hover:bg-gray-50'}`">
            <div>
                <p class="font-bold">{{ project.project_name }} - {{ project.project_type }}</p>
                <p>Deadline : {{ project.deadline }}</p>
            </div>
            <div>
                <p>{{ project.finished_at ? project.finished_at : '-' }}</p>
            </div>
        </span>
    </div>
</template>