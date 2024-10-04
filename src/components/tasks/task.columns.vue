<script lang="ts" setup>
import { Column } from '@/types';

const props = defineProps<{
    columns: Column[] | null
}>();
</script>
<template>
  
        <div v-if="props.columns" v-for="column in props.columns" :key="column.id" class="w-full bg-blue-50 p-1">
            <p class="text-center font-medium">{{ column.column_name }}</p>
        </div>
        <div v-else>
            <p>No columns available</p>
        </div>
</template>