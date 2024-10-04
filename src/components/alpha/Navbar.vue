<script setup lang="ts">
import { ChMenuHamburger, FaXmark, BsGearFill } from '@kalimahapps/vue-icons';
import { inject, onBeforeUnmount, onMounted, ref, Ref, watch } from 'vue';
import { twMerge } from 'tailwind-merge';
import SettingsModal from './SettingsModal.vue';

// Define the props
const props = defineProps<{
  class?: string; // Allows additional custom classes
}>();

const isClicked = ref(false);
const isHovered = ref(false);
const isDialogVisible = ref(false);

let ignoreFirstClick = false;

function toggleClicked() {
  isClicked.value = !isClicked.value;
  isDialogVisible.value = isClicked.value;

  setTimeout(() => {
    ignoreFirstClick = false;
  })
}

// Inject the `expanded` ref from the parent component
const expanded = inject('expanded') as Ref<boolean>;

// Extract custom class from props
const { class: customClass } = props;

// Method to toggle the expanded state
const toggleExpanded = () => {
  if (expanded) {
    expanded.value = !expanded.value;
  }
};

// Create a ref to target the p element
const animatedText = ref<HTMLElement | null>(null);

// Function to wrap each letter in a span with transition delay
const wrapLetters = (element: HTMLElement) => {
  const text = element.innerText;
  element.innerHTML = text.split('').map((char, index) =>
    `<span style="transition-delay: ${index * 0.1}s;">${char}</span>`
  ).join('');
};

onMounted(() => {
  if (animatedText.value) {
    wrapLetters(animatedText.value);
  }
});

const handleClickOutside = (event: MouseEvent) => {
  const modal = document.getElementById("settings_modal");
  if (!modal?.contains(event.target as Node) && !ignoreFirstClick) {
    isDialogVisible.value = false;
    isClicked.value = false
  } else {
    console.log(modal?.contains(event.target as Node));
  }
};

// Watch isVisible prop and add/remove event listener accordingly
watch(
  () => isDialogVisible.value,
  (newValue) => {
    if (newValue) {
      ignoreFirstClick = true;
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }
  }
);

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});


</script>

<template>
  <div :class="twMerge(`py-2 px-5 bg-gray-400 flex justify-between items-center`, customClass)">
    <div class="text-xs font-extrabold">
      <ChMenuHamburger v-if="!expanded" @click="toggleExpanded" class="inline-flex cursor-pointer size-5 mr-2" />
      <FaXmark v-else @click="toggleExpanded" class="inline-flex cursor-pointer size-5 mr-2" />
      tmapp_
    </div>
    <div class="relative inline-block">
      <button @click="toggleClicked" :class="[
        'group w-28 flex justify-between items-center rounded-full py-1 pr-1',
        { 'bg-white': isClicked, 'shadow shadow-white': isHovered }
      ]" @mouseover="isHovered = true" @mouseleave="isHovered = false">
        <p ref="animatedText" :class="[
          'text-black font-medium text-xs duration-300 ease-in-out',
          {
            'scale-105': isHovered,
            'opacity-100 ml-10': isClicked,
            'opacity-0': !isClicked ,
          }
        ]">
          Settings
        </p>
        <BsGearFill :class="[
          'size-5 duration-500 ease-in-out',
          {
            'scale-105': isHovered,
            '-rotate-[360deg] -translate-x-20 text-gray-400': isClicked,
          }
        ]" />
      </button>

      <SettingsModal id="settings_modal" v-if="isDialogVisible" :isVisible="isDialogVisible" @update:visible="isDialogVisible = $event, isClicked = $event" />
    </div>
  </div>
</template>

<style scoped>
#animated-text span {
  display: inline-block;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.group:hover #animated-text span {
  opacity: 1;
}
</style>
