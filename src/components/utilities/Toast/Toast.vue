<template>
    <div class=" rounded shadow-lg transition-all w-80" :class="[
        toastClasses,
        { 'animate-fade-in': animated }
    ]">
        <div class="flex items-center justify-evenly w-full">
            <div class="mr-2" v-if="iconComponent || $slots.icon" :class="toastBgClasses">
                <slot name="icon">
                    <component :is="iconComponent" class="size-7" />
                </slot>
            </div>
            <div class="flex-grow">
                <div class="font-semibold" :class="titleTextClasses" v-if="title">{{ title }}</div>
                <div class="text-sm">{{ message }}</div>
            </div>
            <button class="ml-2 text-black hover:text-gray-200 self-start" @click="close">
                &times;
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    onMounted,
    onUnmounted,
    computed,
} from 'vue';
import { BsCheckCircleFill, BsExclamationCircleFill, BsExclamationTriangleFill, BsQuestionDiamondFill } from '@kalimahapps/vue-icons';

// Toast Types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

// Props Interface
interface ToastProps {
    message: string;
    title?: string;
    type?: ToastType;
    duration?: number;
    animated?: boolean;
}

// Define Props with Defaults
const props = withDefaults(defineProps<ToastProps>(), {
    type: 'info',
    duration: 3000,
    animated: true
});

// Define Emits
const emit = defineEmits<{
    (e: 'close'): void;
}>();

// Methods
const close = () => {
    emit('close');
};

// Toast class based on type
const toastClasses = computed(() => {
    const baseClasses = 'flex items-center bg-white rounded-md';
    switch (props.type) {
        case 'success':
            return `${baseClasses}`;
        case 'error':
            return `${baseClasses}`;
        case 'warning':
            return `${baseClasses}`;
        case 'info':
            return `${baseClasses}`;
        default:
            return `${baseClasses}`;
    }
});

const titleTextClasses = computed(() => {
    const baseClasses = 'text-sm'
    switch(props.type) {
        case 'success':
            return `text-green-500 ${baseClasses}`;
        case 'error':
            return `text-red-500 ${baseClasses}`;
        case 'warning':
            return `text-yellow-500 ${baseClasses}`;
        case 'info':
            return `text-blue-500 ${baseClasses}`;
        default:
            return `text-gray-200 ${baseClasses}`
    }
})

const toastBgClasses = computed(() => {
    const baseClasses = 'h-full w-fit text-white rounded-l-xl px-4 py-6';
    switch (props.type) {
        case 'success':
            return `bg-green-500 ${baseClasses}`;
        case 'error':
            return `bg-red-500 ${baseClasses}`;
        case 'warning':
            return `bg-yellow-500 ${baseClasses}`;
        case 'info':
            return `bg-blue-500 ${baseClasses}`;
        default:
            return `bg-gray-200 ${baseClasses}`
    }
})

// Default icon component based on type
const iconComponent = computed(() => {
    switch (props.type) {
        case 'success':
            return BsCheckCircleFill;
        case 'error':
            return BsExclamationCircleFill;
        case 'warning':
            return BsExclamationTriangleFill;
        case 'info':
            return BsQuestionDiamondFill;
        default:
            return null; // or a default icon if needed
    }
});

// Auto-close logic
let timeoutId: number | null = null;

const startAutoClose = () => {
    if (props.duration > 0) {
        timeoutId = setTimeout(() => {
            close();
        }, props.duration) as unknown as number;
    }
};

// Clear timeout on component unmount
const clearAutoClose = () => {
    if (timeoutId) {
        clearTimeout(timeoutId);
    }
};

// Lifecycle Hooks
onMounted(() => {
    startAutoClose();
});

onUnmounted(() => {
    clearAutoClose();
});
</script>