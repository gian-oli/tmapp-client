<script setup lang="ts">
import { inject, computed, Ref } from "vue";
import { BsEyeFill, CaSendAltFilled } from "@kalimahapps/vue-icons";
import { marked } from "marked";
import { format } from "date-fns";
import { Task } from "@/types";

// Injecting task data as a Ref<Task | undefined>
const task_injector = inject<Ref<Task | undefined>>("taskData");

// Computed property for task data with a fallback to a complete Task object
const taskData = computed(() => task_injector?.value || {
  title: '',
  description: '',
  user: { username: 'Unassigned' },
  start_date: null,
  finished_at: null,
  color_name: 'transparent',
  comments: []
});

// Computed property for the description with a fallback
const description = computed(() => marked(taskData.value.description || ""));
</script>

<template>
  <div class="task-card p-6 border rounded-lg shadow-md mb-4 transition-transform mt-10 backdrop-blur-md bg-white bg-opacity-80">
    <div class="flex items-center mb-4">
      <div class="color-indicator" :style="{ backgroundColor: taskData.color_name || '#ccc' }"></div>
      <BsEyeFill class="size-6 mr-3 text-gray-600" />
      <h2 class="text-2xl font-semibold text-gray-800">{{ taskData.title || 'No Title' }}</h2>
    </div>
    <div class="description bg-gray-100 p-4 rounded-lg shadow-inner min-h-32 max-h-60 overflow-y-auto">
      <span v-html="description" class="text-gray-700 prose prose-lg"></span>
    </div>
    <div class="info mt-4 text-gray-600">
      <div class="flex justify-between">
        <span><strong>Assigned to:</strong> {{ taskData.user.username || 'Unassigned' }}</span>
        <span><strong>Start Date:</strong> {{ taskData.start_date ? format(new Date(taskData.start_date), "MMM dd, yyyy h:mmaaa") : 'Not Started' }}</span>
      </div>
      <div class="flex justify-between mt-2">
        <span><strong>Finished Date:</strong> {{ taskData.finished_at ? format(new Date(taskData.finished_at), "MMM dd, yyyy h:mmaaa") : 'Not Finished' }}</span>
      </div>
    </div>
    <div class="comments-section mt-4">
      <h3 class="font-semibold text-gray-800">Comments:</h3>
      <div class="comment-list mt-2">
        <div v-for="(comment, i) in taskData.comments" :key="i" class="border-b py-2 text-gray-600">
          {{ comment }}
        </div>
      </div>
    </div>
    <form class="mt-4">
      <label for="comment" class="block mb-1 text-gray-700">Add Comment:</label>
      <textarea id="comment" class="not-resizable w-full border rounded-lg p-2" rows="3" placeholder="Type your comment here..." required></textarea>
      <Button class="w-full mt-2 p-2 flex justify-center items-center text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition duration-200">
        <CaSendAltFilled class="size-7" />
        <span class="ml-2">Send</span>
      </Button>
    </form>
  </div>
</template>

<style scoped>
.task-card {
  transition: transform 0.2s ease;
}


.color-indicator {
  width: 12px; /* Adjust size as needed */
  height: 12px; /* Adjust size as needed */
  border-radius: 50%; /* Make it a circle */
  margin-right: 10px; /* Space between indicator and title */
}

.description {
  border-radius: 0.5rem;
}

textarea {
  resize: none;
}

.comments-section {
  margin-top: 1rem;
}

.comment-list {
  max-height: 200px;
  overflow-y: auto;
}

.comment-list div {
  border-bottom: 1px solid #e5e7eb; /* Light gray border */
}

</style>