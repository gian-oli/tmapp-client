<script setup lang="ts">
import Form from '@/components/utilities/Form.vue';
import Input from '@/components/utilities/Input.vue';



const addSwimlane = () => {

}
</script>
<template>
    <div class="space-y-2">
        <p>Add Swimlane for this project?</p>
        <Form :submit="addSwimlane">
            <!-- Form fields go here -->
            <Input type="text" id="swimlane-name" label="Swimlane Name" placeholder="test" />
        </Form>
    </div>
</template>