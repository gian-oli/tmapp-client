<script setup lang="ts">
import { inject, Ref, ref } from 'vue';
import { useRoute } from 'vue-router'

const { route_name } = defineProps<{
    route_name: string,
}>()

// Inject the `expanded` ref from the parent
const expanded = inject('expanded') as Ref<boolean>;

const route = useRoute()
const tooltipRef = ref<HTMLElement | null>(null)
const tooltipPosition = ref({ top: 0, left: 0 })

const updateTooltipPosition = () => {
    if (!tooltipRef.value) return

    const iconElement = tooltipRef.value.closest('span')
    if (!iconElement) return

    const iconRect = iconElement.getBoundingClientRect()
    tooltipPosition.value = {
        top: iconRect.top,
        left: iconRect.right + 20
    }
}
</script>
<template>
    <router-link :to="{ name: route_name }" active-class="bg-blue-100" :class="`relative flex items-center ${expanded ? 'justify-start' : 'justify-center'} ease-in-out my-1 font-medium rounded-md cursor-pointer text-xs transition-all duration-300 group 
        ${expanded ? 'py-2 pl-4 w-full' : 'py-2 w-full'}
        ${route_name == route.name ?
            'text-black bg-gray-white shadow-md' :
            'text-gray-400 bg-gray-100'}`">
        <div class="flex items-center w-full" :class="expanded ? 'justify-start' : 'justify-center'">
            <span class="flex items-center justify-center relative" :class="`transition-all duration-300 
                ${!expanded ? 'text-2xl font-bold w-full' : 'text-base'}
                ${expanded ? 'mr-2' : ''}`" @mouseenter="updateTooltipPosition">
                <slot name="icon"></slot>

                <div v-if="!expanded" ref="tooltipRef" class="fixed z-50 bg-white text-gray-800 text-sm px-3 py-1.5 rounded-xl shadow-2xl 
           opacity-0 group-hover:opacity-100 transition-all duration-300 
           pointer-events-none border border-gray-200
           backdrop-blur-sm bg-opacity-80
           after:content-[''] after:absolute after:top-1/2 after:-left-[6px]
           after:-translate-y-1/2 after:border-[6px] after:border-transparent 
           after:border-r-white after:border-r-opacity-80" :style="{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`
        }">
                    <slot></slot>
                </div>
            </span>
            <span
                :class="`transition-all duration-300 ${expanded ? 'opacity-100 w-full' : 'opacity-0 w-0 overflow-hidden'}`">
                <slot></slot>
            </span>
        </div>
    </router-link>
</template>