<script setup lang="ts">
import {
  useGanttChartStore,
  usePrioritiesStore,
  useStatusesStore,
  useUsersStore,
  useProjectsStore
} from "@/modules";
import { computed, inject, onMounted, provide, ref } from "vue";
import GanttChartSchedule from "@/views/ganttchart/ganttchart.schedule.vue"; // Import your component
import GanttChartCalendar from "@/views/ganttchart/ganttchart.calendar.vue"; // Import your component
import GanttChartDisplay from "@/views/ganttchart/ganttchart.display.vue"; // Import your component
import { GanttChart, Schedule } from "@/types";
import {
  AnOutlinedFundProjectionScreen,
  BxSolidAddToQueue,
  McCalendarAddLine,
  ReFolderAddFill,
} from "@kalimahapps/vue-icons";
import { AsideModal } from "@/components/utilities";
import { AddProject, AddSchedule, AddKanboard } from "./ganttchart/components";
import { ProjectFormTypes } from "@/types/projects.types";
import { ToastService } from "@/components/utilities/Toast/useToast";

const ganttChartStore = useGanttChartStore();
const userStore = useUsersStore();
const priorityStore = usePrioritiesStore();
const statusStore = useStatusesStore();
const projectStore = useProjectsStore()

const toast = inject<ToastService>('toast')!

onMounted(() => {
  ganttChartStore.loadGanttCharts();
  userStore.setUsers();
  priorityStore.setPriorities();
  statusStore.setStatuses();
 if(ganttChartStore.getGanttCharts && userStore.getUsers && priorityStore.getPriorities && statusStore.getStatuses){
  toast.success('Successfuly Load Required Data.', 'Load Success!')
 }
});

const ganttCharts = computed(() => ganttChartStore.getGanttCharts);
const activeTab = ref("schedules"); // Track the active tab
const selectedGanttChartId = ref<number | null>(null); // Track selected Gantt chart ID
const schedules_selected = ref<Schedule[] | []>([]);
const gantt_chart_selected = ref<GanttChart | null>(null);

const showAddProjectModal = ref(false);
const showAddScheduleModal = ref(false);
const showAddKanboardModal = ref(false);

const setActiveTab = (tab: string) => {
  activeTab.value = tab; // Function to set the active tab
};

const select_schedule = (ganttChart: GanttChart) => {
  selectedGanttChartId.value = ganttChart.id; // Set selected Gantt chart ID
  schedules_selected.value = ganttChart.schedules || [];
  gantt_chart_selected.value = ganttChart;
  
  toast.success('test', 'Successfully Executed!')
  toast.warning('test', 'Successfully Executed!')
  toast.error('test', 'Successfully Executed!')
  toast.info('test', 'Successfully Executed!')
};


const schedules = computed(() => schedules_selected.value);
const gantt_chart = computed(() => gantt_chart_selected.value);

provide('schedules', schedules)
const reloadSelectedGanttChart = async () => {
  const ganttChart = await ganttChartStore.loadGanttCharts();

  const selectedGanttChart = ganttChart?.find(
    (data) => data.id === gantt_chart_selected.value?.id
  );

  if (selectedGanttChart) {
    select_schedule(selectedGanttChart);
  }
};

const createGantt = async (form: {
  name: string;
  date_from: string;
  date_to: string;
}) => {
  try {
    const result = await ganttChartStore.storeGanttChart(form);
    if (result) {
      showAddProjectModal.value = false;
      ganttChartStore.loadGanttCharts();
    }
  } catch (e) {
    console.error(e);
    // Handle error here. For example, show an error message to the user.
  }
};

const createSchedule = async (form: {
  name: string;
  user_id: string;
  status: string;
}) => {
  try {
    if (!gantt_chart_selected.value) return;
    const payload = {
      ...form,
      gantt_chart_id: gantt_chart_selected.value.id,
    };
    const result = await ganttChartStore.storeSchedule(payload);
    if (result) {
      showAddScheduleModal.value = false;
    }
  } catch (e) {
    console.log(e);
  } finally {
    reloadSelectedGanttChart();
  }
};

const createKanboard = async (payload: ProjectFormTypes) => {
  try {
    const result = await projectStore.setProjectStore(payload)
    if (result) {
      showAddKanboardModal.value = false
    }
  } catch (e) {
    console.log(e);
  } finally {
    reloadSelectedGanttChart()
  }
};

const updateSchedule = async (
  id: number,
  data: { status?: string; percent_completed?: number }
) => {
  try {
    await ganttChartStore.updateSchedule(id, data);
  } catch (e) {
    console.log(e);
  } finally {
    reloadSelectedGanttChart();
  }
};

const updatePlanDates = async (id: number, data: { dates: string[] }) => {
  try {
    await ganttChartStore.updatePlanDates(id, data);
  } catch (e) {
    console.log(e);
  } finally {
    reloadSelectedGanttChart();
  }
};

const updateActualDates = async (id: number, data: { dates: string[] }) => {
  try {
    await ganttChartStore.updateActualDates(id, data);
  } catch (e) {
    console.log(e);
  } finally {
    reloadSelectedGanttChart();
  }
};

</script>

<template>
  <div class="flex flex-col h-full w-full overflow-hidden rounded-lg shadow-md p-4 gap-4 text-xs relative">
    <!-- Gantt Charts List -->
    <div class="h-40  flex items-center gap-5 p-4 rounded-lg shadow-inner overflow-x-auto">
      <div v-for="gantt_chart in ganttCharts" :key="gantt_chart.id" @click="select_schedule(gantt_chart || [])" :class="[
        'h-28 p-4 min-w-60 rounded-lg cursor-pointer border shadow-md transition-transform transform hover:scale-105 hover:shadow-lg',
        gantt_chart.id === selectedGanttChartId
          ? 'border-4 border-blue-500 bg-blue-100'
          : 'border-gray-300 bg-white',
      ]">
        <h3 class="font-semibold text-lg text-gray-800 truncate">
          {{ gantt_chart.name }}
        </h3>
        <p class="text-gray-600 text-sm">
          Description or additional info here.
        </p>
      </div>
    </div>

    <!-- Content Area with Tabs -->
    <div class="flex-1 border rounded-lg p-5 bg-white shadow-md overflow-hidden">
      <div class="h-full overflow-hidden">
        <!-- Tabs for Switching -->
        <div class="flex flex-col md:flex-row gap-4 text-gray-700 bg-white shadow-lg">
          <h4 @click="setActiveTab('schedules')"
            class="font-semibold text-base cursor-pointer transition-colors duration-200 pb-2" :class="{
              'text-blue-500 border-b-2 border-blue-500':
                activeTab === 'schedules',
              'text-gray-500 border-b-2 border-transparent':
                activeTab !== 'schedules',
            }">
            Schedules
          </h4>
          <h4 @click="setActiveTab('gantt')"
            class="font-semibold text-base cursor-pointer transition-colors duration-200 pb-2" :class="{
              'text-blue-500 border-b-2 border-blue-500': activeTab === 'gantt',
              'text-gray-500 border-b-2 border-transparent':
                activeTab !== 'gantt',
            }">
            Gantt Chart
          </h4>
          <h4 @click="setActiveTab('calendar')"
            class="font-semibold text-base cursor-pointer transition-colors duration-200 pb-2" :class="{
              'text-blue-500 border-b-2 border-blue-500':
                activeTab === 'calendar',
              'text-gray-500 border-b-2 border-transparent':
                activeTab !== 'calendar',
            }">
            Calendar
          </h4>
        </div>
        <div class="overflow-y-auto h-full">
          <!-- Conditional Rendering with Fade Transition -->
          <transition name="fade" mode="out-in">
            <div v-if="activeTab === 'schedules'" key="schedules">
              <GanttChartSchedule :update-plan-dates="updatePlanDates" :update-schedule="updateSchedule"
                :schedules="schedules" :update-actual-dates="updateActualDates" />
            </div>
            <div v-else-if="activeTab === 'gantt'" key="gantt" class="flex-1 p-5">
              <GanttChartDisplay />
            </div>
            <div v-else-if="activeTab === 'calendar'" key="calendar" class="flex-1 p-5">
              <!-- Placeholder for Gantt Chart content -->
              <!-- <p class="text-center text-gray-500">Gantt chart will appear here.</p> -->
              <GanttChartCalendar :gantt-chart="gantt_chart" />
            </div>
          </transition>
        </div>
      </div>
    </div>

    <div class="fixed bottom-11 right-12 cursor-pointer group">
      <!-- Main Button -->
      <div
        class="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 opacity-50 rounded-full transition-all duration-300 hover:opacity-100 hover:shadow-lg flex items-center justify-center shadow-blue-500/50 hover:scale-105 border-2 border-blue-300 p-4 relative group-hover:bg-opacity-100">
        <div class="flex group-hover:gap-2 group-hover:border-r-2 group-hover:px-2 group-hover:w-max w-0 duration-200">
          <ReFolderAddFill @click="showAddProjectModal = true"
            class="text-white size-7 hover:text-yellow-300 duration-200" />
          <McCalendarAddLine @click="showAddScheduleModal = true"
            class="text-white size-7 hover:text-yellow-300 duration-200" />
          <AnOutlinedFundProjectionScreen v-if="gantt_chart?.id" @click="showAddKanboardModal = true"
            class="text-white size-7 hover:text-yellow-300 duration-200" />
          <AnOutlinedFundProjectionScreen v-else class="text-gray-300 size-7 cursor-not-allowed" />
        </div>
        <div class="group-hover:px-2">
          <BxSolidAddToQueue class="text-white size-8" />
        </div>
      </div>
    </div>

    <AsideModal :visible="showAddProjectModal" @update:visible="showAddProjectModal = $event">
      <AddProject :create-gantt="createGantt" />
    </AsideModal>
    <AsideModal :visible="showAddScheduleModal" @update:visible="showAddScheduleModal = $event">
      <AddSchedule :create-schedule="createSchedule" />
    </AsideModal>
    <AsideModal :visible="showAddKanboardModal" @update:visible="showAddKanboardModal = $event">
      <AddKanboard :create-kanboard="createKanboard" />
    </AsideModal>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
  /* Animation duration and easing */
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active in <2.1.8 */
  {
  opacity: 0;
  /* Fade out */
  transform: translateY(10px);
  /* Slightly move down during the transition */
}

/* Gantt Chart Cards Hover Effect */
.h-40 {
  overflow-y: auto;
  /* Ensure vertical scrolling if content overflows */
}

.status-select {
  background-color: #f9fafb;
  /* Lighter background */
  padding: 8px;
  border-radius: 0.375rem;
  /* Rounded corners */
  border: 1px solid #d1d5db;
  transition: box-shadow 0.2s ease-in-out;
}

.status-select:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  /* Blue outline on focus */
}

/* Tab Styling */
.text-blue-500 {
  color: #3b82f6;
}

.border-b-2 {
  border-bottom-width: 2px;
}

.hover:scale-105 {
  transform: scale(1.05);
}

.border-4 {
  border-width: 4px;
}

.hover:shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* New gradient background */
.bg-gradient-to-b {
  background: linear-gradient(to bottom, #ebf8ff, #ffffff);
}

.bg-gradient-to-r {
  background: linear-gradient(to right, #ede9fe, #ffffff, #eef2ff);
}
</style>
