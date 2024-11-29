<script setup lang="ts">
import { computed } from 'vue'
import { format, parseISO, differenceInDays, addDays } from 'date-fns'
import { GanttChart, } from '@/types';


type ScheduleStatus = 'Pending' | 'Ongoing' | 'On-Schedule' | 'Delayed';

interface DateColumn {
    fullDate: string
    displayDate: string
}

interface GanttChartProps {
    ganttChart: GanttChart | null
}

const props = defineProps<GanttChartProps>()

const dateColumns = computed<DateColumn[]>(() => {
    if (!props.ganttChart || !props.ganttChart.schedules || props.ganttChart.schedules.length === 0) {
        return [];
    }

    const schedules = props.ganttChart.schedules || [];

    const allPlanDates = schedules.flatMap(schedule => schedule.plan_dates.map(pd => parseISO(pd.date)));
    const allActualDates = schedules.flatMap(schedule => schedule.actual_dates.map(ad => parseISO(ad.date)));


    const startDate = allPlanDates.length > 0 || allActualDates.length > 0
        ? new Date(Math.min(...(allPlanDates.concat(allActualDates).map(date => date.getTime()))))
        : new Date(props.ganttChart.date_from);


    const endDate = allPlanDates.length > 0 || allActualDates.length > 0
        ? new Date(Math.max(...(allPlanDates.concat(allActualDates).map(date => date.getTime()))))
        : new Date(props.ganttChart.date_to);

    const columns: DateColumn[] = [];
    const totalDays = differenceInDays(endDate, startDate) + 1;

    for (let i = 0; i < totalDays; i++) {
        const currentDate = addDays(startDate, i);
        columns.push({
            fullDate: format(currentDate, 'yyyy-MM-dd'),
            displayDate: format(currentDate, 'dd')
        });
    }

    return columns;
});

const dateGroups = computed<Record<string, Record<string, DateColumn[]>>>(() => {
    const groups: Record<string, Record<string, DateColumn[]>> = {}
    dateColumns.value.forEach(date => {
        const [year, month] = date.fullDate.split('-')
        if (!groups[year]) groups[year] = {}
        if (!groups[year][month]) groups[year][month] = []
        groups[year][month].push(date)
    })
    return groups
})

const calculateBarPosition = (start: Date, end: Date, chartStart: Date, totalDays: number) => {
    const startOffset = differenceInDays(start, chartStart);
    const duration = differenceInDays(end, start) + 1;

    return {
        startPercentage: (startOffset / totalDays) * 100,
        widthPercentage: (duration / totalDays) * 100
    };
}

const processedSchedules = computed(() => {
    if (!props.ganttChart || !props.ganttChart.schedules) return [];

    const chartStartDate = dateColumns.value.length > 0
        ? parseISO(dateColumns.value[0].fullDate)
        : new Date(props.ganttChart.date_from);
    const totalChartDays = dateColumns.value.length;

    return props.ganttChart.schedules.map(schedule => {
        // Parse and sort plan dates
        const planDates = schedule.plan_dates
            .map(pd => parseISO(pd.date))
            .sort((a, b) => a.getTime() - b.getTime());

        // Parse and sort actual dates
        const actualDates = schedule.actual_dates
            .map(ad => parseISO(ad.date))
            .sort((a, b) => a.getTime() - b.getTime());

        // Calculate bar positions
        const planPosition = planDates.length > 1
            ? calculateBarPosition(
                planDates[0],
                planDates[planDates.length - 1],
                chartStartDate,
                totalChartDays
            )
            : null;

        const actualPosition = actualDates.length > 1
            ? calculateBarPosition(
                actualDates[0],
                actualDates[actualDates.length - 1],
                chartStartDate,
                totalChartDays
            )
            : null;

        // Determine status color
        const status = isValidStatus(schedule.status)
            ? schedule.status
            : 'Pending';
        const statusColor = getStatusColor(status);

        return {
            ...schedule,
            planPosition,
            actualPosition,
            status,
            statusColor
        };
    });
});

const getStatusColor = (status: ScheduleStatus): string => {
    switch (status) {
        case 'On-Schedule':
            return 'bg-green-500';
        case 'Ongoing':
            return 'bg-yellow-500';
        case 'Delayed':
            return 'bg-red-500';
        case 'Pending':
            return 'bg-gray-500';
        default:
            return 'bg-blue-500';
    }
}

const isValidStatus = (status: string): status is ScheduleStatus => {
    return ['Pending', 'Ongoing', 'On-Schedule', 'Delayed'].includes(status);
};
</script>

<template>
    <div class="w-full overflow-x-auto h-[47vh]">
        <table class="w-full border-collapse">
            <thead>
                <tr>
                    <th class="border p-2 sticky left-0 bg-white z-10">Year</th>
                    <th v-for="(months, year) in dateGroups" :key="year"
                        :colspan="Object.values(months).reduce((sum, month) => sum + month.length, 0)"
                        class="border p-2 text-center">
                        {{ year }}
                    </th>
                </tr>
                <tr>
                    <th class="border p-2 sticky left-0 bg-white z-10">Month</th>
                    <template v-for="(months, year) in dateGroups" :key="year">
                        <th v-for="(monthDates, month) in months" :key="month" :colspan="monthDates.length"
                            class="border p-2 text-center">
                            {{ format(new Date(parseInt(year), parseInt(month) - 1), 'MMMM') }}
                        </th>
                    </template>
                </tr>
                <tr>
                    <th class="border p-2 sticky left-0 bg-white z-10"></th>
                    <td v-for="date in dateColumns" :key="date.fullDate" class="border text-center text-xs">
                        <p class="w-10 text-[10px]">{{ date.displayDate }}</p>
                    </td>
                </tr>
                <tr>
                    <th class="border p-2 sticky left-0 bg-white z-10"></th>
                    <td v-for="date in dateColumns" :key="date.fullDate" class="border text-center text-xs">
                        <p class="w-10 text-[10px]">{{ format(parseISO(date.fullDate), 'EEE').toUpperCase() }}</p>
                    </td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="schedule in processedSchedules" :key="schedule.id" class="">
                    <td class="border p-2 sticky left-0 bg-white z-10 flex items-center justify-between text-[12px]">
                        <p class="w-max">{{ schedule.name }}</p>
                        <div class="ml-2 flex">
                            <span v-for="user in schedule.users" :key="user.id"
                                class=" bg-blue-100 rounded px-2 mr-1 text-[10px] font-bold">
                                {{ user.username }}
                            </span>
                            <span class="w-10 rounded text-center font-bold text-white text-[10px]" :class="schedule.statusColor">
                                {{schedule.percent_completed ??= '0'}}%
                            </span>
                        </div>
                    </td>
                    <td :colspan="dateColumns.length" class="relative border border-dotted border-gray-300" >
                        <div class="absolute inset-0">
                            <!-- Plan Bar -->
                            <div v-if="schedule.planPosition" class="absolute h-4 opacity-50 rounded border border-dashed border-blue-600 bg-blue-200" :style="{
                                left: `${schedule.planPosition.startPercentage}%`,
                                width: `${schedule.planPosition.widthPercentage}%`,
                            }">
                            <p class="text-center">PLAN</p>
                            </div>

                            <!-- Actual Bar -->
                            <div v-if="schedule.actualPosition" class="absolute h-4 opacity-75 rounded"
                                :class="schedule.statusColor" :style="{
                                    left: `${schedule.actualPosition.startPercentage}%`,
                                    width: `${schedule.actualPosition.widthPercentage}%`,
                                    top: '48%'
                                }">
                                <div class="text-white text-right">
                                    {{ schedule.percent_completed }}%
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>