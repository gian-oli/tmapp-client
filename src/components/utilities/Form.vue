<script setup lang="ts">
import { useAttrs } from 'vue';

// Define the props with the `submit` function
const props = defineProps<{
    submit: (data: FormDataType) => void;
    id?: string
}>();

const attrs = useAttrs()

// Define emits
const emit = defineEmits<{
    (event: 'formSubmitted', data: FormDataType): void;
}>();

// Define a type for form data
type FormDataType = {
    [key: string]: any;
};

// Function to handle form submission
const handleSubmit = (event: Event) => {
    event.preventDefault(); // Prevent the default form submission
    const formData = new FormData(event.target as HTMLFormElement);

    // Convert FormData to a plain object
    const data: FormDataType = Object.fromEntries(formData.entries());

    // Call the `submit` prop function
    props.submit(data);

    // Emit a `formSubmitted` event
    emit('formSubmitted', data);
};
</script>

<template>
    <form @submit="handleSubmit" :id="id" v-bind="attrs">
        <slot></slot>
    </form>
</template>
