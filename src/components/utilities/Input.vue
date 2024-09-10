<script setup lang="ts">
import { computed, ref, useAttrs, watchEffect } from 'vue';
import { cva } from 'class-variance-authority';
import { cn } from '@/utils/cn'; // Adjust the import path as needed
import type { User } from '@/types'; // Adjust the import path as needed

// Define the props that the component will accept
const props = defineProps<{
  id: string;
  label: string;
  placeholder?: string;
  class?: string;
  inputClass?: 'default' | 'large';
  size?: 'default' | 'large';
  disabled?: boolean;
  type?: 'text' | 'date' | 'password'; // Type for handling different input types
  options?: Array<User>; // Options for datalist
  modelValue?: string | number | null; // v-model value
  autocomplete?: 'username' | 'current-password';
}>();

// Define emits to handle v-model
const emit = defineEmits<{
  (event: 'update:modelValue', value: string | number | undefined): void;
}>();

// Access additional attributes using useAttrs
const attrs = useAttrs();

// Define a local reactive variable for v-model
const inputValue = ref<string | number | undefined | null>(props.modelValue);

// Watch for changes in the v-model prop
watchEffect(() => {
  inputValue.value = props.modelValue;
});

// Generate a unique datalist ID based on the component's id prop
const datalistId = computed(() => `${props.id}-options`);

// Define the container class variants using CVA
const containerVariants = cva(
  'relative block rounded-md border shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600',
  {
    variants: {
      size: {
        default: 'border-gray-200',
        error: 'border-red-500',
        success: 'border-green-500',
        large: 'border-gray-300',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

// Define the input class variants using CVA
const inputVariants = cva(
  'peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 p-2 w-full',
  {
    variants: {
      size: {
        default: 'text-sm',
        large: 'text-base',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

// Define the label class variants
const labelClasses = computed(() =>
  'rounded-md pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs'
);

// Compute the class names based on the props and CVA variants
const containerClasses = computed(() =>
  cn(
    containerVariants({
      size: props.size || 'default',
      disabled: props.disabled ? true : undefined
    })
  )
);

const inputClasses = computed(() =>
  cn(
    inputVariants({
      size: props.inputClass || 'default'
    
    })
  )
);

// Functions to handle option values
const getOptionValue = (option: User) => {
  if ('username' in option) return option.username;
  return '';
};

const getOptionId = (option: User) => {
  if ('id' in option) return option.id;
  return '';
};

// Handle input events and emit value to parent
const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement | null;
  if (target) {
    const value = target.value;
    inputValue.value = value === '' ? undefined : value; // Handle empty string case
    emit('update:modelValue', value === '' ? undefined : (isNaN(Number(value)) ? value : Number(value)));
  }
};
</script>

<template>
  <label :for="props.id" :class="containerClasses">
    <input
      :id="props.id"
      :placeholder="props.placeholder || props.label"
      :class="cn(
        inputClasses,
        props.class
      )"
      :type="props.type || 'text'"
      :list="props.options && props.options.length > 0 ? datalistId : undefined"
      :value="inputValue"
      :autocomplete="autocomplete"
      @input="handleInput"
      v-bind="attrs"
    />
    <span :class="labelClasses">{{ props.label }}</span>
    <!-- Conditionally render datalist only if options are provided -->
    <datalist v-if="props.options && props.options.length > 0" :id="datalistId">
      <option v-for="option in props.options" :key="getOptionValue(option)" :value="getOptionId(option)">
        {{ getOptionValue(option) }}
      </option>
    </datalist>
  </label>
</template>
