<script setup lang="ts">
import { Modal } from '@/components/utilities';
import Button from '@/components/utilities/Button.vue';
import Form from '@/components/utilities/Form.vue';
import Input from '@/components/utilities/Input.vue';
import { useLoginStore, useRoleStore, useUsersStore } from '@/modules';
import { Role } from '@/types';
import { computed, inject, onMounted, Ref, ref } from 'vue';
import { useRouter } from 'vue-router';

const loginStore = useLoginStore()
const roleStore = useRoleStore()
const userStore = useUsersStore()
const router = useRouter() // Assuming you have a router setup

const initialCredentials = {
    username: 'gian',
    password: '12345678',
}
const credentials = ref<{
    username: string,
    password: string,
}>({ ...initialCredentials })

const initialForm = {
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
    role_id: 1,
}
const form = ref<{
    username: string,
    email: string,
    password: string,
    password_confirmation: string,
    role_id: number | string,
}>(initialForm)

const loadingState = ref(false)

const roles_inject = inject('roles') as Ref<Role[]>

const roles = computed(() => roles_inject.value.map((role) => ({
    label: role.role_name,
    value: role.id,
})));

const userLogin = () => {
    loadingState.value = true
    try {
        loginStore.setLogin({ ...credentials.value }).then((res) => {
            if (res?.token == undefined) {
                loadingState.value = false;
                return;
            }
            // Redirect to dashboard or home page
            router.push({ name: 'Dashboard' }).then(() => {

                loadingState.value = false;
            })
        })
    } catch (error) {
        loadingState.value = false;
        // Handle error here
        console.error('Error logging in:', error);
    }
}

const registerModal = ref(false)

const registerUser = async () => {
    if (!validateForm()) {
        return; // Prevent registration if validation fails
    }
    loadingState.value = true
    try {
        await userStore.addUsers(form.value)
    } catch (e) {
        console.log(e)
    } finally {
        loadingState.value = false;
        registerModal.value = false
    }
}

const validatePassword = (password: string): boolean => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
};

const validateForm = (): boolean => {
    if (form.value.password !== form.value.password_confirmation) {
        alert('Passwords do not match!');
        return false;
    }
    if (!validatePassword(form.value.password)) {
        alert('Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long.');
        return false;
    }
    return true;
};

onMounted(() => {
    roleStore.loadRoles()
})

</script>
<template>
    <div class="h-screen flex justify-center bg-[url('@/assets/images/background1.jpg')] bg-cover items-center">
        <div class="p-5 bg-white/80 w-80 rounded h-max">
            <Form :submit="userLogin" class="space-y-4">
                <!-- Your form fields here -->
                <p class="font-medium">Welcome to TMAPP</p>
                <Input v-model="credentials.username" id="username" label="Username" class="bg-white"
                    autocomplete="username" />
                <!-- <Input v-model="credentials.password" type="password" id="password" autocomplete='current-password'
                    class="bg-white" label="Password" @input="validateAlphanumeric" /> -->
                <Input v-model="credentials.password" type="password" id="password" autocomplete='current-password'
                    class="bg-white" label="Password" />
                <p class="text-xs">No account? <button type="button" @click="registerModal = true"
                        class="inline-block text-blue-600 italic">Click here</button> to register</p>
                <Button :disabled="loadingState" type="submit"
                    class="w-full flex items-center bg-blue-600 hover:bg-blue-700 text-white justify-center disabled:bg-blue-400 hover-none"
                    size="md">
                    <p v-if="!loadingState">Login</p>
                    <div v-else class="w-6 h-6 border-t-4 border-solid rounded-full border-t-blue-800 animate-spin">
                    </div>
                </Button>
            </Form>
        </div>
    </div>
    <Modal :visible="registerModal" @update:visible="registerModal = $event">
        <Form :submit="registerUser" class="space-y-4">
            <!-- Your form fields here -->
            <p class="font-medium">Register an account!</p>
            <Input v-model="form.username" id="username" label="Username" class="bg-white" />
            <Input v-model="form.email" id="email" label="Email" type="email" class="bg-white" />
            <Input v-model="form.role_id" id="role" class="bg-white" label="Role" :options="roles" />
            <Input v-model="form.password" type="password" id="password" class="bg-white" label="Password" />
            <Input v-model="form.password_confirmation" type="password" id="password_confirmation" class="bg-white"
                label="Confirm Password" />
            <Button :disabled="loadingState" type="submit"
                class="w-full flex items-center bg-blue-600 hover:bg-blue-700 text-white justify-center disabled:bg-blue-400 hover-none"
                size="md">
                <p v-if="!loadingState">Login</p>
                <div v-else class="w-6 h-6 border-t-4 border-solid rounded-full border-t-blue-800 animate-spin">
                </div>
            </Button>
        </Form>
    </Modal>
</template>