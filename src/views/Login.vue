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

const userLogin = () => {
    try {
        loginStore.setLogin({ ...credentials.value }).then((res) => {
            if (res?.token == undefined) {
                return;
            }
            // Redirect to dashboard or home page
            router.push({name: 'Dashboard'});
        })
    } catch (error) {
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
                <Button type="submit" class="w-full flex items-center justify-center" size="md">Login</Button>
            </Form>
        </div>
    </div>
</template>