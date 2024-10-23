<script setup lang="ts">
import { ref } from 'vue';
import { Button, Form, Input } from '../utilities';
import { MdAddChart } from '@kalimahapps/vue-icons';
import { addMonths, format } from 'date-fns';

const props = defineProps<{
    createGantt: (form: {
        name: string;
        date_from: string;
        date_to: string;
    }) => void;
}>()

const initial_form = ref({
    name: '',
    date_from: format(new Date(), 'yyyy-MM-dd'),
    date_to: format(addMonths(new Date(), 3), 'yyyy-MM-dd')
})

const form = ref<{
    name: string;
    date_from: string;
    date_to: string;
}>(initial_form.value)

const submitGantt = () => {
    console.log(form.value)
    props.createGantt(form.value);
}

</script>
<template>
    <div class="space-y-2">
        <p>New Gantt Chart</p>
        <Form :submit="submitGantt" class="space-y-2">
            <Input id="gantt-name" label="Gantt chart name" v-model="form.name" required />
            <p class="text-xs italic text-red-700">Estimate Development Completion:</p>
            <Input type="date" id="gantt-name" label="Date From" v-model="form.date_from" required />
            <Input type="date" id="gantt-name" label="Date To" v-model="form.date_to" required />
            <Button type="submit" class="w-full p-2 flex justify-center gap-1 items-center">
                <MdAddChart class="size-5" /> Add
            </Button>
        </Form>
    </div>
</template>