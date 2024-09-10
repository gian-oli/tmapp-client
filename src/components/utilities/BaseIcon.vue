<script setup lang="ts">
import { computed } from 'vue';

// Define the props
const props = defineProps<{
    name: string; // Icon name, e.g., "icon-check"
    class?: string; // Additional custom classes
}>();

// Dynamically import and register the icon component
const iconComponent = computed(() => {
    try {
        return require(`@kalimah/vue-icons/icons/${props.name}`).default;
    } catch (error) {
        console.warn(`Icon "${props.name}" not found.`);
        return null;
    }
});

// Compute the icon class
const iconClass = computed(() => props.class || 'default-icon-class');
</script>

<template>
    <component :is="iconComponent" :class="iconClass" />
</template>