<script setup lang="ts">

defineProps<{
    isVisible: Boolean,
}>();

const emit = defineEmits<{
    (event: 'update:visible', value: boolean): void;
}>();

function closeModal() {
    emit('update:visible', false);
}


</script>

<template>
    <div v-if="isVisible" class="absolute mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-50 -translate right-0">
        <div class="p-4">
            <h2 class="text-lg font-semibold mb-2">Settings</h2>
            <p>This is the settings dialog content.</p>
            <button @click="closeModal" class="mt-4 bg-blue-500 text-white rounded-full px-4 py-2">
                Close
            </button>
        </div>
    </div>
</template>