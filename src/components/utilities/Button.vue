<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { cn } from '@/utils/cn'; // Ensure this is correctly imported
import { cva } from 'class-variance-authority';

// Define the props
const props = defineProps<{
  text?: string; // Button text
  type?: 'button' | 'submit' | 'reset'; // Button type
  disabled?: boolean; // Disabled state
  class?: string; // Additional custom classes for the button
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'danger';
  [key: string]: any; // For other possible attributes
}>();

const attrs = useAttrs();

// Extract props
const { size = 'sm', color = 'primary', type = 'button', class: customClass } = props;

// Define base and variant classes for the button
const baseClasses = cva(
  'inline-flex items-center gap-1 p-1 font-medium rounded outline-0',
  {
    variants: {
      size: {
        sm: 'text-xs',
        md: 'text-base',
        lg: 'text-lg',
      },
      color: {
        primary: 'bg-blue-200 hover:bg-blue-300',
        secondary: 'bg-yellow-200 hover:bg-yellow-300',
        warning: 'bg-orange-200 hover:bg-orange-300',
        danger: 'bg-red-200 hover:bg-red-300',
        back: 'bg-gray-200 hover:bg-gray-300'
        // Add more color variants as needed
      },
    },
    defaultVariants: {
      size: 'sm',
      color: 'primary'
    },
  }
);

// Compute the button classes
const buttonClasses = computed(() =>
  cn(
    // Combine base classes with custom class
    baseClasses({ size, color}),
    customClass
  )
);
</script>

<template>
  <button :class="buttonClasses" v-bind="attrs" :type="type" :disabled="disabled">
    <slot />
  </button>
</template>
