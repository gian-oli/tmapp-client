<template>
    <div class="p-4 rounded shadow-lg transition-all max-w-xs w-full" :class="[
        toastClasses,
        { 'animate-fade-in': animated }
    ]">
        <div class="flex items-center">
            <div class="mr-2" v-if="icon">
                <slot name="icon">
                    <i :class="icon"></i>
                </slot>
            </div>
            <div class="flex-grow">
                <div class="font-semibold" v-if="title">{{ title }}</div>
                <div>{{ message }}</div>
            </div>
            <button class="ml-2 text-white hover:text-gray-200" @click="close">
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
} from 'vue'

// Toast Types
export type ToastType = 'success' | 'error' | 'warning' | 'info'

// Props Interface
interface ToastProps {
    message: string
    title?: string
    type?: ToastType
    duration?: number
    icon?: string
    animated?: boolean
}

// Define Props with Defaults
const props = withDefaults(defineProps<ToastProps>(), {
    type: 'info',
    duration: 3000,
    animated: true
})

// Define Emits
const emit = defineEmits<{
    (e: 'close'): void
}>()

// Methods
const close = () => {
    emit('close')
}

// Toast class based on type
const toastClasses = computed(() => {
    const baseClasses = 'text-white flex items-center'
    switch (props.type) {
        case 'success':
            return `${baseClasses} bg-green-500`
        case 'error':
            return `${baseClasses} bg-red-500`
        case 'warning':
            return `${baseClasses} bg-yellow-500 text-black`
        case 'info':
            return `${baseClasses} bg-blue-500`
        default:
            return `${baseClasses} bg-gray-500`
    }
})

// Auto-close logic
let timeoutId: number | null = null

const startAutoClose = () => {
    if (props.duration > 0) {
        timeoutId = setTimeout(() => {
            close()
        }, props.duration) as unknown as number
    }
}

// Clear timeout on component unmount
const clearAutoClose = () => {
    if (timeoutId) {
        clearTimeout(timeoutId)
    }
}

// Lifecycle Hooks
onMounted(() => {
    startAutoClose()
})

onUnmounted(() => {
    clearAutoClose()
})
</script>