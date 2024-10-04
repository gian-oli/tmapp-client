<script setup lang="ts">
import { AnOutlinedPlusSquare, IcSubmitDocument } from '@kalimahapps/vue-icons';
import { Form, Input, RadioButton, Button } from '../utilities';
import { Priority, Statuses, User, ProjectFormTypes } from '@/types';
import { computed, inject, Ref } from 'vue';

defineProps<{
  storeProject: () => void,
  post_project_form: ProjectFormTypes,
}>()

const priorities_injector = inject<Ref<Priority[]>>("priorities");
const user_injector = inject<Ref<User[]>>("users");
const statuses_injector = inject<Ref<Statuses[]>>("statuses");

const priorities = computed(() => priorities_injector?.value || []);
const users = computed(() => user_injector?.value.map((user) => ({
  label: user.username,
  value: user.id,
})));
const statuses = computed(() => statuses_injector?.value || []);

</script>
<template>
  <div class="flex items-center gap-1">
    <AnOutlinedPlusSquare class="text-blue-800 w-5 h-5" /> Add Project Form
  </div>
  <Form :submit="storeProject" class="space-y-4">
    <Input type="text" label="Project Name" id="project_name" v-model="post_project_form.project_name" required />
    <Input id="project_type" v-model="post_project_form.project_type" label="Project Type"
      :options="[{ value: 'Development', label: 'Development' }, { value: 'Testing', label: 'Testing' }]" required />
    <Input type="date" id="deadline" v-model="post_project_form.deadline" label="Deadline" required />
    <Input @focus="post_project_form.user_id = ''" type="text" :options="users" id="users"
      v-model="post_project_form.user_id" label="User" required />
    <div class="grid grid-cols-2">
      <div>
        <p>Priority</p>
        <div v-for="priority in priorities" :key="priority.id" class="flex gap-1">
          <RadioButton :id="priority.priority_name" :name="priority.priority_name" :value="priority.id"
            :label="priority.priority_name" v-model="post_project_form.priority_id" :labelClass="`mb-2`"
            inputClass="mx-2" indicatorClass="transition-colors" textClass="text-xs" />
        </div>
      </div>
      <div>
        <p>Status</p>
        <div v-for="status in statuses" :key="status.id" class="flex gap-1">
          <RadioButton :id="status.status" :name="status.status" :value="status.id" :label="status.status"
            v-model="post_project_form.status_id" labelClass="mb-2" inputClass="mx-2" indicatorClass="transition-colors"
            textClass="text-xs" />
        </div>
      </div>
    </div>
    <Button type="submit" class="p-2 w-full text-sm flex items-center justify-center gap-1">
      <IcSubmitDocument />Submit
    </Button>
  </Form>
</template>
