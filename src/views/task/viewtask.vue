<script setup lang="ts">
import { inject, computed } from "vue";
import { BsEyeFill, CaSendAltFilled } from "@kalimahapps/vue-icons";
import { marked } from "marked";
import { format } from "date-fns";
const task_injector = inject("taskData");
const taskData = computed(() => task_injector.value);
const description = computed(() => marked(taskData.value.description || ""));
</script>
<template>
  <div class="flex gap-2 items-center border-b p-2 mr-8 mb-2" :style="{ backgroundColor: taskData.color_name }">
    <BsEyeFill class="size-5" />View Task
  </div>
  <div class="space-y-1 flex flex-col">
    <span class="text-xl font-bold pb-1 border-b">{{ taskData.title }}</span>
    <span class="bg-gray-100 p-1 rounded min-h-32 max-h-60 overflow-y-scroll prose prose-lg" v-html="description"></span>
    <span>Assigned to: <b>{{ taskData.user.username }}</b></span>
    <span>Start Date: <b>{{ taskData.start_date ? format(taskData.start_date, "MMM dd, yyyy h:mmaaa") : '' }}</b></span>
    <span>Finished Date: <b>{{ taskData.finished_at ? format(taskData.finished_at, "MMM dd, yyyy h:mmaaa") : ''
        }}</b></span>
    <div class="min-h-20 max-h-80" v-for="(comment, i) in taskData.comment" :key="i">
      {{ comment }}
    </div>
    <form>
      <p>Comment:</p>
      <textarea class="not-resizable w-full border"></textarea>
      <Button
        class="w-full p-2 flex justify-center gap-1 items-center text-blue-400 primary w-min bg-gray-200 rounded border hover:bg-gray-100 place-self-end">
        <CaSendAltFilled class="size-7" />
      </Button>
    </form>
  </div>
</template>
