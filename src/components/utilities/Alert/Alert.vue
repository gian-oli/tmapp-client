<script setup lang="ts">
import { inject } from 'vue'
import { useAlert } from './useAlert'

const alert = inject('alert', useAlert())
const alerts = alert.getAlerts()
</script>

<template>
  <div class="fixed top-4 right-4 z-50 w-96">
    <transition-group 
      name="list" 
      tag="div"
    >
      <div 
        v-for="alertItem in alerts" 
        :key="alertItem.id"
        :class="alert.getAlertStyle(alertItem.type)"
        class="relative"
      >
        <div class="text-2xl mr-2">
          {{ alert.getAlertIcon(alertItem.type) }}
        </div>
        <div class="flex-1">
          <div v-if="alertItem.title" class="font-bold">
            {{ alertItem.title }}
          </div>
          <div>{{ alertItem.message }}</div>
        </div>
        <button 
          @click="alert.remove(alertItem.id)"
          class="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>