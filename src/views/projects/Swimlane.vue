<script setup lang="ts">
import Button from '@/components/utilities/Button.vue';
import Form from '@/components/utilities/Form.vue';
import Input from '@/components/utilities/Input.vue';
import { useProjectsStore, useSwimlaneStore } from '@/modules';
import { Project } from '@/types';
import { AkTrashCan } from '@kalimahapps/vue-icons';
import { computed, inject, ref, Ref } from 'vue';

const swimlaneStore = useSwimlaneStore()
const projectStore = useProjectsStore()

const project = inject('selectedProject') as Ref<Project>

const selectedProject = computed(() => project.value)

const swimlane_name = ref('')

const addSwimlane = async () => {
    try {
        const result = await swimlaneStore.storeSwimlane({
            swimlane_name: swimlane_name.value,
            project_id: selectedProject.value.id,
            project_type: selectedProject.value.project_type
        })
        if (result) {
            swimlane_name.value = ''
            projectStore.setSingleProject(selectedProject.value.id)
        }
    } catch (error) {
        console.log(error)
    }
}

const removeSwimlane = async (id: number) => {
    try {
        await swimlaneStore.deleteSwimlane(id)
        projectStore.setSingleProject(selectedProject.value.id)

    } catch (error) {
        console.log(error)
    }
}
</script>
<template>
    <div class="space-y-2">
        <p>Add Swimlane for this project?</p>
        <Form :submit="addSwimlane" class="space-y-2 max-w-80">
            <!-- Form fields go here -->
            <Input type="text" id="swimlane-name" label="Swimlane Name" v-model="swimlane_name" placeholder="test" />
            <Button type="submit" class="justify-self-end">Add Swimlane</Button>
        </Form>
        <p>Delete Swimlane on this project?</p>
        <div class="flex flex-wrap gap-2">
            <ul v-for="swimlane in selectedProject.swimlanes" :key="swimlane.id">
                <li class="flex items-center gap-4 bg-gray-200 w-max pl-1">
                    <p class="font-medium">{{ swimlane.swimlane_name }}</p> <Button color="danger"
                        @click="removeSwimlane(swimlane.id)">
                        <AkTrashCan class="size-4 text-red-900" />
                    </Button>
                </li>
            </ul>
        </div>
    </div>
</template>