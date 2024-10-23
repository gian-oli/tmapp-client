<script setup lang="ts">
import { Schedule } from '@/types';
import { useDebounceFn } from '@vueuse/core';
import { eachDayOfInterval, format, isAfter, parseISO } from 'date-fns';
import { computed, ref, watch } from 'vue';
import draggable from 'vuedraggable';

const props = defineProps<{
    schedules: Schedule[];
    updateSchedule: (
        id: number,
        data: { status?: string, percent_completed?: number }
    ) => void,
    updatePlanDates: (id: number, data: { dates: string[] }) => void,
    updateActualDates: (id: number, data: { dates: string[] }) => void
}>();

const localSchedules = ref<Schedule[]>([...props.schedules]);
const selectedSchedule = ref<Schedule | null>(null);

const statusOptions = ref([
    { value: 'Pending', label: 'Pending' },
    { value: 'Ongoing', label: 'Ongoing' },
    { value: 'On-Schedule', label: 'On-Schedule' },
    { value: 'Delayed', label: 'Delayed' }
]);

watch(() => props.schedules, (newSchedules) => {
    localSchedules.value = [...newSchedules];
    selectedSchedule.value = null
    console.log(newSchedules)
});

const isDragging = ref(false);

const onDragStart = () => {
    isDragging.value = true;
};

const onDragEnd = () => {
    isDragging.value = false;
};

const cloneItem = (item: Schedule) => {
    return { ...item, isDragging: true };
};


const selectSchedule = (schedule: Schedule) => {
    selectedSchedule.value = schedule;
};

const calculateDateRange = (
    dates: { id: number; date: Date; time_spent: number; schedule_id: number }[],
    scheduleId: number
) => {
    const filteredDates = dates.filter(date => date.schedule_id === scheduleId);
    if (filteredDates.length === 0) {
        return { start: null, end: null };
    }
    const sortedDates = filteredDates.sort((a, b) => a.date.getTime() - b.date.getTime());
    return {
        start: sortedDates[0].date,
        end: sortedDates[sortedDates.length - 1].date
    };
};

const planDateRange = computed(() => {
    return localSchedules.value.map(schedule => ({
        schedule_id: schedule.id,
        range: calculateDateRange(
            schedule.plan_dates.map(date => ({
                id: date.id,
                date: new Date(date.date),
                time_spent: date.time_spent,
                schedule_id: schedule.id
            })),
            schedule.id
        )
    }));
});

const actualDateRange = computed(() => {
    return localSchedules.value.map(schedule => ({
        schedule_id: schedule.id,
        range: calculateDateRange(
            schedule.actual_dates.map(date => ({
                id: date.id,
                date: new Date(date.date),
                time_spent: date.time_spent,
                schedule_id: schedule.id
            })),
            schedule.id
        )
    }));
});

const localCompletionValue = ref(selectedSchedule.value?.percent_completed
    ? Number(selectedSchedule.value.percent_completed.toString().replace(/%/g, '')) // Removing specific character
    : 0);

const getStatus = (localCompletionValue: number, selectedSchedule: Schedule) => {
    if (!selectedSchedule.plan_dates.length || !selectedSchedule.actual_dates.length) {
        return 'Pending';
    }

    const lastPlannedDateObj = selectedSchedule.plan_dates[selectedSchedule.plan_dates.length - 1];
    const lastActualDateObj = selectedSchedule.actual_dates[selectedSchedule.actual_dates.length - 1];

    const lastPlannedDate = parseISO(lastPlannedDateObj.date);
    const lastActualDate = parseISO(lastActualDateObj.date);

    if (localCompletionValue == 100) {
        if (isAfter(lastActualDate, lastPlannedDate)) {
            return 'Delayed';
        } else {
            return 'On-Schedule';
        }
    }

    if (localCompletionValue > 0) {
        return 'Ongoing';
    } else {
        return 'Pending';
    }
};



const adjustCompletion = () => {
    if (selectedSchedule.value) {
        try {
            const completionValue = localCompletionValue.value;
            const status = getStatus(completionValue, selectedSchedule.value);

            const data = {
                status,
                percent_completed: completionValue
            };
            props.updateSchedule(selectedSchedule.value.id, data)
        } catch (e) {
            console.error(e);
        }
    }
};

const debouncedAdjustCompletion = useDebounceFn(adjustCompletion, 500);

const onDateRangePlanUpdate = (scheduleId: number, newRange: [Date, Date]) => {
    const [start, end] = newRange;
    const allDates = eachDayOfInterval({
        start,
        end
    }).map(date => format(date, 'yyyy-MM-dd'));
    try {
        props.updatePlanDates(scheduleId, { dates: [...allDates] }); 
    } catch (e) {
        console.log(e)
    }
    
};
const onDateRangeActualUpdate = (scheduleId: number, newRange: [Date, Date]) => {
    const [start, end] = newRange;
    const allDates = eachDayOfInterval({
        start,
        end
    }).map(date => format(date, 'yyyy-MM-dd'));
    try {
        props.updateActualDates(scheduleId, { dates: [...allDates] }); 
    } catch (e) {
        console.log(e)
    }
    
};

watch(selectedSchedule, (newSchedule) => {
    if (newSchedule) {
        // Reset completion value only if selected schedule changes
        localCompletionValue.value = newSchedule.percent_completed
            ? Number(newSchedule.percent_completed.toString().replace(/%/g, ''))
            : 0;
    }
});
</script>

<template>
    <div class="flex flex-col h-full w-full bg-white rounded-lg shadow-md p-4 gap-4 text-xs">
        <img class="absolute size-60 bottom-0 right-60" src="/assets/images/schedule-img.png" />
        <div class="flex gap-4">
            <div class="w-2/3 h-full relative flex flex-col overflow-y-auto">
                <draggable v-model="localSchedules" group="schedules" @start="onDragStart" @end="onDragEnd"
                    :animation="200" :clone="cloneItem" item-key="id">
                    <template #item="{ element }">
                        <div tabindex="0" :id="`sched_${element.id}`"
                            class="draggable-item group relative bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-lg p-6 mb-4 cursor-pointer shadow hover:shadow-lg transition-shadow duration-300 ease-in-out focus:ring-2 focus:ring-blue-400 w-full"
                            @click="selectSchedule(element)">
                            <div class="flex justify-between items-start space-x-6">
                                <div class="space-y-4 flex-1">
                                    <span class="font-bold text-xl text-blue-800 truncate">{{ element.name }}</span>
                                    <div class="flex flex-col space-y-2">
                                        <label class="text-gray-600 text-sm">Status:</label>
                                        <select v-model="element.status"
                                            class="status-select rounded-md border border-gray-300 bg-gray-50 p-2 text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-400 transition-all">
                                            <option v-for="option in statusOptions" :key="option.value"
                                                :value="option.value">
                                                {{ option.label }}
                                            </option>
                                        </select>
                                    </div>
                                    <div>
                                        <h4 class="font-semibold text-sm text-gray-700 mb-2">Assigned Users:</h4>
                                        <ul class="list-inside list-disc space-y-1">
                                            <li v-for="user in element.users" :key="user.id"
                                                class="text-gray-600 text-sm">
                                                {{ user.username }} ({{ user.role_id }}) - {{ user.email }}
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div
                                    class="flex items-center space-x-4 bg-gray-50 border border-gray-200 rounded-lg p-3 shadow-sm">
                                    <div class="text-center">
                                        <h2
                                            class="text-sm font-semibold bg-orange-100 text-orange-700 py-1 px-3 rounded-md">
                                            PLAN</h2>
                                        <v-date-picker
                                            :model-value="planDateRange.find(item => item.schedule_id === element.id)?.range"
                                            is-range
                                            @update:model-value="(newRange: any) => onDateRangePlanUpdate(element.id, [newRange.start, newRange.end])" />
                                    </div>
                                    <div class="text-center">
                                        <h2
                                            class="text-sm font-semibold bg-green-100 text-green-700 py-1 px-3 rounded-md">
                                            ACTUAL</h2>
                                        <v-date-picker
                                            :model-value="actualDateRange.find(item => item.schedule_id === element.id)?.range"
                                            is-range
                                            @update:model-value="(newRange: any) => onDateRangeActualUpdate(element.id, [newRange.start, newRange.end])" />
                                    </div>
                                </div>

                                <div class="space-y-4 text-right">
                                    <span
                                        class="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-semibold uppercase">
                                        {{ element.priority || 'Low Priority' }}
                                    </span>
                                    <div class="text-sm text-gray-600">
                                        Completion:
                                        <strong class="text-blue-600">
                                            {{ element.percent_completed || 'Not started' }}%
                                        </strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </draggable>
            </div>

            <div class="w-1/3 h-full sticky top-0">
                <div class="bg-blue-700 text-white p-6 text-center rounded-lg shadow-lg border-b-4 border-blue-800">
                    <h2 class="text-xl font-bold">Comprehensive Schedule Report</h2>
                    <p class="text-sm opacity-75">Your detailed overview of tasks and schedules</p>
                </div>

                <div v-if="selectedSchedule"
                    class="bg-white border border-gray-300 p-4 mt-2 rounded-lg shadow-lg transition-transform duration-300 hover:shadow-xl">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ selectedSchedule.name }}</h3>
                    <p class="text-gray-700 text-sm mb-2"><strong>Status:</strong> {{ selectedSchedule.status }}</p>
                    <p class="text-gray-700 text-sm mb-2"><strong>Priority:</strong> {{ selectedSchedule.priority ||
                        'Low Priority'
                        }}</p>
                    <span class="text-gray-700 text-sm mb-4">
                        <strong>Completion:</strong>
                        <div class="flex items-center mt-2">
                            <span class="text-gray-600 text-sm mr-2">0%</span>
                            <input id="completion" type="range" min="0" max="100" @change="debouncedAdjustCompletion"
                                v-model="localCompletionValue" class="w-full accent-blue-600" />
                            <span class="text-gray-600 text-sm ml-2">100%</span>
                        </div>
                        <div class="flex items-center mt-2">
                            <input type="number" min="0" max="100"
                                class="px-3 py-1 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-150 ease-in-out"
                                @input="debouncedAdjustCompletion" v-model="localCompletionValue" />
                            <span class="text-gray-600 text-sm ml-2">Current Value: {{ localCompletionValue }}%</span>
                        </div>
                    </span>

                    <div class="mb-4">
                        <h4 class="text-sm font-semibold text-gray-800 mb-2">Assigned Users:</h4>
                        <ul class="list-disc list-inside">
                            <li v-for="user in selectedSchedule.users" :key="user.id" class="text-gray-600 text-sm">
                                {{ user.username }} ({{ user.role_id }}) - {{ user.email }}
                            </li>
                        </ul>
                    </div>

                    <div class="flex justify-between text-sm text-gray-700">
                        <div>
                            <h4 class="font-semibold text-gray-800">Plan Dates:</h4>
                            <p class="text-gray-600">
                                {{
                                    planDateRange.find(item => item.schedule_id === selectedSchedule?.id)?.range.start
                                        instanceof Date
                                        ? format(planDateRange.find(item => item.schedule_id ===
                                            selectedSchedule?.id)?.range.start as Date,
                                            'yyyy-MM-dd')
                                        : 'N/A'
                                }} -
                                {{
                                    planDateRange.find(item => item.schedule_id === selectedSchedule?.id)?.range.end
                                        instanceof Date
                                        ? format(planDateRange.find(item => item.schedule_id ===
                                            selectedSchedule?.id)?.range.end as Date,
                                            'yyyy-MM-dd')
                                        : 'N/A'
                                }}
                            </p>
                        </div>
                        <div>
                            <h4 class="font-semibold text-gray-800">Actual Dates:</h4>
                            <p class="text-gray-600">
                                {{
                                    actualDateRange.find(item => item.schedule_id === selectedSchedule?.id)?.range.start
                                        instanceof Date
                                        ? format(actualDateRange.find(item => item.schedule_id ===
                                            selectedSchedule?.id)?.range.start as
                                            Date, 'yyyy-MM-dd')
                                        : 'N/A'
                                }} -
                                {{
                                    actualDateRange.find(item => item.schedule_id === selectedSchedule?.id)?.range.end
                                        instanceof Date
                                        ? format(actualDateRange.find(item => item.schedule_id ===
                                            selectedSchedule?.id)?.range.end as Date,
                                            'yyyy-MM-dd')
                                        : 'N/A'
                                }}
                            </p>
                        </div>
                    </div>
                </div>
                <div v-else class="p-4 mt-2 text-center text-gray-500 text-base">
                    Select a schedule
                </div>

            </div>
        </div>
    </div>
</template>



<style scoped>
/* Ensure full opacity during dragging */
.sortable-chosen {
    opacity: 1 !important;
}

/* Smooth transitions without hover scale effect */
.draggable-item {
    transition: opacity 0.2s;
}

/* Change border color and add shadow when dragging */
.sortable-chosen {
    border-color: #38a169;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>