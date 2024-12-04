<script setup lang="ts">
import { provide, ref } from 'vue';
import Navbar from './Navbar.vue';
import Sidebar from './Sidebar.vue';
import SidebarItems from './SidebarItems.vue';
import { BxSolidDashboard, PhBoldProjectorScreenChart, FlFilledTextBulletListSquare, CaUserProfile, BsBarChartSteps, LaUserSecretSolid } from '@kalimahapps/vue-icons';

const expanded = ref<boolean>(false)

provide('expanded', expanded)
</script>

<template>
  <div class="h-screen flex flex-col">
    <!-- Navbar -->
    <Navbar class="bg-blue-600 " />

    <!-- Main layout container -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar -->
      <Sidebar :class="` bg-blue-300 flex flex-col duration-50 ease-in-out ${!expanded ? 'w-0 p-0' : ' w-64'}`">
        <SidebarItems route_name="Dashboard" class="flex items-center mb-2 p-2 rounded-md hover:bg-gray-300">
          <template #icon>
            <BxSolidDashboard class="mr-2" />
          </template>
          <p class="inline-flex">Dashboard</p>
        </SidebarItems>
        <!-- <SidebarItems route_name="GanttChart" class="flex items-center mb-2 p-2 rounded-md hover:bg-gray-300">
          <BsBarChartSteps class="mr-2" />
          <p class="inline-flex">Gantt Chart</p>
        </SidebarItems> -->
        <SidebarItems route_name="GanttChart2" class="flex items-center mb-2 p-2 rounded-md hover:bg-gray-300">
          <template #icon>
            <BsBarChartSteps class="mr-2" />
          </template>
          <p class="inline-flex">Gantt Chart</p>
        </SidebarItems>
        <SidebarItems route_name="Projects" class="flex items-center mb-2 p-2 rounded-md hover:bg-gray-300">
          <template #icon>
            <PhBoldProjectorScreenChart class="mr-2" />
          </template>
          <p class="inline-flex">Projects</p>
        </SidebarItems>
        <SidebarItems route_name="Tasks" class="flex items-center mb-2 p-2 rounded-md hover:bg-gray-300">
          <template #icon>
            <FlFilledTextBulletListSquare class="mr-2" />
          </template>
          <p class="inline-flex">Tasks</p>
        </SidebarItems>
        <SidebarItems route_name="Profile" class="flex items-center mb-2 p-2 rounded-md hover:bg-gray-300">
          <template #icon>
            <CaUserProfile class="mr-2" />
          </template>
          <p class="inline-flex">Profile</p>
        </SidebarItems>
        <SidebarItems route_name="UserManagement" class="flex items-center mb-2 p-2 rounded-md hover:bg-gray-300">
          <template #icon>
            <LaUserSecretSolid class="mr-2" />
          </template>
          <p class="inline-flex">User Management</p>
        </SidebarItems>
        <SidebarItems route_name="GameRoom" class="flex items-center mb-2 p-2 rounded-md hover:bg-gray-300">
          <template #icon>
            <LaUserSecretSolid class="mr-2" />
          </template>
          <p class="inline-flex">GameRoom</p>
        </SidebarItems>
      </Sidebar>

      <!-- Main content area -->
      <div class="flex-1 h-screen overflow-hidden p-5 text-sm rounded-lg shadow-md">
        <router-view />
      </div>
    </div>
  </div>
</template>