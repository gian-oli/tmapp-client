<script setup lang="ts">
import { CreateScheduleModal, GanttChartDisplay, GanttChartModal } from '@/components/ganttchart';
import { Modal, Button } from '@/components/utilities';
import { useGanttChartStore, usePrioritiesStore, useProjectsStore, useStatusesStore, useUsersStore } from '@/modules';
import { GanttChart, ProjectFormTypes } from '@/types';
import { MdFormatListBulletedAdd } from '@kalimahapps/vue-icons';
// import { useDebounceFn } from '@vueuse/core';
// import { format } from 'date-fns';
import { computed, onMounted, provide, ref } from 'vue';

const ganttChartStore = useGanttChartStore()
const priorityStore = usePrioritiesStore()
const statusStore = useStatusesStore()
const userStore = useUsersStore()
const projectStore = useProjectsStore()
const showGanttChartModal = ref(false)
const showCreateScheduleModal = ref(false)

onMounted(() => {
    ganttChartStore.loadGanttCharts()
    userStore.setUsers();
    priorityStore.setPriorities();
    statusStore.setStatuses();
})

const gantt_chart = computed(() => ganttChartStore.getGanttCharts)

const ganttChart = ref<GanttChart>()
provide('gantt_chart', ganttChart)

const selectGanttChart = (chart: GanttChart) => {
    ganttChart.value = chart
}

const createGantt = async (form: {
    name: string;
    date_from: string;
    date_to: string;
}) => {
    try {

        const result = await ganttChartStore.storeGanttChart(form);
        if (result) {
            showGanttChartModal.value = false
            ganttChartStore.loadGanttCharts()
        }
    } catch (e) {
        console.error(e);
        // Handle error here. For example, show an error message to the user.
    }
}

const createSchedule = async (form: {
    name: string,
    user_id: string,
    status: string,
}) => {
    try {
        if (!ganttChart.value) return
        const payload = {
            ...form,
            gantt_chart_id: ganttChart.value.id
        }
        const result = await ganttChartStore.storeSchedule(payload)
        if (result) {
            showCreateScheduleModal.value = false;

            // Reload the Gantt charts and select the one you're working with
            await ganttChartStore.loadGanttCharts();

            // Find and select the relevant Gantt chart after loading
            const selectedGanttChart = gantt_chart.value?.find((data) => data.id === ganttChart.value?.id);

            if (selectedGanttChart) {
                selectGanttChart(selectedGanttChart);
            }
        }
    } catch (e) {
        console.log(e)
    }
}

const submitPlanDate = async (form: { date: string, time_spent: number, schedule_id: number }) => {
    try {
        const result = await ganttChartStore.storePlanDate({
            date: form.date,
            time_spent: 8.75,
            schedule_id: form.schedule_id
        })
        if (result) {
            console.log('Plan date added successfully')
        }
    } catch (e) {
        console.log(e)
    } finally {

        await ganttChartStore.loadGanttCharts();

        // Find and select the relevant Gantt chart after loading
        const selectedGanttChart = gantt_chart.value?.find((data) => data.id === ganttChart.value?.id);
        if (selectedGanttChart) {
            selectGanttChart(selectedGanttChart);
        }
    }
}

const destroyPlanDate = async (id: number) => {
    try {
        await ganttChartStore.deletePlanDate(id)
        console.log('Plan date deleted successfully')
    } catch (e) {
        console.log(e)
    } finally {
        await ganttChartStore.loadGanttCharts();
        const selectedGanttChart = gantt_chart.value?.find((data) => data.id === ganttChart.value?.id);
        if (selectedGanttChart) {
            selectGanttChart(selectedGanttChart);
        }
    }
}

const submitActualDate = async (form: { date: string, time_spent: number, schedule_id: number }) => {
    try {
        await ganttChartStore.storeActualDate({
            date: form.date,
            time_spent: form.time_spent,
            schedule_id: form.schedule_id
        })
        console.log('Actual date added successfully')
    } catch (e) {
        console.log(e)
    } finally {
        await ganttChartStore.loadGanttCharts();
        const selectedGanttChart = gantt_chart.value?.find((data) => data.id === ganttChart.value?.id);
        if (selectedGanttChart) {
            selectGanttChart(selectedGanttChart);
        }
    }
}

const destroyActualDate = async (id: number) => {
    try {
        await ganttChartStore.deleteActualDate(id)
        console.log('Actual date deleted successfully')
    } catch (e) {
        console.log(e)
    } finally {
        await ganttChartStore.loadGanttCharts();
        const selectedGanttChart = gantt_chart.value?.find((data) => data.id === ganttChart.value?.id);
        if (selectedGanttChart) {
            selectGanttChart(selectedGanttChart);
        }
    }
}

const storeNewKanban = async (payload: ProjectFormTypes) => {
    try {
        await projectStore.setProjectStore(payload)
        console.log('Project added successfully')
    } catch (e) {
        console.log(e)
    } finally {
        await ganttChartStore.loadGanttCharts();
        const selectedGanttChart = gantt_chart.value?.find((data) => data.id === ganttChart.value?.id);
        if (selectedGanttChart) {
            selectGanttChart(selectedGanttChart);
        }
    }
}

const changeStatus = async (id: number, status: string) => {
    try {
        await ganttChartStore.updateSchedule(id, { status })
    } catch (e) {
        console.log(e)
    } finally {
        await ganttChartStore.loadGanttCharts();
        const selectedGanttChart = gantt_chart.value?.find((data) => data.id === ganttChart.value?.id);
        if (selectedGanttChart) {
            selectGanttChart(selectedGanttChart);
        }
    }
};

const getPlanManhour = () => {
    if (!ganttChart.value) return
    const plan = ganttChart.value.schedules?.map((schedule) => {
        // Total time spent for this schedule
        const totalPlanTime = schedule.plan_dates.reduce((acc, plan) => acc + plan.time_spent, 0);

        // Total days calculated as every 8.75 is equivalent to 1 day
        const totalDays = totalPlanTime / 8.75;

        return {
            label: schedule.name,
            totalPlanTime, // Total time spent for this schedule
            totalDays: totalDays.toFixed(2), // Rounded to 2 decimal places
        };
    });

    return plan
}

const getActualManhour = () => {
    if (!ganttChart.value) return;

    const actual = ganttChart.value.schedules?.map((schedule) => {
        // Total time spent for this schedule's actual dates
        const totalActualTime = schedule.actual_dates.reduce((acc, actual) => acc + actual.time_spent, 0);

        // Total days calculated as every 8.75 is equivalent to 1 day
        const totalDays = totalActualTime / 8.75;

        return {
            label: schedule.name,
            totalActualTime, // Total time spent for actual dates of this schedule
            totalDays: totalDays.toFixed(2), // Rounded to 2 decimal places
        };
    });

    return actual;
};

const getTotalManhour = () => {
    const planData = getPlanManhour() || [];
    const actualData = getActualManhour() || [];

    // Calculate total plan hours and days
    const totalPlanTime = planData.reduce((acc, schedule) => acc + schedule.totalPlanTime, 0);
    const totalPlanDays = totalPlanTime / 8.75; // Every 8.75 hours is equivalent to 1 day

    // Calculate total actual hours and days
    const totalActualTime = actualData.reduce((acc, schedule) => acc + schedule.totalActualTime, 0);
    const totalActualDays = totalActualTime / 8.75; // Every 8.75 hours is equivalent to 1 day

    return {
        totalPlanTime,
        totalPlanDays: totalPlanDays.toFixed(2), // Rounded to 2 decimal places
        totalActualTime,
        totalActualDays: totalActualDays.toFixed(2), // Rounded to 2 decimal places
    };
};



</script>
<template>
    <div class="flex flex-col h-full w-full bg-white overflow-hidden rounded-sm p-2 gap-2 text-xs">
        <div class="flex gap-2">
            <div class="w-max">
                <div class="flex justify-between rounded-t items-center w-full p-2 bg-blue-500 font-medium ">
                    <p class="text-white">Gantt Chart List</p>
                    <Button @click="showGanttChartModal = true">Add</Button>
                </div>
                <div class="w-80 overflow-y-auto ">
                    <!-- Gantt Charts -->
                    <ul v-for="data in gantt_chart" :key="data.id" class="">
                        <li @click="selectGanttChart(data)"
                            :class="`px-4 py-1  cursor-pointer duration-100 ${ganttChart?.id == data.id ? 'bg-blue-200 hover:bg-blue-100 text-black font-medium' : 'bg-gray-100 hover:text-black hover:bg-gray-50 text-gray-500'}`">
                            <div class="flex justify-between items-center">
                                <p class="font-medium">{{ data.name }}</p>
                                <p>{{ data.percent_completed ? data.percent_completed : '-' }}</p>
                            </div>
                            <div>
                                <p class="italic">{{ data.status ? data.status : 'Not yet started' }}</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div v-if="ganttChart" class="w-80 p-2 bg-blue-50 rounded border border-blue-200">
                <Button @click="showCreateScheduleModal = true">
                    <MdFormatListBulletedAdd />Create schedule
                </Button>
            </div>
            <div v-if="ganttChart" class="">
                <p class="text-blue-500 font-medium">Selected Gantt Chart: {{ ganttChart.name }}</p>
                <p>Status: {{ ganttChart.status }}</p>
                <p>Start date: {{ ganttChart.date_from }}</p>
                <p>End date: {{ ganttChart.date_to }}</p>
                <p>Percent completed: {{ ganttChart.percent_completed }}</p>
                <!-- <p>Report: {{
                    (() => {
                        const latestScheduleWithDates = ganttChart.schedules
                            ? [...ganttChart.schedules]
                                .reverse() // Reverse the schedules array to start checking from the last
                                .find(schedule => schedule.actual_dates.length > 0) // Find the first schedule with actual dates
                            : null;

                        if (latestScheduleWithDates) {
                            const latestActualDate = latestScheduleWithDates.actual_dates[0]?.date; // Get the first actual date
                            //`from the found schedule`
                            return `The latest movement on this project was made on ${format(latestActualDate, 'LLLL dd, yyyy')
                                }, which is in the ${latestScheduleWithDates.name} row.`;
                        }
                        return ''; // Return an empty string if no schedule has actual dates
                    })()
                }}</p> -->
            </div>

            <div v-if="ganttChart">
                <div class="flex-1 text-center p-1 bg-blue-500 text-white font-bold">TIME</div>
                <div class="flex">
                    <span
                        class="p-2 w-20 text-center text-md bg-blue-200 border flex items-center justify-center ">PLAN</span>
                    <span
                        class="p-2 w-20 text-center text-lg bg-blue-200 border flex items-center justify-center font-medium">{{
                            getTotalManhour().totalPlanTime }}</span>
                </div>
                <div class="flex">
                    <span
                        class="p-2 w-20 text-center text-md bg-blue-200 border flex items-center justify-center ">ACTUAL</span>
                    <span
                        class="p-2 w-20 text-center text-lg bg-blue-200 border flex items-center justify-center font-medium">{{
                            getTotalManhour().totalActualTime }}</span>
                </div>
            </div>
            <div v-if="ganttChart">
                <div class="flex-1 text-center p-1 bg-blue-500 text-white font-bold">DAYS</div>
                <div class="flex">
                    <span
                        class="p-2 w-20 text-center text-md bg-blue-200 border flex items-center justify-center ">PLAN</span>
                    <span
                        class="p-2 w-20 text-center text-lg bg-blue-200 border flex items-center justify-center font-medium">{{
                            getTotalManhour().totalPlanDays }}</span>
                </div>
                <div class="flex">
                    <span
                        class="p-2 w-20 text-center text-md bg-blue-200 border flex items-center justify-center ">ACTUAL</span>
                    <span
                        class="p-2 w-20 text-center text-lg bg-blue-200 border flex items-center justify-center font-medium">{{
                            getTotalManhour().totalActualDays }}</span>
                </div>
            </div>
        </div>
        <div class=" flex-1 overflow-y-auto overflow-x-hidden">
            <!-- Selected Gantt Chart -->
            <GanttChartDisplay :change-status="changeStatus" :store-projects="storeNewKanban"
                :submit-actual-date="submitActualDate" :submit-plan-date="submitPlanDate"
                :destroy-actual-date="destroyActualDate" :destroy-plan-date="destroyPlanDate" />
        </div>
        <div v-if="ganttChart" class="flex gap-5 p-2">
            <div>
                <p class="font-medium text-blue-500">Plan Manhour</p>
                <div v-for="(plan, i) in getPlanManhour()" :key="i" class="">
                    {{ plan.label }}: Manhour of <p class="inline-flex font-bold text-red-700">{{ plan.totalPlanTime }}h
                    </p> for a total of <p class="inline-flex font-bold text-red-700">{{ plan.totalDays }} days</p>
                </div>
            </div>
            <div>
                <p class="font-medium text-blue-500">Actual Manhour</p>
                <div v-for="(actual, i) in getActualManhour()" :key="i" class="">
                    {{ actual.label }}: Manhour of <p class="inline-flex font-bold text-red-700">{{
                        actual.totalActualTime }}h
                    </p> for a total of <p class="inline-flex font-bold text-red-700">{{ actual.totalDays }} days</p>
                </div>
            </div>
        </div>
        <Modal :visible="showGanttChartModal" @update:visible="showGanttChartModal = $event">
            <GanttChartModal :create-gantt="createGantt" />
        </Modal>
        <Modal :visible="showCreateScheduleModal" @update:visible="showCreateScheduleModal = $event">
            <CreateScheduleModal :create-schedule="createSchedule" />
        </Modal>
    </div>
</template>