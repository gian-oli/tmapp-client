<script setup lang="ts">
import { computed, ref, useAttrs, watchEffect } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "@/utils/cn"; // Adjust the import path as needed

// Define the props that the component will accept
const props = defineProps<{
  id: string;
  label: string;
  placeholder?: string;
  class?: string;
  inputClass?: "default" | "large";
  size?: "default" | "large";
  disabled?: boolean;
  type?: "text" | "date" | "password" | "email";
  options?: Array<{ value: string | number; label: string }>;
  modelValue: string | number | (string | number)[] ;
  autocomplete?: "username" | "current-password";
  isTextarea?: boolean;
  multiple?: boolean; // For multiple select functionality
}>();

// Define emits to handle v-model
const emit = defineEmits<{
  (event: "update:modelValue", value: string | number | (string | number)[] | undefined): void;
}>();

// Access additional attributes using useAttrs
const attrs = useAttrs();

// Define a local reactive variable for v-model
const inputValue = ref<string | number | (string | number)[] >(props.modelValue);

// Convert inputValue to a string for use in <textarea> and <input>
const stringInputValue = computed(() => {
  if (props.isTextarea) {
    return Array.isArray(inputValue.value)
      ? undefined
      : inputValue.value?.toString() || '';
  }
  return inputValue.value?.toString() || '';
});

// Watch for changes in the v-model prop
watchEffect(() => {
  if (props.multiple && Array.isArray(props.modelValue)) {
    inputValue.value = (props.modelValue as (string | number)[]).map(value => value.toString());
  } else {
    inputValue.value = props.modelValue;
  }
});

// Define the container class variants using CVA
const containerVariants = cva(
  "relative block rounded-md border shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600",
  {
    variants: {
      size: {
        default: "border-gray-200",
        error: "border-red-500",
        success: "border-green-500",
        large: "border-gray-300",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

// Define the input and select class variants using CVA
const inputVariants = cva(
  "peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 p-2 w-full",
  {
    variants: {
      size: {
        default: "text-sm",
        large: "text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const selectVariants = cva(
  "peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 p-2 w-full",
  {
    variants: {
      size: {
        default: "text-sm",
        large: "text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

// Define the label class variants
const labelClasses = computed(() =>
  "rounded-md pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs"
);

// Compute the class names based on the props and CVA variants
const containerClasses = computed(() =>
  cn(containerVariants({ size: props.size || "default", disabled: props.disabled ? true : undefined }))
);

const inputClasses = computed(() =>
  cn(inputVariants({ size: props.inputClass || "default" }))
);

const selectClasses = computed(() =>
  cn(selectVariants({ size: props.inputClass || "default" }))
);

// Handle input events and emit value to parent
const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement | HTMLTextAreaElement | null;
  if (target) {
    const value = target.value;
    inputValue.value = value === "" ? '' : value;
    emit("update:modelValue", value === "" ? undefined : value);
  }
};

// Handle select events and emit value to parent
const handleSelect = (e: Event) => {
  const target = e.target as HTMLSelectElement | null;
  if (target) {
    const selectedOptions = Array.from(target.selectedOptions).map(option => option.value);
    inputValue.value = props.multiple ? selectedOptions : selectedOptions[0] || '';
    emit("update:modelValue", props.multiple ? selectedOptions : selectedOptions[0] || undefined);
  }
};

// Handle checkbox changes for multiple select
const handleCheckboxChange = (e: Event) => {
  const target = e.target as HTMLInputElement | null;
  if (target) {
    const value = target.value;
    let updatedValues: (string | number)[] = Array.isArray(inputValue.value)
      ? [...inputValue.value]
      : [];
    
    if (target.checked) {
      updatedValues.push(value);
    } else {
      updatedValues = updatedValues.filter(item => item !== value);
    }
    
    inputValue.value = updatedValues;
    emit("update:modelValue", updatedValues);
  }
};
</script>

<template>
  <label :for="props.id" :class="containerClasses">
    <textarea
      v-if="props.isTextarea"
      :id="props.id"
      :placeholder="props.placeholder || props.label"
      :class="cn(inputClasses, props.class)"
      :value="stringInputValue"
      :disabled="props.disabled"
      @input="handleInput"
      v-bind="attrs"
    />
    
    <input
      v-else-if="!props.options || props.options.length === 0"
      :id="props.id"
      :placeholder="props.placeholder || props.label"
      :class="cn(inputClasses, props.class)"
      :type="props.type || 'text'"
      :value="stringInputValue"
      :autocomplete="props.autocomplete"
      :disabled="props.disabled"
      @input="handleInput"
      v-bind="attrs"
    />
    
    <select
      v-else-if="props.options && !props.multiple"
      :id="props.id"
      :class="cn(selectClasses, props.class)"
      :value="stringInputValue"
      :disabled="props.disabled"
      @change="handleSelect"
      v-bind="attrs"
    >
      <option v-for="option in props.options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    
    <div v-else-if="props.options && props.multiple" class="py-3 px-2">
      <div v-for="option in props.options" :key="option.value">
        <input
          type="checkbox"
          :id="String(option.value)"
          :value="String(option.value)"
          :checked="Array.isArray(inputValue) && inputValue.includes(String(option.value))"
          @change="handleCheckboxChange"
          :disabled="props.disabled"
        />
        <label :for="String(option.value)">{{ option.label }}</label>
      </div>
    </div>
    
    <span :class="labelClasses">{{ props.label }}</span>
  </label>
</template>
