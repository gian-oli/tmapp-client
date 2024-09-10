<script setup lang="ts">
import { inject, Ref } from 'vue';
import { useRoute } from 'vue-router'
const {route_name} = defineProps<{
    route_name: string,
}>()

// Inject the `expanded` ref from the parent
const expanded = inject('expanded') as Ref<boolean>;

const route = useRoute()

</script>
<template>
    <router-link :to="{ name: route_name }" :class="`relative ${expanded ? 'py-2 pl-4': 'py-0 pl-0 '} flex ease-in-out my-1 font-medium rounded-md cursor-pointer text-xs transition-colors duration-200 group 
    ${route_name == route.name ?
            'text-black bg-gray-white shadow-md' :
            'text-gray-400 bg-gray-100'}`">
        <slot v-if="expanded"></slot>
    </router-link>
</template>