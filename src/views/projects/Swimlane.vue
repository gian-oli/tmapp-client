<script setup lang="ts">
import Button from '@/components/utilities/Button.vue';
import Form from '@/components/utilities/Form.vue';
import Input from '@/components/utilities/Input.vue';
import { useProjectsStore, useSwimlaneStore } from '@/modules';
import { Project } from '@/types';
import { AkTrashCan } from '@kalimahapps/vue-icons';
import { computed, inject, ref, Ref } from 'vue';

const swimlaneStore = useSwimlaneStore();
const projectStore = useProjectsStore();

const project = inject('selectedProject') as Ref<Project>;

const selectedProject = computed(() => project.value);

const swimlane_name = ref('');

const addSwimlane = async () => {
    try {
        const result = await swimlaneStore.storeSwimlane({
            swimlane_name: swimlane_name.value,
            project_id: selectedProject.value.id,
            project_type: selectedProject.value.project_type
        });
        if (result) {
            swimlane_name.value = '';
            projectStore.setSingleProject(selectedProject.value.id);
        }
    } catch (error) {
        console.log(error);
    }
};

const removeSwimlane = async (id: number) => {
    try {
        await swimlaneStore.deleteSwimlane(id);
        projectStore.setSingleProject(selectedProject.value.id);
    } catch (error) {
        console.log(error);
    }
};
</script>

<template>
    <h2 class="text-xl font-semibold text-gray-800">Manage Swimlanes</h2>

    <div class="space-y-4">
        <h3 class="text-lg font-medium text-gray-700">Add Swimlane</h3>
        <Form :submit="addSwimlane" class="flex flex-col gap-4">
            <Input type="text" id="swimlane-name" label="Swimlane Name" v-model="swimlane_name"
                placeholder="Enter swimlane name"
                class="border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200" />
            <Button type="submit"
                class="bg-blue-600 text-white hover:bg-blue-700 w-max transition-all duration-200 py-4 px-8 text-base">
                Add Swimlane
            </Button>
        </Form>
    </div>

    <div class="space-y-4">
        <h3 class="text-lg font-medium text-gray-700">Delete Swimlane</h3>
        <ul class="flex flex-col h-52 overflow-y-scroll">
            <li v-for="swimlane in selectedProject.swimlanes" :key="swimlane.id"
                class="flex items-center justify-between bg-gray-100 rounded-md p-3 shadow-sm">
                <p class="font-medium text-gray-800">{{ swimlane.swimlane_name }}</p>
                <Button color="danger" @click="removeSwimlane(swimlane.id)" class="flex items-center justify-center">
                    <AkTrashCan class="size-4 text-red-600" />
                </Button>
            </li>
        </ul>
    </div>
</template>

<style scoped>
.bg-gray-100 {
    background-color: #f7fafc;
}
</style>
