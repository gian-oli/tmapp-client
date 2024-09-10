<script setup lang="ts">
import { provide, ref } from 'vue';
import Navbar from './Navbar.vue';
import Sidebar from './Sidebar.vue';
import SidebarItems from './SidebarItems.vue';
import { BxSolidDashboard, PhBoldProjectorScreenChart, FlFilledTextBulletListSquare, CaUserProfile } from '@kalimahapps/vue-icons';

const expanded = ref<boolean>(false)

provide('expanded', expanded)
</script>

<template>
  <div class="h-screen flex flex-col">
    <!-- Navbar -->
    <Navbar class="bg-blue-600 text-white" />

    <!-- Main layout container -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar -->
      <Sidebar :class="` bg-blue-300 flex flex-col duration-50 ease-in-out ${ !expanded ? 'w-0 p-0' : ' w-64'}`">
        <SidebarItems route_name="Dashboard" class="flex items-center mb-2 p-2 rounded-md hover:bg-gray-300">
          <BxSolidDashboard class="mr-2" />
          <p class="inline-flex">Dashboard</p>
        </SidebarItems>
        <SidebarItems route_name="Projects" class="flex items-center mb-2 p-2 rounded-md hover:bg-gray-300">
          <PhBoldProjectorScreenChart class="mr-2" />
          <p class="inline-flex">Projects</p>
        </SidebarItems>
        <SidebarItems route_name="Tasks" class="flex items-center mb-2 p-2 rounded-md hover:bg-gray-300">
          <FlFilledTextBulletListSquare class="mr-2" />
          <p class="inline-flex">Tasks</p>
        </SidebarItems>
        <SidebarItems route_name="Profile" class="flex items-center mb-2 p-2 rounded-md hover:bg-gray-300">
          <CaUserProfile class="mr-2" />
          <p class="inline-flex">Profile</p>
        </SidebarItems>
      </Sidebar>

      <!-- Main content area -->
      <div class="flex-1 p-4 bg-blue-100 text-sm min-w-[320px]">
        <router-view />
      </div>
    </div>
  </div>
</template>