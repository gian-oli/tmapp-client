<script setup lang="ts">
import { Input, Button, Form } from '@/components/utilities';
import { Project, User } from '@/types';
import { computed, inject, ref, Ref } from 'vue';

const injectProjects = inject('selectedProject') as Ref<Project>
const injectUsers = inject('users') as Ref<User[]>
const users = computed(() => injectUsers.value.map(user => ({
    value: user.id,
    label: user.username
})));
const project = computed(() => injectProjects)

const selectUserId = ref()

const addTeamMember = () => {

}
</script>
<template>
    <div class="space-y-3">
        <p>Add a team member for this project?</p>
        <Form :submit="addTeamMember" class="w-40 space-y-2">
            <Input id="user-select" label="Select a User" :options="users" v-model="selectUserId" />
            <Button class="font-medium">Add Member</Button>
        </Form>
        <p>Project Current Members: {{ project.value.team_members?.length }}</p>
        <div v-if="project.value.team_members.length > 0">
            <ul>
                <li v-for="member in project.value.team_members" :key="member?.team_member_id">
                    {{ member.username }}
                </li>
            </ul>
        </div>
        <p v-else> No current members</p>
    </div>
</template>