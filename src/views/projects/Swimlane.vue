<script setup lang="ts">
import Button from '@/components/utilities/Button.vue';
import Form from '@/components/utilities/Form.vue';
import Input from '@/components/utilities/Input.vue';
import { Project } from '@/types';
import { AkTrashCan } from '@kalimahapps/vue-icons';
import { computed, inject, Ref } from 'vue';

const project = inject('selectedProject') as Ref<Project>

const selectedProject = computed(() => project)

const addSwimlane = () => {

}
</script>
<template>
    <div class="space-y-2">
        <p>Add Swimlane for this project?</p>
        <Form :submit="addSwimlane" class="space-y-2">
            <!-- Form fields go here -->
            <Input type="text" id="swimlane-name" label="Swimlane Name" placeholder="test" />
            <Button class="justify-self-end">Add Swimlane</Button>
        </Form>
        <p>Delete Swimlane on this project?</p>
        <div class="flex flex-wrap gap-2">
            <ul v-for="swimlane in selectedProject.value.swimlanes" :key="swimlane.id">
                <li class="flex items-center gap-4 bg-gray-200 w-max pl-1">
                    <p class="font-medium">{{ swimlane.swimlane_name }}</p> <Button color="danger"><AkTrashCan class="size-4 text-red-900" /> </Button>
                </li>
            </ul>
        </div>
    </div>
</template>