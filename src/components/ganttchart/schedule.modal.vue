<script setup lang="ts">
import { computed, inject, Ref, ref } from 'vue';
import { Button, Form, Input } from '../utilities';
import { SuCalendarAdd } from '@kalimahapps/vue-icons';
import { User } from '@/types';

const props = defineProps<{
    createSchedule: (form: {
        name: string,
        user_id: string,
        status: string,
    }) => void
}>()

const initial_form = ref({
    name: '',
    user_id: '',
    status: 'Pending',
})
const form = ref(initial_form)
const user_injector = inject<Ref<User[]>>("users");
const users = computed(() => user_injector?.value.map((user) => ({
    label: user.username,
    value: user.id,
})));
const submitSchedule = () => {
    props.createSchedule(form.value)
    form.value = initial_form.value; 
}
</script>
<template>
    <div class="space-y-2">
        <p>Create Schedule</p>
        <Form :submit="submitSchedule" class="space-y-4">
            <Input id="development-name" label="Development Name" v-model="form.name" required />
            <Input @focus="form.user_id = ''" type="text" :options="users" id="users" v-model="form.user_id"
                label="User" required />
            <Input id="status" label="Status" v-model="form.status" :options="[
                {
                    value: 'Pending', label: 'Pending'
                },
                {
                    value: 'Ongoing', label: 'Ongoing'
                },
                {
                    value: 'On-Schedule', label: 'On-Schedule'
                },
                {
                    value: 'Delayed', label: 'Delayed'
                }
            ]" required />
            <Button type="submit" class="w-full p-2 items-center justify-center">
                <SuCalendarAdd class="size-5" />Create
            </Button>
        </Form>
    </div>
</template>