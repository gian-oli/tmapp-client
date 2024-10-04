<script setup lang="ts">
import { Swimlane } from '@/types';

defineProps<{
    data: Swimlane[]
}>()
</script>
<template>
    <div v-for="swimlane in data" :key="swimlane.id" class="border rounded p-2 min-w-40 max-w-60">
        <p class="font-medium uppercase">{{ swimlane.swimlane_name }}</p>
        <div v-for="column in swimlane.columns" :key="column.id" class="flex justify-between items-center">
            <p>{{ column.column_name }}</p>
            <b>{{ column.tasks.length }}</b>
        </div>
    </div>
</template>