<script setup lang="ts">
import { Button, Input } from '@/components/utilities';
import { useUsersStore } from '@/modules';
import { User } from '@/types';
import { computed, onMounted, ref } from 'vue';
const userStore = useUsersStore()

const users = computed(() => userStore.getUsers)

const selectUser = ref<User | null>()

const form = ref({
    username: '',
    role_id: null,
    email: '',
})

const viewUser = computed(() => selectUser.value)

const view = (user: User) => {
    selectUser.value = user
    form.value.username = user.username
    form.value.email = user.email
}

onMounted(() => {
    userStore.setUsers()
})
</script>
<template>
    <div class="h-full overflow-hidden bg-white rounded-sm p-2 text-xs flex">
        <div class="rounded-t w-40">
            <div class="flex justify-between items-center bg-blue-400 p-2 rounded-t">
                <p class="text-white">New user</p>
                <Button>Add</Button>
            </div>
            <div class="p-2 flex flex-col gap-1">
                <span @click="view(user)" v-for="user in users" :key="user.id"
                    :class="`cursor-pointer hover:bg-blue-100 p-2 rounded text-center border ${viewUser ? viewUser.id == user.id ? 'bg-blue-200' : '' : ''}`">
                    <p class="capitalize font-medium">{{ user.username }}</p>
                    <p class="text-[9px] text-red-400">{{ user.role_name }}</p>
                </span>
            </div>
        </div>
        <div class="p-2 flex-1 relative">
            <div v-if="viewUser" class="flex flex-col items-center justify-center gap-4">
                <div class="w-40 h-40 rounded-full bg-gray-200"></div>
                <Input id="username" v-model="form.username" label="Username" class="w-80 text-center font-bold"/>
                <Input id="email" v-model="form.email" label="Email" class="w-80 text-center font-bold"/>
                <!-- <Input id="role" v-model="form.role" label="role" /> -->
            </div>
            <div v-else class="flex flex-col items-center justify-center gap-2">
                <p class="text-gray-400 italic absolute top-4 left-4">Select a user to view and edit user profile</p>
                <div class="w-40 h-40 rounded-full bg-gray-200 animate-pulse"></div>
                <div class="w-60 h-10 bg-gray-200 animate-pulse"></div>
                <div class="w-60 h-10 bg-gray-200 animate-pulse"></div>
                <div class="w-60 h-10 bg-gray-200 animate-pulse"></div>
            </div>
        </div>
    </div>
</template>