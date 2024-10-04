<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue';
import Button from '../utilities/Button.vue';
import { ClWindowClose } from '@kalimahapps/vue-icons';

// Define props for the modal component
const props = defineProps<{
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

const handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
        close();
    }
}

onMounted(() => {
    window.addEventListener('keydown', handleEscapeKey)
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleEscapeKey)
})
</script>

<template>
    <Teleport to="#modal">
        <div v-if="props.visible" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
            <div class="bg-white px-4 pb-4 rounded shadow-lg z-10 max-w-96 border border-blue-600">
                <Button @click="close" class="absolute top-1 right-2 px-2 py-1 mt-1 text-white bg-red-600 rounded"
                    size="md">
                    <ClWindowClose />
                </Button>
                <div class="min-w-60 py-2 space-y-2">
                    <slot></slot>
                </div>
            </div>
        </div>
    </Teleport>
</template>
