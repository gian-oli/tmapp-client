<template>
    <div class="min-h-screen bg-gray-100 p-6">
        <h1 class="text-3xl font-bold mb-6">Dashboard</h1>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Projects Card -->
            <div class="bg-white shadow-md rounded-lg p-4">
                <h2 class="text-xl font-semibold">Projects</h2>
                <ul>
                    <li v-for="project in projects" :key="project.id" class="border-b py-2">
                        {{ project.project_name }} - {{ project.status_id }}
                    </li>
                </ul>
            </div>

            <!-- Team Members Card -->
            <div class="bg-white shadow-md rounded-lg p-4">
                <h2 class="text-xl font-semibold">Team Members</h2>
                <ul>
                    <li v-for="member in teamMembers" :key="member.id" class="border-b py-2">
                        {{ member.user.username }}
                    </li>
                </ul>
            </div>

            <!-- Tasks Card -->
            <div class="bg-white shadow-md rounded-lg p-4">
                <h2 class="text-xl font-semibold">Tasks</h2>
                <ul>
                    <li v-for="task in tasks" :key="task.id" class="border-b py-2">
                        {{ task.title }} - {{ task.priority_id }}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Project, TeamMember, Task } from '@/types/index';

// Sample data
const projects = ref<Project[]>([
    { id: 1, project_name: 'Project A', project_type: 'Type A', deadline: '2023-12-31', finished_at: null, user_id: 1, priority_id: 1, status_id: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), deleted_at: null, manager: { id: 1, username: 'Manager A' }, swimlanes: [], team_members: [], priorities: { id: 1, priority_name: 'High' }, statuses: { id: 1, status: 'Ongoing', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), deleted_at: null } },
    // Add more projects as needed
]);

const teamMembers = ref<TeamMember[]>([
    { id: 1, user_id: 1, project_id: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), deleted_at: null, user: { id: 1, username: 'User  A', email: 'userA@example.com' } },
    // Add more team members as needed
]);

const tasks = ref<Task[]>([
    { id: 1, title: 'Task A', description: 'Description for Task A', due_date: '2023-11-30', finished_at: null, assigned_by: 'User  A', user_id: null, user: { id: 1, username: 'User  A' }, color_name: null, start_date: null, priority_id: 1, priorities: { id: 1, priority_name: 'High' }, column_id: 1, comments: [], created_at: new Date().toISOString(), updated_at: new Date().toISOString(), deleted_at: null },
    // Add more tasks as needed
]);
</script>

<style scoped>
/* Add any additional styles if necessary */
</style>