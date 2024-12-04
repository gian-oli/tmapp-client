<template>
    <div v-if="isVisible" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="w-72 rounded-lg shadow-lg overflow-hidden">
            <div class="relative flex justify-center p-4" :class="headerClass">
                <span class="absolute top-2 right-2 cursor-pointer text-2xl" @click="cancel">&times;</span>
                <div class="w-20 h-32 rounded-full flex items-center justify-center" :class="iconTypeClass">
                    <div class="w-12 h-12 text-white" v-html="icon"></div>
                </div>
            </div>
            <div class="bg-white p-5 text-center">
                <h2 class="text-xl font-bold mb-2">{{ title }}</h2>
                <div class="mb-5" v-html="message"></div>
            </div>
            <div class="flex justify-center gap-2 p-4 bg-white">
                <button @click="confirm" class="px-4 py-2 rounded text-white" :class="confirmButtonClass">
                    {{ confirmButtonText ?? 'Okay' }}
                </button>
                <button v-if="type !== 'success'" @click="cancel" class="px-4 py-2 rounded bg-gray-300 text-black">
                    {{ cancelButtonText ?? 'Cancel' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted } from 'vue';

const props = defineProps<{
    title: string;
    message: string;
    isVisible: boolean;
    type: 'success' | 'error' | 'info' | 'warning';
    confirmButtonText?: string;
    cancelButtonText?: string;
}>();

const emit = defineEmits<{
    (e: 'confirm'): void;
    (e: 'cancel'): void;
}>();

// Mapping of type to icon SVGs
const iconMap = {
    success: `
    <svg xmlns="http://www.w3.org/2000/svg" class="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  `,
    error: `
    <svg xmlns="http://www.w3.org/2000/svg" class="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  `,
    info: `
    <svg xmlns="http://www.w3.org/2000/svg" class="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  `,
    warning: `
    <svg xmlns="http://www.w3.org/2000/svg" class="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 2l9 16H3L12 2z" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01" />
    </svg>
  `,
};

// Computed properties for dynamic styling
const headerClass = computed(() => {
    switch (props.type) {
        case 'success': return 'bg-green-500 text -white';
        case 'error': return 'bg-red-500 text-white';
        case 'warning': return 'bg-yellow-500 text-white';
        case 'info': return 'bg-blue-500 text-white';
        default: return 'bg-gray-500 text-white';
    }
});

const iconTypeClass = computed(() => {
    switch (props.type) {
        case 'success': return 'bg-green-500';
        case 'error': return 'bg-red-500';
        case 'warning': return 'bg-yellow-500';
        case 'info': return 'bg-blue-500';
        default: return 'bg-gray-500';
    }
});

const confirmButtonClass = computed(() => {
    switch (props.type) {
        case 'success': return 'bg-green-500 hover:bg-green-600 text-white';
        case 'error': return 'bg-red-500 hover:bg-red-600 text-white';
        case 'warning': return 'bg-yellow-500 hover:bg-yellow-600 text-white';
        case 'info': return 'bg-blue-500 hover:bg-blue-600 text-white';
        default: return 'bg-gray-500 hover:bg-gray-600 text-white';
    }
});

// Methods for handling button clicks
const confirm = () => {
    emit('confirm');
    cancel()
};

const cancel = () => {
    emit('cancel');
};

const handleKeydown = (event: KeyboardEvent) => {
    event.preventDefault()
    if (event.key === 'Escape') {
        cancel(); // Close the alert
    } else if (event.key === 'Enter') {
        confirm()
    }
};


// Setup event listener on mount and cleanup on unmount
onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown);
});

// Set the icon based on the type
const icon = computed(() => iconMap[props.type]); 
</script>

<style scoped>
/* Add any additional styles here */
</style>