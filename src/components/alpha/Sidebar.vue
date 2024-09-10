<script setup lang="ts">
import { CaUserAvatarFilledAlt } from '@kalimahapps/vue-icons';
import { inject, Ref } from 'vue';
// Inject the `expanded` ref from the parent
const expanded = inject('expanded') as Ref<boolean>;
</script>
<template>
    <aside class="transition-all duration-300">
        <nav :class="`h-full flex flex-col bg-white border-r transition-all duration-300 shadow-sm px-3 `">
            <ul class="flex-1 py-2">
                <slot></slot>
            </ul>
            <div :class="`border-t flex flex-col items-center transition-all duration-300  w-full text-center py-5 ${expanded ? '' : 'text-white'} `">
                <i :class="``">
                    <CaUserAvatarFilledAlt class="text-2xl"/>
                </i>
                <p :class="`text-sm break-words transition-all duration-300` ">John Doe</p>
                <p :class="`text-xs break-words text-gray-600 transition-all duration-300 ` ">john.doe@email.com</p>
            </div>
        </nav>
    </aside>
</template>
