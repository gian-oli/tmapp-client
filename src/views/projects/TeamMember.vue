<script setup lang="ts">
import { Input, Button, Form } from '@/components/utilities';
import { useProjectsStore, useSwimlaneStore, useTeamMembersStore } from '@/modules';
import { Project, User } from '@/types';
import { computed, inject, ref, Ref } from 'vue';

const teamMemberStore = useTeamMembersStore()
const projectStore = useProjectsStore()
const swimlaneStore = useSwimlaneStore()

const injectProjects = inject('selectedProject') as Ref<Project>
const injectUsers = inject('users') as Ref<User[]>
const injectStateViewProject = inject('stateViewProject') as Ref<Project>;

const stateViewProject = computed(() => injectStateViewProject.value)

const project = computed(() => injectProjects.value)
const allUsers = computed(() => injectUsers.value)
const users = computed(() => {
    return injectUsers.value
        .filter(user => {
            // Safeguard for undefined or non-array team_members
            const teamMembers = project.value.team_members || [];
            return !teamMembers.find(member => member.user_id === user.id);
        })
        .map(user => ({
            value: user.id,
            label: user.username
        }));
});
const selectUserId = ref<string | number>('')

const addTeamMember = async () => {
    try {
        if (!selectUserId.value) return
        if (project.value.project_type == 'Testing') {
            const user = allUsers.value.find(v => v.id == selectUserId.value)
            await swimlaneStore.storeSwimlane({
                swimlane_name: user?.username,
                project_id: project.value.id,
                project_type: project.value.project_type
            })
        }
        await teamMemberStore.storeTeamMember({
            user_id: selectUserId.value,
            project_id: project.value.id
        })

    } catch (error) {
        console.error('Failed to add team member:', error)
    } finally {
        console.log('Team member added successfully!')
        selectUserId.value = '' // Reset the select input
        projectStore.setSingleProject(stateViewProject.value?.id)
    }
}

</script>

<template>
    <div class="space-y-3">
        <p>Add a team member for this project?</p>
        <Form :submit="addTeamMember" class="w-40 space-y-2">
            <Input :disabled="users.length == 0" class="disabled:cursor-not-allowed" id="user-select"
                label="Select a User" :options="users" v-model="selectUserId" required />
            <Button :disabled="users.length == 0" type="submit"
                class="font-medium disabled:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">Add
                Member</Button>
        </Form>
        <i v-if="users.length == 0">All users are included on this project</i>
        <p>Project Current Members: {{ project.team_members?.length }}</p>
        <div v-if="project.team_members?.length > 0">
            <ul v-for="member in project.team_members" :key="member?.id">
                <li class="px-2 font-medium">
                    {{ member.user.username }}
                </li>
            </ul>
        </div>
        <p v-else> No current members</p>
    </div>
</template>
