<script setup lang="ts">
import ProjectTestingMonitoring from '@/components/projects/project.testing.monitoring.vue';
import Button from '@/components/utilities/Button.vue';
import Form from '@/components/utilities/Form.vue';
import Input from '@/components/utilities/Input.vue';
import MarkdownEditor from '@/components/utilities/MarkdownEditor.vue';
import { useProjectsStore, useTasksStore } from '@/modules';
import { Priority, Profile, Project, TasksFormTypes, User } from '@/types';
import { format } from 'date-fns';
import { computed, inject, ref, Ref } from 'vue';

import { useRoute } from "vue-router";


const route = useRoute()
const getId = computed(() => route.params.id)

// Initialize stores for managing projects and tasks
const tasksStore = useTasksStore();
const projectStore = useProjectsStore();

// Reactive reference for allowing multiple selections
const allowMultiple = ref(false);

// Injected references from parent components or context
const selectedProject = inject("selectedProject") as Ref<Project>;
const injectPriorities = inject("priorities") as Ref<Priority[]>;
const injectUsers = inject('users') as Ref<User[]>;
const injectProfile = inject('profile') as Ref<Profile>;

// Compute available swimlanes and team members based on the selected project
const swimlanes = computed(() => selectedProject.value.swimlanes?.map(swimlane => ({
    value: swimlane.id,
    label: swimlane.swimlane_name
})));

const team_members = computed(() => selectedProject.value.team_members?.map(team => ({
    value: team.user.id,
    label: team.user.username
})));

const priorities = computed(() => injectPriorities.value.map(priority => ({
    value: priority.id,
    label: priority.priority_name
})));

const users = computed(() => injectUsers.value.map(user => ({
    value: user.email,
    label: user.email
})));

// Initial form setup with default values
const initial_task_form = {
    title: '',
    priority_id: '',
    due_date: format(new Date(), 'yyyy-MM-dd'),
    assigned_by: injectProfile.value.email,
    start_date: '',
    description: '',
    user_id: '',
    color_name: '#f1efb1',
    project_id: '',
    swimlane_id: ''
};

// Reactive reference for the task form
const task_form = ref<TasksFormTypes>({ ...initial_task_form });

// Color options for the task form
const colors = ref([
    { value: '#f1efb1', label: 'Yellow' },
    { value: '#76aeea', label: 'Blue' },
    { value: '#c5f2b5', label: 'Green' },
    { value: '#d1caf7', label: 'Purple' },
    { value: '#ee9696', label: 'Red' }
]);

// Function to add a task
const addTask = async () => {
    // Set the project ID for the task
    task_form.value.project_id = selectedProject.value.id;

    try {
        if (selectedProject.value.project_type === 'Testing') {
            // Map swimlanes to tasks if the project type is 'Testing'
            const tasks: TasksFormTypes[] = swimlanes.value
                .map(swimlane => {
                    if (team_members.value.length === 0) return undefined;

                    // Find the corresponding team member
                    const teamMember = team_members.value.find(team =>
                        team.label.toLowerCase() === swimlane.label.toLowerCase()
                    );

                    if (!teamMember) return undefined;

                    return {
                        ...task_form.value,
                        user_id: teamMember.value,
                        swimlane_id: swimlane.value
                    } as TasksFormTypes;
                })
                .filter((task): task is TasksFormTypes => task !== undefined);

            // Store tasks in batch
            await tasksStore.batchTaskStore({ tasks });
        } else {
            // Store a single task for non-Testing projects
            const result = await tasksStore.storeTask(task_form.value);
            if( result ) {
                task_form.value = {...initial_task_form}
            }
        }
    } catch (error) {
        console.error('Error adding task:', error);
    } finally {
        // Reset the form and update the project store
        projectStore.setSingleProject(selectedProject.value.id);
        task_form.value = { ...initial_task_form };
        console.log('Task added successfully');
    }
};
</script>

<template>
    {{ getId }}
    <div class="bg-white rounded-lg space-y-6 overflow-y-auto h-[50vh]">
        <h2 class="text-2xl font-bold text-gray-800">Add a New Task</h2>
        <Form :submit="addTask" class="flex flex-col gap-4 p-2">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Title input field -->
                <Input id="title" label="Title" v-model="task_form.title" required class="bg-gray-100" />

                <!-- Priority input field -->
                <Input id="priority" label="Priority" :options="priorities" v-model="task_form.priority_id" required
                    class="bg-gray-100" />
            </div>

            <!-- Team member selection (visible for Development projects) -->
            <div v-if="selectedProject.project_type === 'Development'">
                <Input id="team-member" label="Team Member" :options="team_members"
                    :disabled="team_members?.length === 0 || allowMultiple" v-model="task_form.user_id"
                    class="bg-gray-100" />
                <router-link v-if="team_members?.length === 0" :to="{ name: 'TeamMember' }"
                    class="text-red-600 italic hover:underline">
                    No team member found. Click here to add one.
                </router-link>
            </div>

            <!-- Flex container for color picker and swimlane -->
            <div class="flex items-center gap-4">
                <div class="flex items-center">
                    <input type="color" v-model="task_form.color_name" class="w-10 h-10 border rounded-lg" />
                    <Input type="text" v-model="task_form.color_name" id="color" label="Color" :options="colors"
                        class="bg-gray-100" />
                </div>

                <!-- Swimlane selection -->
                <Input id="swimlane" label="Swimlane" :options="swimlanes" :disabled="swimlanes?.length === 0"
                    v-model="task_form.swimlane_id" class="bg-gray-100" />
                <router-link v-if="swimlanes?.length === 0" :to="{ name: 'Swimlane' }"
                    class="text-red-600 italic hover:underline">
                    No Swimlanes found. Click here to add one.
                </router-link>
            </div>

            <!-- Due date input field -->
            <Input id="due-date" label="Due Date" type="date" v-model="task_form.due_date" required
                class="bg-gray-100" />

            <!-- Assigned by input field -->
            <Input id="assigned-by" label="Assigned By" :options="users" v-model="task_form.assigned_by" required
                class="bg-gray-100" />

            <!-- Description input field -->
            <div class="space-y-2">
            <p class="text-gray-600">Description</p>
                <MarkdownEditor v-model="task_form.description" />
            </div>
            <!-- Submit button placed above the Swimlane input -->
            <Button type="submit" :disabled="swimlanes?.length === 0"
                class="bg-blue-600 text-white hover:bg-blue-700 w-max transition-all duration-200 py-4 px-8 text-base">
                Add Task
            </Button>

            <!-- Conditional display for Testing project type -->
            <div v-if="selectedProject.project_type === 'Testing'" class="flex gap-2 flex-wrap">
                <ProjectTestingMonitoring :data="selectedProject.swimlanes" />
            </div>
        </Form>
    </div>
</template>
