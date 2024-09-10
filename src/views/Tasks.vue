<script setup lang="ts">
import { Profile } from "@/types";
import { computed, inject, onMounted, Ref } from "vue";

const inject_profile = inject("profile") as Ref<Profile>;
const profile = computed(() => inject_profile)

onMounted(() => {

});
</script>
<template>
    {{ profile }}
</template>
