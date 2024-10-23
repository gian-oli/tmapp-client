<script setup lang="ts">
import { ActualDates } from '@/types';
import { inject, ref, Ref } from 'vue';
import { Form, Input } from '../utilities';
import Button from '../utilities/Button.vue';
import { ChStickyNote, IcSubmitDocument } from '@kalimahapps/vue-icons';


const note = inject('note') as Ref<ActualDates>

const initial_form = {
    note: note.value.note,
    time_spent: note.value.time_spent
}
const form = ref<{
    note: string,
    time_spent: number
}>(initial_form)

const handleSubmit = () => {

}
</script>
<template>
    <div class="space-y-4">
        <p><ChStickyNote class="size-5 inline-block text-yellow-600"/> Edit Note</p>
        <Form :submit="handleSubmit" class="space-y-2">
            <Input id="time_spent" v-model="form.time_spent" label="Time Spent" />
            <Input id="note" v-model="form.note" label="Note" is-textarea />
            <Button type="submit" class="w-full items-center justify-center gap-1 p-2"><IcSubmitDocument class="size-5 text-blue-800"/> <p>Submit</p></Button>
        </Form>
    </div>
</template>