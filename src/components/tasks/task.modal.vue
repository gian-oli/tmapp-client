<script setup lang="ts">
import { Priority, Statuses, TasksFormTypes, User } from '@/types';
import { AkEdit, CaTaskAdd, MdAssignmentAdd } from '@kalimahapps/vue-icons';
import { Input, Form, RadioButton, Button } from '../utilities';
import { computed, inject, Ref } from 'vue';

defineProps<{
    submitFn: () => void,
    task_form: TasksFormTypes,
    store?: boolean
}>()

const priorities_injector = inject<Ref<Priority[]>>("priorities");
const user_injector = inject<Ref<User[]>>("users");
const statuses_injector = inject<Ref<Statuses[]>>("statuses");

const priorities = computed(() => priorities_injector?.value || []);
const users = computed(() => user_injector?.value || []);
const statuses = computed(() => statuses_injector?.value || []);
</script>
<template>
    <div v-if="store" class="flex items-center gap-2 mb-2">
        <CaTaskAdd class="size-5 text-blue-600" />
        <p> Add Task</p>
    </div>
    <div v-else class="flex items-center gap-2 mb-2">
        <AkEdit class="size-5 text-yellow-600" />
        <p> Edit Task</p>
    </div>
    <Form :submit="submitFn" class="space-y-3">
        <Input type="text" label="Ticket Title" id="ticket_title" v-model="task_form.title" required />
        <Input type="text" label="Ticket Description" id="ticket_description" v-model="task_form.description"
            required />
        <Input type="date" label="Ticket Due Date" id="ticket_due_date" v-model="task_form.due_date" required />
        <Input @focus="task_form.user_id = null" type="text" :options="users" id="users"
            v-model="task_form.user_id" label="User" required />
        <div class="grid grid-cols-2">
            <div>
                <p>Priority</p>
                <div v-for="priority in priorities" :key="priority.id" class="flex gap-1">
                    <RadioButton :id="priority.priority_name" :name="priority.priority_name" :value="priority.id"
                        :label="priority.priority_name" v-model="task_form.priority_id" :labelClass="`mb-2`"
                        inputClass="mx-2" indicatorClass="transition-colors" textClass="text-xs" />
                </div>
            </div>
            <div>
                <p>Status</p>
                <div v-for="status in statuses" :key="status.id" class="flex gap-1">
                    <RadioButton :id="status.status" :name="status.status" :value="status.id" :label="status.status"
                        v-model="task_form.status_id" labelClass="mb-2" inputClass="mx-2"
                        indicatorClass="transition-colors" textClass="text-xs" />
                </div>
            </div>
        </div>
        <Button type="submit" class="p-2 w-full text-sm flex items-center justify-center gap-1">
            <MdAssignmentAdd /> Submit
        </Button>
    </Form>
</template>