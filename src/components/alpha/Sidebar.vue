<script setup lang="ts">
import { Profile } from '@/types';
import { CaUserAvatarFilledAlt } from '@kalimahapps/vue-icons';
import { inject, Ref, computed } from 'vue';

// Inject the `expanded` ref and `profile` from the parent
const expanded = inject('expanded') as Ref<boolean>;
const profile = inject('profile') as Ref<Profile>;

// Computed classes for styling
const navClasses = computed(() => 
  `h-full flex flex-col border-r transition-all duration-300 shadow-md px-4 py-3`
);

const profileContainerClasses = computed(() => 
  `border-t flex flex-col items-center transition-all duration-300 w-full text-center py-5 ${expanded ? 'bg-white' : 'bg-gray-800 text-white'} rounded-lg`
);

const usernameClasses = computed(() => 
  `text-lg font-semibold break-words transition-all duration-300 ${expanded ? 'text-gray-800' : 'text-transparent'}`
);

const emailClasses = computed(() => 
  `text-sm break-words text-gray-500 transition-all duration-300 ${expanded ? '' : 'text-transparent'}`
);
</script>

<template>
  <aside class="transition-all duration-300 bg-gray-50">
    <nav :class="navClasses">
      <ul class="flex-1 py-2 space-y-2">
        <slot></slot>
      </ul>
      <div :class="profileContainerClasses">
        <CaUserAvatarFilledAlt class="text-3xl mb-2" />
        <p :class="usernameClasses">{{ profile.username }}</p>
        <p :class="emailClasses">{{ profile.email }}</p>
      </div>
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
.text-transparent {
  transition: color 0.3s ease-in-out;
}

.bg-white {
  transition: background-color 0.3s ease-in-out;
}
</style>
