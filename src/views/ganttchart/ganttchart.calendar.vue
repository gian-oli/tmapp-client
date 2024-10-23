<script setup lang="ts">
import { GanttChart, Schedule } from '@/types';
import { addDays, addMonths, differenceInMonths, format, getDaysInMonth, getDay, startOfMonth } from 'date-fns';
import { computed, ref } from 'vue';

const props = defineProps<{
    ganttChart: GanttChart | null
}>();

interface DateEntry {
    date: string; // or Date if using Date objects
    // Include other properties if needed
}

// Tooltip reference
const tooltip = ref<{ visible: boolean; text: string; x: number; y: number }>({ visible: false, text: '', x: 0, y: 0 });

// Array of 20 colors
const colors = [
    '#FF5733', '#33FF57', '#3357FF', '#FF33A5', '#A533FF', '#33FFD6', '#FF8C33', '#FFD433', '#8CFF33', '#33FF9E',
    '#337BFF', '#A533FF', '#FF3367', '#33FF57', '#5733FF', '#FF5733', '#A5FF33', '#33FFB9', '#FF33D4', '#33FFCC'
];

// Function to get months between two dates
const getMonthsBetween = (startDate: Date | string | null, endDate: Date | string | null): { month: string; year: number }[] => {
    if (!startDate || !endDate) {
        return []; // Return empty array if any date is null
    }

    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

    const monthsDifference = differenceInMonths(end, start);
    const monthsArray: { month: string; year: number }[] = [];

    for (let i = 0; i <= monthsDifference; i++) {
        const monthDate = addMonths(start, i);
        monthsArray.push({
            month: format(monthDate, 'yyyy-MM'), // Format month
            year: new Date(monthDate).getFullYear(), // Extract year
        });
    }

    return monthsArray;
};

// Function to get all days in a month for the calendar view
const getDaysOfMonth = (month: string) => {
    const date = new Date(month);
    const daysInMonth = getDaysInMonth(date); // Get total days in the month
    const startDayOfWeek = getDay(startOfMonth(date)); // Get the starting day of the week

    const daysArray = [];

    // Add empty days at the start to align the first day
    for (let i = 0; i < startDayOfWeek; i++) {
        daysArray.push(null);
    }

    // Add each day in the month
    for (let i = 1; i <= daysInMonth; i++) {
        daysArray.push({
            day: i,
            date: format(addDays(startOfMonth(date), i - 1), 'yyyy-MM-dd'),
        });
    }

    return daysArray;
};

// Compute grouped months by year
const groupedMonths = computed(() => {
    if (!props.ganttChart) return {};

    const months = getMonthsBetween(props.ganttChart.date_from, props.ganttChart.date_to);

    // Group months by year
    return months.reduce((acc, { month, year }) => {
        if (!acc[year]) acc[year] = [];
        acc[year].push(month);
        return acc;
    }, {} as Record<number, string[]>);
});

// Assign colors to schedules
const coloredSchedules = computed(() => {
    if (!props.ganttChart) return [];
    if (!props.ganttChart.schedules) return [];
    return props.ganttChart.schedules.map((schedule, index) => ({
        ...schedule,
        color: colors[index % colors.length] // Assign color from the array, looping if necessary
    }));
});

// Show tooltip with planned and actual dates
const showTooltip = (event: MouseEvent, day: { date: string }, schedules: Schedule[]) => {
    const plannedDates = schedules
        .filter(schedule =>
            schedule.plan_dates &&
            schedule.plan_dates.some((plan: DateEntry) => plan.date.startsWith(day.date))
        )
        .map(schedule => schedule.name)
        .join(', ');

    const actualDates = schedules
        .filter(schedule =>
            schedule.actual_dates &&
            schedule.actual_dates.some((actual: DateEntry) => actual.date.startsWith(day.date))
        )
        .map(schedule => schedule.name)
        .join(', ');

    tooltip.value.text = `Date: ${day.date}<br>Planned: ${plannedDates || 'None'}<br>Actual: ${actualDates || 'None'}`;
    tooltip.value.x = event.clientX + 10; // Offset from cursor
    tooltip.value.y = event.clientY + 10; // Offset from cursor
    tooltip.value.visible = true;
};


// Hide tooltip
const hideTooltip = () => {
    tooltip.value.visible = false;
};
</script>

<template>
    <div v-if="ganttChart" class="flex flex-col gap-2">
        <div class="flex flex-col mb-4 gap-1">
            <p class="font-bold">Legend</p>
            <div class="flex flex-wrap gap-4">
                <template v-for="(schedule) in coloredSchedules" :key="schedule.id">
                    <div class="flex items-center space-x-2">
                        <div :style="{ backgroundColor: schedule.color }" class="w-4 h-4 rounded-full"></div>
                        <p>{{ schedule.name }}</p>
                    </div>
                </template>
            </div>
        </div>

        <template v-for="(months, year) in groupedMonths" :key="year">
            <div
                class="font-extrabold text-2xl text-red-800 text-center bg-gradient-to-r from-white via-gray-50 to-blue-100">
                {{ year }}
            </div>

            <div class="flex flex-wrap gap-2 justify-start">
                <template v-for="(month) in months" :key="index">
                    <div
                        class="bg-gradient-to-r from-white to-gray-100 border border-gray-300 rounded-xl p-5 mb-4 shadow-md hover:shadow-2xl transition-shadow duration-300 ease-in-out focus:ring-2 focus:ring-blue-500 w-[33%]">
                        <div class="font-extrabold text-lg text-blue-800 truncate w-full border-b text-center mb-2">
                            {{ format(new Date(month), 'LLLL') }}
                        </div>

                        <div class="grid grid-cols-7 gap-2">
                            <div class="font-bold text-center">Sun</div>
                            <div class="font-bold text-center">Mon</div>
                            <div class="font-bold text-center">Tue</div>
                            <div class="font-bold text-center">Wed</div>
                            <div class="font-bold text-center">Thu</div>
                            <div class="font-bold text-center">Fri</div>
                            <div class="font-bold text-center">Sat</div>

                            <template v-for="(day, dayIndex) in getDaysOfMonth(month)" :key="dayIndex">
                                <div v-if="day" class="text-center border rounded p-2 relative"
                                    @mouseenter="showTooltip($event, day, coloredSchedules)" @mouseleave="hideTooltip">
                                    <p class="">{{ day.day }}</p>
                                    <div v-for="(schedule, scheduleIndex) in coloredSchedules" :key="scheduleIndex"
                                        class="flex justify-evenly">

                                        <div v-if="schedule.plan_dates && schedule.plan_dates.some(plan => plan.date.startsWith(day.date))"
                                            :style="{ backgroundColor: schedule.color }"
                                            class="w-3 h-3 rounded-full planned-date" title="Plan"></div>

                                        <div v-if="schedule.actual_dates && schedule.actual_dates.some(actual => actual.date.startsWith(day.date))"
                                            :style="{ backgroundColor: schedule.color }"
                                            class="w-3 h-3 rounded-full actual-date" title="Actual"></div>
                                    </div>
                                </div>
                                <div v-else class="text-center p-2"></div> <!-- Empty slot for alignment -->
                            </template>
                        </div>
                    </div>
                </template>
            </div>
        </template>

        <div v-if="tooltip.visible" class="tooltip" :style="{ top: `${tooltip.y}px`, left: `${tooltip.x}px` }"
            v-html="tooltip.text">
        </div>
    </div>
</template>

<style scoped>
.tooltip {
    position: absolute;
    background-color: rgba(255, 255, 255, 0.9);
    border: 1px solid gray;
    border-radius: 4px;
    padding: 5px;
    z-index: 100;
    transition: opacity 0.2s ease;
}

.planned-date {
    background-color: #FFC107;
    /* Custom planned date color */
}

.actual-date {
    background-color: #007BFF;
    /* Custom actual date color */
}

.text-center {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.text-center:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
