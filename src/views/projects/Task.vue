<script setup lang="ts">
import ProjectTestingMonitoring from '@/components/projects/project.testing.monitoring.vue';
import Button from '@/components/utilities/Button.vue';
import Form from '@/components/utilities/Form.vue';
import Input from '@/components/utilities/Input.vue';
import { useProjectsStore, useTasksStore } from '@/modules';
import { Priority, Profile, Project, TasksFormTypes, User } from '@/types';
import { format } from 'date-fns';
import { computed, inject, ref, Ref } from 'vue';

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
            await tasksStore.storeTask(task_form.value);
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
    <div class="space-y-2">
        <p>Add task?</p>
        <Form :submit="addTask" class="flex gap-2">
            <div class="flex flex-wrap gap-3">
                <!-- Title input field -->
                <div>
                    <Input id="title" label="Title" v-model="task_form.title" required />
                </div>

                <!-- Priority input field -->
                <div>
                    <Input id="priority" label="Priority" :options="priorities" v-model="task_form.priority_id"
                        required />
                </div>

                <!-- Team member selection (visible for Development projects) -->
                <div class="relative" v-if="selectedProject.project_type === 'Development'">
                    <Input id="team-member" label="Team Member" :options="team_members"
                        :disabled="team_members?.length === 0 || allowMultiple" v-model="task_form.user_id"
                        class="min-w-40" />
                    <router-link v-if="team_members?.length === 0" :to="{ name: 'TeamMember' }"
                        class="absolute top-5 italic hover:font-medium text-red-600 bg-white text-justify px-1 -mt-2">
                        No team member found.
                    </router-link>
                </div>

                <!-- Color input field -->
                <div class="flex min-w-40 gap-1">
                    <input type="color" class="h-full" v-model="task_form.color_name" disabled />
                    <Input type="text" v-model="task_form.color_name" id="color" label="Color" :options="colors" />
                </div>

                <!-- Description input field -->
                <div class="w-full">
                    <Input id="description" label="Description" isTextarea v-model="task_form.description" required />
                </div>

                <!-- Due date input field -->
                <div>
                    <Input id="due-date" label="Due Date" type="date" v-model="task_form.due_date" required />
                </div>

                <!-- Assigned by input field -->
                <div>
                    <Input id="assigned-by" label="Assigned By" :options="users" v-model="task_form.assigned_by"
                        required />
                </div>

                <!-- Submit button -->
                <div class="w-full">
                    <Button type="submit" :disabled="swimlanes?.length === 0"
                        :class="`disabled:cursor-not-allowed disabled:bg-gray-300 disabled:opacity-50`">
                        Add Task
                    </Button>
                </div>
            </div>

            <!-- Swimlane selection (visible for non-Testing projects) -->
            <div v-if="selectedProject.project_type !== 'Testing'" class="max-w-80 relative min-w-40 space-y-3">
                <Input id="swimlane" label="Swimlane" :options="swimlanes" :disabled="swimlanes?.length === 0"
                    v-model="task_form.swimlane_id" class="peer" required />
                <router-link v-if="swimlanes?.length === 0" :to="{ name: 'Swimlane' }"
                    title="Add a swimlane to continue"
                    class="absolute top-0 italic hover:font-medium text-red-600 bg-white text-justify cursor-pointer px-1 -mt-2">
                    No Swimlanes found.
                </router-link>
            </div>
        </Form>
        <div v-if="selectedProject.project_type == 'Testing'" class="flex gap-2 flex-wrap">
            <!-- {{ selectedProject.swimlanes }} -->
            <ProjectTestingMonitoring :data="selectedProject.swimlanes" />
        </div>
        <div v-else>
        </div>
    </div>
</template>
