  <script lang="ts" setup>
  import { computed } from 'vue';
  import { cn } from '@/utils/cn';
  import { cva } from 'class-variance-authority';
  
  const props = defineProps<{
    id: string;
    name: string;
    value: string | number;
    label: string;
    modelValue: string | number;
    // Custom styles
    labelClass?: string;
    inputClass?: string;
    indicatorClass?: string;
    textClass?: string;
  }>();
  
  const emit = defineEmits<{
    (e: 'update:modelValue', value: string | number): void;
  }>();
  
  const handleChange = () => {
    emit('update:modelValue', props.value);
  };
  
  // Define color variants using CVA
  const indicatorClasses = cva('w-4 h-4 border-2 rounded-full mr-2', {
    variants: {
      color: {
        green: 'bg-green-500',
        yellow: 'bg-yellow-500',
        red: 'bg-red-500',
        default: 'bg-gray-300',
      },
      checked: {
        true: 'border-transparent',
        false: 'border-gray-300 opacity-50',
      },
    },
    defaultVariants: {
      color: 'default',
      checked: false,
    },
  });
  
  // Compute final classes
  const labelClass = computed(() => cn('flex items-center cursor-pointer', props.labelClass));
  const inputClass = computed(() => cn('hidden', props.inputClass));
  const indicatorClass = computed(() => indicatorClasses({
    color: priorityColorClass(),
    checked: isChecked.value ? true : false,
  }));
  const textClass = computed(() => cn('text-gray-700', props.textClass));
  
  // Determine if the radio button is checked
  const isChecked = computed(() => props.value === props.modelValue);
  
  // Function to dynamically determine color based on priority
  const priorityColorClass = () => {
    switch (props.value) {
      case 1:
        return 'green'; // Match CVA color variant
      case 2:
        return 'yellow'; // Match CVA color variant
      case 3:
        return 'red'; // Match CVA color variant
      default:
        return 'default'; // Match CVA color variant
    }
  };
  </script>
<!-- components/RadioButton.vue -->
<template>
    <label :for="id" :class="labelClass">
      <input
        type="radio"
        :id="id"
        :name="name"
        :value="value"
        :checked="isChecked"
        @change="handleChange"
        :class="inputClass"
      />
      <span :class="indicatorClass"></span>
      <span :class="textClass">{{ label }}</span>
    </label>
  </template>
  
  
  <style scoped>
  /* Add any custom styles if needed */
  </style>
  