<script setup lang="ts">
import { ref } from 'vue';
import * as XLSX from 'xlsx';
import { format, parse, isValid } from 'date-fns'; // Import date-fns for date formatting and validation
import Papa from 'papaparse'; // Import papaparse for CSV generation

const jsonData = ref<any[]>([]);
const error = ref<string | null>(null);

const requiredColumns = ['title', 'priority_id', 'due_date', 'assigned_by', 'description', 'user_id', 'project_id', 'swimlane_id'];

const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const rows = XLSX.utils.sheet_to_json(sheet);

                // Validate columns
                if (!validateColumns(rows[0])) {
                    throw new Error('Required columns are missing from the Excel file.');
                }

                // Process rows to match your columns
                jsonData.value = rows.map((row: any) => {
                    let dueDate = '';
                    if (row.due_date && typeof row.due_date === 'string') {
                        // Ensure it's a string and parse it
                        const parsedDate = parse(row.due_date, 'yyyy-MM-dd', new Date());
                        if (isValid(parsedDate)) {
                            dueDate = format(parsedDate, 'yyyy-MM-dd');
                        }
                    }

                    return {
                        title: row.title || '',
                        priority_id: row.priority_id || null,
                        due_date: dueDate || format(new Date(), 'yyyy-MM-dd'), // Use current date if invalid
                        assigned_by: row.assigned_by || null,
                        description: row.description || '',
                        user_id: row.user_id || null,
                        project_id: row.project_id || null,
                        swimlane_id: row.swimlane_id || null,
                    };
                });
                error.value = null; // Clear any previous errors
            } catch (err) {
                error.value = (err as Error).message;
                jsonData.value = []; // Clear jsonData in case of error
            }
        };

        reader.readAsArrayBuffer(file);
    }
};

// Function to validate that required columns are present
const validateColumns = (row: any): boolean => {
    return requiredColumns.every(column => column in row);
};

// Function to download CSV file as a template
const downloadCSV = () => {
    // Define the template with headers and default values
    const templateData = [
        {
            title: '',
            priority_id: null,
            due_date: '',
            assigned_by: '',
            description: '',
            user_id: null,
            project_id: null,
            swimlane_id: null
        }
    ];

    // Convert templateData to CSV format
    const csv = Papa.unparse(templateData, {
        header: true,
        columns: requiredColumns
    });

    // Create a Blob object for the CSV data
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    // Create a link element for the download
    const link = document.createElement('a');
    if (link.download !== undefined) {
        // Create a URL for the Blob object
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'template.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};
</script>

<template>
    <div>
        <input type="file" @change="handleFileUpload" />
        <button @click="downloadCSV">Download Template CSV</button>
        <div v-if="jsonData.length">
            <h2>Data from Excel:</h2>
            <pre>{{ jsonData }}</pre>
        </div>
        <div v-if="error" class="error">
            <h2>Error:</h2>
            <p>{{ error }}</p>
        </div>
    </div>
</template>
