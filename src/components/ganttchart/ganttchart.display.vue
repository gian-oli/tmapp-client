<script setup lang="ts">
import { GanttChart, ProjectFormTypes } from '@/types';
import { addDays, addMonths, differenceInMonths, endOfMonth, format, startOfMonth } from 'date-fns';
import { computed, inject, provide, ref, Ref } from 'vue';
import { Button } from '../utilities';
import { FaRoute, PhKanban } from '@kalimahapps/vue-icons';
import { ActualDates } from '@/types/schedule.types';
import Modal from '../utilities/Modal.vue';
import GanttchartNote from './ganttchart.note.vue';
import { ProjectModal } from '../projects';
import { useDebounceFn } from '@vueuse/core'
// import { useGanttChartStore } from '@/modules';

// const ganttChartStore = useGanttChartStore()

const props = defineProps<{
    submitPlanDate: (form: { date: string, time_spent: number, schedule_id: number }) => void,
    destroyPlanDate: (id: number) => void,
    submitActualDate: (form: { date: string, time_spent: number, schedule_id: number }) => void,
    destroyActualDate: (id: number) => void,
    storeProjects: (payload: ProjectFormTypes) => void,
    changeStatus: (id: number, status: string) => void,
}>()

const initialProjectFormState: ProjectFormTypes = {
    user_id: '',
    project_name: '',
    project_type: 'Development',
    deadline: format(new Date(), 'yyyy-MM-dd'),
    priority_id: 1,
    status_id: 1
};
const post_project_form = ref<ProjectFormTypes>({
    ...initialProjectFormState
})
const showProjectStoreModal = ref(false)

const schedule_id = ref<number | ''>('')
const schedule_name = ref<string>('')


const fields = [
    { key: 'id', label: 'No' },
    { key: 'name', label: 'Development Name' },
    { key: 'users', label: 'Development In-charge' },
    { key: 'percent_completed', label: 'Progress %' },
    { key: 'status', label: 'Status' },
    { key: 'duration', label: 'Duration' },
    { key: 'no_of_days', label: 'No. Of Days' },
    { key: 'date', label: 'Date' },
    { key: 'schedule', label: '' }
]

const inject_gantt_chart = inject('gantt_chart') as Ref<GanttChart>
const ganttChart = computed(() => inject_gantt_chart.value)

const noteModal = ref(false)
const noteActualDay = ref<ActualDates | ''>('')

const getMonthsBetween = (startDate: Date | string | null, endDate: Date | string | null): string[] => {
    if (!startDate || !endDate) {
        return []; // return empty array if any date is null
    }

    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

    const monthsDifference = differenceInMonths(end, start);
    const monthsArray: string[] = [];

    for (let i = 0; i <= monthsDifference; i++) {
        const month = addMonths(start, i);
        monthsArray.push(format(month, 'yyyy-MM'));
    }

    return monthsArray;
}

const getDaysBetween = (
    startDate: Date | string | null,
    endDate: Date | string | null
): { day: number; name: string; date: string }[] => {
    if (!startDate || !endDate) {
        return []; // Return an empty array if any date is null
    }

    // Convert string dates to Date objects if necessary
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

    // Set the start date to the first day of its month and end date to the last day of its month
    const adjustedStart = startOfMonth(start);
    const adjustedEnd = endOfMonth(end);

    const daysArray: { day: number; name: string; date: string }[] = [];
    let currentDate = new Date(adjustedStart);

    // Iterate through each day between adjusted start and end date
    while (currentDate <= adjustedEnd) {
        daysArray.push({
            day: currentDate.getDate(),
            name: format(currentDate, 'EEEE'), // Get the full name of the day
            date: format(currentDate, 'yyyy-MM-dd'), // Full date for reference
        });

        // Move to the next day
        currentDate = addDays(currentDate, 1);
    }

    return daysArray;
};

// const updatePlan = (date: string, schedule: Schedule) => {
//     const plan_date_exists = schedule.plan_dates.find((plan) => format(plan.date, 'yyyy-MM-dd') == date)
//     if (plan_date_exists) {
//         props.destroyPlanDate(plan_date_exists.id)
//     } else {
//         props.submitPlanDate({
//             date,
//             time_spent: 8.75,
//             schedule_id: schedule.id
//         })
//     }
// }

// const updateActual = (date: string, schedule: Schedule) => {
//     const actual_date_exists = schedule.actual_dates.find((actual) => format(actual.date, 'yyyy-MM-dd') == date)
//     if (actual_date_exists) {
//         props.destroyActualDate(actual_date_exists.id)
//     } else {
//         props.submitActualDate({
//             date,
//             time_spent: 8.75,
//             schedule_id: schedule.id
//         })
//     }
// }

// const dateDesc = (planDates: PlanDates[]) => {
//     return planDates.sort((a, b) => compareDesc(new Date(a.date), new
//         Date(b.date)))
// }

/**Storing of new Projects */
const storeProject = () => {
    const payload = {
        ...post_project_form.value,
        schedule_id: schedule_id.value
    }
    props.storeProjects(payload)
    showProjectStoreModal.value = false
}

// const showNoteModal = (date: string, schedule: Schedule) => {
//     const day = schedule.actual_dates.find((actual) => format(actual.date, 'yyyy-MM-dd') == date)
//     if (!day) return alert('Actual date not found')
//     noteActualDay.value = day
//     noteModal.value = true
// }

const openProjectModal = (id: number, name: string) => {
    showProjectStoreModal.value = true
    schedule_id.value = id
    schedule_name.value = name
    post_project_form.value.project_name = `${ganttChart.value.name} - ${schedule_name.value}`
}

const handleStatusChange = useDebounceFn((id: number, status: string) => {
    props.changeStatus(id, status)
}, 1000);


provide('note', noteActualDay)

//step_btn_rfnXe7dwsvw9SCf
</script>
<template>
    <div class=" bg-blue-50 w-[99vw] overflow-x-auto flex h-max" v-if="ganttChart">

        <table id="ganttChart" class="bg-white sticky left-0 z-20">
            <thead>
                <tr class="">
                    <th colspan="8" class="p-2 text-base border border-black bg-white">{{ ganttChart.name }}</th>
                </tr>
                <tr class="">
                    <th v-for="(field, i) in fields" :key="i"
                        :class="`${field.key == 'id' ? 'w-10 bg-blue-200' : field.key == 'schedule' ? 'bg-white' : 'min-w-32 bg-blue-200'} border border-black`">
                        <div v-if="field.key == 'date'" class="">
                            <div class="border-b border-black p-1">
                                {{ field.label }}
                            </div>
                            <div class="flex h-full">
                                <div class="w-full p-1 border-r border-black">
                                    Start
                                </div>
                                <div class="w-full p-1 ">
                                    End
                                </div>
                            </div>
                        </div>
                        <p v-else>
                            {{ field.label }}
                        </p>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="schedule in ganttChart.schedules" :key="schedule.id"
                    :class="`${schedule.status == 'Ongoing' ? 'bg-yellow-100' : schedule.status == 'On-Schedule' ? 'bg-green-100' : schedule.status == 'Delayed' ? 'bg-red-100' : ''} `">
                    <td :class="`text-center border sticky border-black ${field.key == 'users' ? 'bg-blue-200 ' : field.key == 'id' ? 'bg-blue-200 px-5' : ''} `"
                        v-for="(field, i) in fields" :key="i">
                        <div v-if="field.key == 'users'" class="w-full  p-1">
                            <span v-for="user in schedule[field.key]" class="flex gap-1 justify-center">
                                <p class="text-center">{{ user.username }}</p>
                            </span>
                        </div>
                        <div v-else-if="field.key == 'percent_completed'" class="p-2">
                            <!-- {{ schedule[field.key] ? schedule[field.key] : '-' }} -->
                            <input type="number" class="text-center bg-inherit w-20 py-3"
                                v-model="schedule.percent_completed" placeholder="Enter %" />
                        </div>
                        <div v-else-if="field.key == 'duration'">
                            <div class="border-b p-1 bg-blue-200 min-w-16">
                                Plan
                            </div>
                            <div class="p-1">
                                Actual
                            </div>
                        </div>
                        <div v-else-if="field.key == 'no_of_days'">
                            <div class="border-b p-1 bg-blue-200 min-w-16">
                                {{ schedule.plan_dates.length }}
                            </div>
                            <div class="p-1">
                                {{ schedule.actual_dates.length }}
                            </div>
                        </div>
                        <div v-else-if="field.key == 'date'" class="flex">
                            <div class="border-r border-black flex flex-col">
                                <!-- <input readonly
                                    :value="schedule.plan_dates.length > 0 ? format(dateDesc(schedule.plan_dates)[dateDesc(schedule.plan_dates).length - 1].date, 'yyyy-MM-dd') : null"
                                    type="date" class="border-b p-1 bg-blue-200 min-w-16 text-center font-medium" />
                                <input readonly
                                    :value="schedule.actual_dates.length > 0 ? format(dateDesc(schedule.actual_dates)[dateDesc(schedule.actual_dates).length - 1].date, 'yyyy-MM-dd') : null"
                                    type="date" class="p-1 text-center font-medium" /> -->
                            </div>
                            <div class="flex flex-col">
                                <!-- <input readonly
                                    :value="schedule.plan_dates.length > 0 ? format(dateDesc(schedule.plan_dates)[0].date, 'yyyy-MM-dd') : null"
                                    type="date" class="border-b p-1 bg-blue-200 min-w-16 text-center font-medium" />
                                <input readonly
                                    :value="schedule.actual_dates.length > 0 ? format(dateDesc(schedule.actual_dates)[0].date, 'yyyy-MM-dd') : null"
                                    type="date" class="p-1 text-center font-medium" /> -->
                            </div>
                        </div>
                        <div v-else-if="field.key == 'status'">
                            <select v-model="schedule.status" @change="handleStatusChange(schedule.id, schedule.status)"
                                class="bg-inherit text-center">
                                <option v-for="(data, i) in [
                                    { value: 'Pending', label: 'Pending' },
                                    { value: 'Ongoing', label: 'Ongoing' },
                                    { value: 'On-Schedule', label: 'On-Schedule' },
                                    { value: 'Delayed', label: 'Delayed' }
                                ]" :key="i" :value="data.value">
                                    {{ data.label }}
                                </option>
                            </select>
                        </div>
                        <p v-else class="relative">
                            <Button @click="openProjectModal(schedule.id, schedule.name)"
                                v-if="field.key == 'name' && !schedule.project"
                                :title="!schedule.project ? `Attach a Kanban!` : 'Go to the project'"
                                class="absolute bottom-4 right-0 shadow shadow-blue-100 text-blue-800">
                                <PhKanban class="size-3" />
                            </Button>
                            <router-link v-else-if="schedule.project && field.key == 'name'"
                                class="absolute bottom-4 right-0 inline-flex items-center gap-1 p-1 font-medium outline-0 shadow shadow-yellow-200 text-yellow-800 bg-yellow-200 hover:bg-yellow-100 rounded"
                                :to="{ name: 'Projects' }">
                                <FaRoute class="size-3" />
                            </router-link>
                            {{ schedule[field.key] }}
                        </p>
                    </td>
                </tr>
            </tbody>
        </table>
        <table>
            <thead>
                <tr>
                    <th class="p-2 text-base border border-black bg-white">
                        Date Range
                    </th>
                </tr>
                <tr>
                    <th>
                        <div class="flex h-full" v-if="ganttChart.schedules">
                            <div class="">
                                <div class="flex w-full">
                                    <div class="w-full"
                                        v-for="dates in getMonthsBetween(ganttChart.date_from, ganttChart.date_to)"
                                        :key="dates">
                                        <p class="border border-black bg-cyan-100 w-full ">
                                            <!-- {{ format(dates, 'LLLL') }} -->
                                        </p>
                                    </div>
                                </div>
                                <div class="w-full flex">
                                    <span
                                        :class="`min-w-8 text-center border border-dashed border-black text-[8px] ${name.slice(0, 3) == 'Sat' || name.slice(0, 3) == 'Sun' ? 'bg-orange-300' : ''}`"
                                        v-for="{ day, name } in getDaysBetween(ganttChart.date_from, ganttChart.date_to)"
                                        :key="day">
                                        <p>{{ day }}</p>
                                    </span>
                                </div>
                                <div class="w-full flex">
                                    <span
                                        :class="`w-8 text-center border border-dashed border-black text-[8px] ${name.slice(0, 3) == 'Sat' || name.slice(0, 3) == 'Sun' ? 'bg-orange-300' : ''}`"
                                        v-for="{ day, name } in getDaysBetween(ganttChart.date_from, ganttChart.date_to)"
                                        :key="day">
                                        <p>{{ name.slice(0, 3) }}</p>
                                    </span>
                                </div>
                            </div>
                            <div>
                            </div>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="schedule in ganttChart.schedules" :key="schedule.id"
                    :class="`${schedule.status == 'Ongoing' ? 'bg-yellow-100' : schedule.status == 'On-Schedule' ? 'bg-green-100' : schedule.status == 'Delayed' ? 'bg-red-100' : ''} `">
                    <td>
                        <div class="flex h-full" v-if="ganttChart.schedules">
                            <div>
                                <div class="w-full flex">
                                    <!-- <span @click="updatePlan(date, schedule)"
                                        :class="`w-8 h-7 text-center group relative border border-dashed border-black flex items-center justify-center hover:bg-gray-400 cursor-pointer ${name.slice(0, 3) == 'Sat' || name.slice(0, 3) == 'Sun' ? 'bg-orange-300' : ''}`"
                                        v-for="{ day, name, date } in getDaysBetween(ganttChart.date_from, ganttChart.date_to)"
                                        :key="day">
                                        <div v-if="schedule.plan_dates.find((actual) => format(actual.date, 'yyyy-MM-dd') == date)"
                                            class="p-1 border border-black"></div>
                                    </span> -->
                                </div>
                                <div class="w-full flex">
                                    <span
                                        :class="`w-8 h-7 text-center group relative border border-dashed border-black flex items-center justify-center hover:bg-gray-400 cursor-pointer ${name.slice(0, 3) == 'Sat' || name.slice(0, 3) == 'Sun' ? 'bg-orange-300' : ''}`"
                                        v-for="{ day, name } in getDaysBetween(ganttChart.date_from, ganttChart.date_to)"
                                        :key="day">
                                        <!-- <div @click="updateActual(date, schedule)"
                                            v-if="schedule.actual_dates.find((actual) => format(actual.date, 'yyyy-MM-dd') == date)"
                                            class="h-full w-full flex items-center justify-center">
                                            <div class="p-1 bg-black"></div>
                                        </div>
                                        <div @click="updateActual(date, schedule)" v-else class="h-full w-full">
                                        </div> -->
                                        <div
                                            class="absolute group/edit flex gap-2 z-10 bottom-6 w-max bg-white p-2 rounded-lg shadow-lg border border-blue-300 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-300">
                                            <!-- <Button @click="showNoteModal(date, schedule)"
                                                class="bg-purple-600 hover:bg-purple-300 active:bg-purple-700">
                                                <FlNoteEdit class="text-white" />
                                            </Button>
                                            <Button @click="showNoteModal(date, schedule)"
                                                class="bg-green-600 hover:bg-green-300 active:bg-green-700">
                                                <MdHolidayVillage class="text-white" />
                                            </Button>
                                            <Button @click="showNoteModal(date, schedule)"
                                                class="bg-red-600 hover:bg-red-300 active:bg-red-700">
                                                <MdSick class="text-white" />
                                            </Button>
                                            <Button @click="showNoteModal(date, schedule)"
                                                class="bg-yellow-600 hover:bg-yellow-300 active:bg-yellow-700">
                                                <MdEventBusy class="text-white" />
                                            </Button> -->
                                        </div>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>

            </tbody>
        </table>
    </div>
    <Modal :visible="noteModal" @update:visible="noteModal = $event">
        <GanttchartNote />
    </Modal>
    <Modal :visible="showProjectStoreModal" @update:visible="showProjectStoreModal = $event">
        <ProjectModal :post_project_form="post_project_form" :storeProject="storeProject" />
    </Modal>
</template>