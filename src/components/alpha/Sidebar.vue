<script setup lang="ts">
import { inject, Ref, computed } from 'vue';

// Inject the `expanded` ref from the parent
const expanded = inject('expanded') as Ref<boolean>;

// Computed classes for styling
const navClasses = computed(() => 
  `h-full flex flex-col border-r transition-all duration-300 shadow-md px-4 py-3 ${expanded.value ? 'w-64' : 'w-20'}`
);
</script>

<template>
  <aside :class="`transition-all duration-300 bg-gray-50 ${expanded ? 'w-64' : 'w-20'}`">
    <nav :class="navClasses">
      <ul class="flex-1 ">
        <slot></slot>
      </ul>
    </nav>
  </aside>
</template>

<style scoped>
/* Add a hover effect to the nav items */
nav ul li:hover {
  background-color: rgba(100, 116, 139, 0.1);
  border-radius: 0.5rem;
}

/* Add transition effects */
.transition-all {
  transition: all 0.3s ease-in-out;
  overflow: hidden;
}
</style>