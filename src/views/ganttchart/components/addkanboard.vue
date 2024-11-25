<script setup lang="ts">
import { Button, Form, Input } from "@/components/utilities";
import { Priority, Schedule, Statuses, User } from "@/types";
import { AnOutlinedFundProjectionScreen } from "@kalimahapps/vue-icons";
import { computed, inject, Ref, ref } from "vue";
import { ProjectFormTypes } from "@/types/projects.types";

const props = defineProps<{
  createKanboard: (payload: ProjectFormTypes) => void;
}>();

const form = ref({
  project_name: "",
  deadline: "",
  user_id: "",
  priority_id: "",
  project_type: "",
  status_id: "",
  schedule_id: "",
});

const submitForm = () => {
  props.createKanboard(form.value)
};
const statuses_injector = inject<Ref<Statuses[]>>("statuses");
// const statuses = computed(() => statuses_injector?.value || []);
const priorities_injector = inject<Ref<Priority[]>>("priorities");
// const priorities = computed(() => priorities_injector?.value || []);
const schedules_injector = inject<Ref<Schedule[]>>("schedules");

const user_injector = inject<Ref<User[]>>("users");

const users = computed(() =>
  user_injector?.value.map((user) => ({
    label: user.username,
    value: user.id,
  }))
);

const statuses = computed(() =>
  statuses_injector?.value.map((status) => ({
    label: status.status,
    value: status.id,
  }))
);

const priorities = computed(() =>
  priorities_injector?.value.map((priority) => ({
    label: priority.priority_name,
    value: priority.id,
  }))
);

const schedules = computed(() =>
  schedules_injector?.value.map((schedule) => ({
    label: schedule.name,
    value: schedule.id,
  }))
);
</script>
<template>
  <div class="text-base font-medium flex gap-2 items-center text-gray-500 border-b py-2">
    <AnOutlinedFundProjectionScreen class="size-5" />
    Add Kanboard
  </div>
  <div class="p-5">
    <Form :submit="submitForm" class="space-y-10">
      <Input id="kanboard" label="Kanboard name" v-model="form.project_name" required />
      <Input
        id="project_type"
        v-model="form.project_type"
        label="Project Type"
        :options="[
          { value: 'Development', label: 'Development' },
          { value: 'Testing', label: 'Testing' },
        ]"
        required
      />
      <Input
        @focus="form.schedule_id = ''"
        type="text"
        :options="schedules"
        id="schedule"
        v-model="form.schedule_id"
        label="Schedule"
        required
      />
      <Input
        @focus="form.user_id = ''"
        type="text"
        :options="users"
        id="users"
        v-model="form.user_id"
        label="User"
        required
      />
      <Input
        @focus="form.status_id = ''"
        type="text"
        :options="statuses"
        id="users"
        v-model="form.status_id"
        label="Status"
        required
      />
      <Input
        @focus="form.priority_id = ''"
        type="text"
        :options="priorities"
        id="users"
        v-model="form.priority_id"
        label="Priority"
        required
      />
      <Input
        type="date"
        id="gantt-name"
        label="Deadline"
        v-model="form.deadline"
        required
      />
      <Button type="submit" class="w-full p-2 flex justify-center gap-1 items-center">
        <MdAddChart class="size-5" /> Add
      </Button>
    </Form>
  </div>
</template>
