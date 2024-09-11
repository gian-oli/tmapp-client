<script setup lang="ts">
import Button from '@/components/utilities/Button.vue';
import Form from '@/components/utilities/Form.vue';
import Input from '@/components/utilities/Input.vue';
import { useLoginStore } from '@/modules';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const loginStore = useLoginStore()

const router = useRouter() // Assuming you have a router setup

const initialCredentials = {
    username: 'gian',
    password: '12345678',
}
const credentials = ref<{
    username: string,
    password: string,
}>({ ...initialCredentials })

const loadingState = ref(false)

const userLogin = () => {
    loadingState.value = true
    try {
        loginStore.setLogin({ ...credentials.value }).then((res) => {
            if (res?.token == undefined) {
                loadingState.value = false;
                return;
            }
            // Redirect to dashboard or home page
            router.push({name: 'Dashboard'}).then(() => {

                loadingState.value = false;
            })
        })
    } catch (error) {
        loadingState.value = false;
        // Handle error here
        console.error('Error logging in:', error);
    }
}

const validateAlphanumeric = (event: Event) => {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^a-zA-Z0-9]/g, '');
    credentials.value.password = input.value;
};

</script>
<template>
    <div class="h-screen flex items-center justify-center bg-blue-50">
        <div class="p-5 bg-white w-80">
            <Form :submit="userLogin" class="space-y-4">
                <!-- Your form fields here -->
                <p class="font-medium">Welcome to TMAPP</p>
                <Input v-model="credentials.username" id="username" label="Username" class="bg-white"
                    autocomplete="username" />
                <Input v-model="credentials.password" type="password" id="password" autocomplete='current-password'
                    class="bg-white" label="Password" @input="validateAlphanumeric" />
                <Button :disabled="loadingState" type="submit" class="w-full flex items-center justify-center disabled:bg-gray-400 hover-none" size="md">
                <p v-if="!loadingState">Login</p>
                <div v-else class="w-6 h-6 border-t-4 border-solid rounded-full border-t-primary animate-spin"></div>
                </Button>
            </Form>
        </div>
    </div>
</template>