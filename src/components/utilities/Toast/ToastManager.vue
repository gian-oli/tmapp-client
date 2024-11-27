<template>
    <div class="fixed top-4 right-4 z-[1000] space-y-2">
        <TransitionGroup 
            name="toast-stack" 
            tag="div" 
            class="flex flex-col-reverse space-y-2"
        >
            <Toast 
                v-for="toast in displayedToasts" 
                :key="toast.id" 
                :message="toast.message" 
                :title="toast.title"
                :type="toast.type" 
                :duration="toast.duration" 
                @close="removeToast(toast.id)" 
            />
        </TransitionGroup>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Toast from './Toast.vue'

// Custom ID generator
const generateUniqueId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Toast Interface
export interface ToastInterface {
    id: string
    message: string
    title?: string
    type?: 'success' | 'error' | 'warning' | 'info'
    duration?: number
}

// Configuration options
interface ToastConfig {
    maxToasts?: number
    defaultDuration?: number
}

// Reactive toasts array
const toasts = ref<ToastInterface[]>([])

// Configuration with defaults
const config = ref<ToastConfig>({
    maxToasts: 5,
    defaultDuration: 3000
})

// Computed property to limit displayed toasts
const displayedToasts = computed(() => {
    const maxToasts = config.value.maxToasts || 5
    return toasts.value.slice(-maxToasts)
})

// Method to add a toast with advanced options
const addToast = (toast: Omit<ToastInterface, 'id'>) => {
    // Create new toast with default values
    const newToast: ToastInterface = {
        id: generateUniqueId(),
        ...toast,
        type: toast.type || 'info',
        duration: toast.duration || config.value.defaultDuration || 3000
    }

    // Add toast to the list
    toasts.value.push(newToast)

    // Remove oldest toast if max limit is reached
    if (toasts.value.length > (config.value.maxToasts || 5)) {
        toasts.value.shift()
    }

    // Optional: Auto-remove toast after duration
    if (newToast.duration) {
        setTimeout(() => {
            removeToast(newToast.id)
        }, newToast.duration)
    }
}

// Method to remove a specific toast
const removeToast = (id: string) => {
    toasts.value = toasts.value.filter(toast => toast.id !== id)
}

// Method to clear all toasts
const clearToasts = () => {
    toasts.value = []
}

// Method to update configuration
const updateConfig = (newConfig: ToastConfig) => {
    config.value = { ...config.value, ...newConfig }
}

// Expose methods for external use
defineExpose({
    addToast,
    removeToast,
    clearToasts,
    updateConfig
})
</script>

<style scoped>
.toast-stack-enter-active,
.toast-stack-leave-active {
    transition: all 0.3s ease-in-out;
}

.toast-stack-enter-from,
.toast-stack-leave-to {
    opacity: 0;
    transform: translateX(100%);
}

.toast-stack-move {
    transition: transform 0.3s ease-in-out;
}
</style>