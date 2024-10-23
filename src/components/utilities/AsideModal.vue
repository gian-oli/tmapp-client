<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import Button from './Button.vue';
import { ClWindowClose } from '@kalimahapps/vue-icons';

// Define props for the modal component
defineProps<{
    visible: boolean;
}>();

// Define emits for the modal component
const emit = defineEmits<{
    (event: 'update:visible', value: boolean): void;
}>();

// Function to close the modal
const close = () => {
    emit('update:visible', false);
};

// Escape key handler
const handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
        close();
    }
};

onMounted(() => {
    window.addEventListener('keydown', handleEscapeKey);
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleEscapeKey);
});
</script>

<template>
    <Teleport to="#modal">
        <!-- Parent opacity transition -->
        <transition name="fade" appear>
            <!-- The parent wrapper div fades in/out, controlling the opacity of the backdrop -->
            <div v-if="visible" class="fixed inset-0 bg-black/30 flex items-center justify-end z-30">
                <!-- Sliding child div (modal content) -->
                <transition name="slide-right-left" appear>
                    <!-- Modal content appears and slides only if visible is true -->
                    <div v-if="visible" class="bg-white px-4 pb-4 rounded-l shadow-lg shadow-gray-400 z-10 max-w-[50%] h-[80%] relative">
                        <!-- Close Button -->
                        <Button @click="close"
                            class="absolute top-1 right-2 p-2 mt-1 text-white bg-red-600 rounded-full duration-200 hover:bg-red-400"
                            size="md">
                            <ClWindowClose />
                        </Button>
                        <!-- Modal content -->
                        <div class="min-w-[40rem] py-2 space-y-2">
                            <slot></slot>
                        </div>
                    </div>
                </transition>
            </div>
        </transition>
    </Teleport>
</template>

<style scoped>
/* Parent opacity fade transition */
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from, .fade-leave-to {
    opacity: 0;
}

.fade-enter-to, .fade-leave-from {
    opacity: 1;
}

/* Slide from right to left transition for the child */
.slide-right-left-enter-active, .slide-right-left-leave-active {
    transition: transform 0.5s ease;
}

.slide-right-left-enter-from {
    transform: translateX(100%);
}

.slide-right-left-enter-to {
    transform: translateX(0);
}

.slide-right-left-leave-from {
    transform: translateX(0);
}

.slide-right-left-leave-to {
    transform: translateX(100%);
}
</style>
