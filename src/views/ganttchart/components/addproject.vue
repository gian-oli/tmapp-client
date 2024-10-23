<script setup lang="ts">
import { Button, Form, Input } from '@/components/utilities';
import { MdAddChart, ReFolderAddFill } from '@kalimahapps/vue-icons';
import { addMonths, format } from 'date-fns';
import { ref } from 'vue';

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


const submitForm = () => {
    props.createGantt(form.value)
}
</script>
<template>
    <div class="text-base font-medium flex gap-2 items-center text-gray-500  border-b py-2">
        <ReFolderAddFill class="size-5" />
        Add Project
    </div>
    <div class="p-5">
        <Form :submit="submitForm" class="space-y-10">
            <Input id="gantt-name" label="Gantt chart name" v-model="form.name" required />
            <div class="space-y-5">
                <p class="text-xs italic text-red-700">Estimate Development Completion:</p>
                <Input type="date" id="gantt-name" label="Date From" v-model="form.date_from" required />
                <Input type="date" id="gantt-name" label="Date To" v-model="form.date_to" required />
                <Button type="submit" class="w-full p-2 flex justify-center gap-1 items-center">
                    <MdAddChart class="size-5" /> Add
                </Button>
            </div>
        </Form>
    </div>
</template>