<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount, computed, nextTick } from 'vue';
import { marked } from 'marked';
import { AnOutlinedUnorderedList, BsCodeSquare, BsEyeFill, BsQuote, CoBold, CoItalic, CoLinkAlt, CoStrikethrough, TaHelpHexagonFilled } from '@kalimahapps/vue-icons';
import axios from 'axios';

const markdown = ref<string>(``);
const preview = ref<string | Promise<string>>('');
const isHovered = ref<boolean>(false);
const showGuide = ref<boolean>(false);
const modalRef = ref<HTMLElement | null>(null);
const guideModalRef = ref<HTMLElement | null>(null);
const textareaRef = ref<HTMLTextAreaElement | null>(null);

// Markdown guide content
const markdownGuide = `
## Getting Started with Markdown
Welcome to the Markdown tutorial! This guide provides an overview of common Markdown syntax you can use to format your text.
## Headings
Use \`#\` for different levels of headings:
\`\`\`markdown
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
\`\`\`
## Blockquote
To create a blockquote, use the \`>\` symbol:
\`\`\`
> This is a blockquote
\`\`\`
## Lists
**Unordered Lists:** Use \`-\`, \`*\`, or \`+\` to create unordered lists:
\`\`\`
- Item 1
- Item 2
- Item 3
\`\`\`
**Ordered Lists:** Use numbers followed by a period to create ordered lists:
\`\`\`
1. First item
2. Second item
3. Third item
\`\`\`
## Horizontal Rule
###### To create a horizontal rule, use three dashes (\`---\`), asterisks (\`***\`), or underscores (\`___\`):
---
## Links
To add a hyperlink, use the following format:
\`\`\`
[Link text](URL)
\`\`\`
## Images
To insert an image, use this format:
\`\`\`
![Alt text](Image URL)
\`\`\`
## Code
**Inline Code:** Use backticks for inline code, like \`code\`.
**Code Block:** Use triple backticks for code blocks:
\`\`\`
\`\`\`
## Bold and Italics
**Bold:** \`**bold text**\` or \`__bold text__\`
**Italics:** \`*italic text*\` or \`_italic text_\`
## Strikethrough
Use \`~~\` to strikethrough text:
\`\`\`
~~strikethrough~~
\`\`\`
## Tables
Create tables with this format:
\`\`\`
| Header 1 | Header 2 |
|----------|----------|
| Row 1    | Data 1   |
| Row 2    | Data 2   |
\`\`\`
## Task Lists
\`\`\`
- [ ] Task 1
- [x] Task 2 (checked)
\`\`\`
## Example Markdown
Here's an example Markdown you can type:
\`\`\`
# Hello World
Write your markdown here...
## This is a heading
> This is a blockquote
- List item 1
- List item 2
\`\`\`
## Output
---
# Hello World
Write your markdown here...
## This is a heading
> This is a blockquote
- List item 1
- List item 2
---
*End*
`;// markdown guide content truncated for brevity/ (truncated for brevity)

const emit = defineEmits(['update:modelValue']);

// Computed property for parsed guide content
const guideContent = computed(() => marked(markdownGuide));

// Update preview whenever markdown changes
const updatePreview = () => {
    preview.value = marked(markdown.value);
    emit('update:modelValue', markdown.value);
};

// Function to upload the image to a server
const uploadImage = async (imageFile: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', imageFile);
    try {
        // Replace with your image upload endpoint
        const response = await axios.post('https://your-server.com/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        // Assume the server returns the URL of the uploaded image
        return response.data.imageUrl; // Adjust based on your server response
    } catch (error) {
        console.error('Image upload failed:', error);
        throw new Error('Image upload failed');
    }
};

// Initialize preview and set up paste event listener
onMounted(() => {
    updatePreview();
    document.addEventListener('mousedown', handleClickOutside);
    textareaRef.value?.addEventListener('paste', handlePaste);
});

// Clean up event listeners
onBeforeUnmount(() => {
    document.removeEventListener('mousedown', handleClickOutside);
    textareaRef.value?.removeEventListener('paste', handlePaste);
});

// Handle mouse enter for the button
const handleMouseEnter = () => {
    if (markdown.value) {
        isHovered.value = true;
    }
};

// Handle mouse leave for the button
const handleMouseLeave = () => {
    isHovered.value = false;
};

// Handle click outside of modals
const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.value && !modalRef.value.contains(event.target as Node)) {
        handleMouseLeave();
    }
    if (guideModalRef.value && !guideModalRef.value.contains(event.target as Node)) {
        showGuide.value = false;
    }
};

// Function to handle pasted images
const handlePaste = async (event: ClipboardEvent) => {
    if (!event.clipboardData) return;
    const items = event.clipboardData.items;
    for (const item of items) {
        if (item.type.startsWith("image/")) {
            const imageFile = item.getAsFile();
            if (imageFile) {
                try {
                    const imageUrl = await uploadImage(imageFile);
                    // Insert Markdown image syntax at the cursor position
                    insertMarkdown(`![Image](${imageUrl})`, '');
                } catch (error) {
                    console.error('Failed to paste image:', error);
                }
            }
            break; // Only handle the first image in the paste event
        }
    }
};

// Insert Markdown text at cursor position
const insertMarkdown = (startText: string, endText: string) => {
    const textarea = textareaRef.value;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = textarea.value;

    const newText = currentText.slice(0, start) + startText + endText + currentText.slice(end);
    markdown.value = newText;

    nextTick(() => {
        textarea.setSelectionRange(start + startText.length, start + startText.length);
        textarea.focus();
    });

    updatePreview();
};

// Icons click handlers
const addBold = () => insertMarkdown('**', '**');
const addItalic = () => insertMarkdown('*', '*');
const addStrikethrough = () => insertMarkdown('~~', '~~');
const addBlockquote = () => insertMarkdown('> ', '');
const addLink = () => insertMarkdown('[Link Text](', ')');
const addUnorderedList = () => insertMarkdown('- ', '');
const addCodeBlock = () => insertMarkdown('\n``` \n', '\n```\n');

</script>

<template>
    <div class="flex flex-col gap-2 px-4">
        <div class="relative w-full space-y-1">
            <div class="flex gap-2 items-center justify-between">
                <BsEyeFill class="size-4 hover:size-5 duration-200 cursor-pointer" @click="handleMouseEnter" />
                <div class="flex items-center gap-2">
                    <CoBold @click="addBold" class="size-4 hover:size-5 duration-100 cursor-pointer" />
                    <CoItalic @click="addItalic" class="size-4 hover:size-5 duration-100 cursor-pointer" />
                    <CoStrikethrough @click="addStrikethrough" class="size-4 hover:size-5 duration-100 cursor-pointer" />
                    <CoLinkAlt @click="addLink" class="size-4 hover:size-5 duration-100 cursor-pointer" />
                    <BsQuote @click="addBlockquote" class="size-4 hover:size-5 duration-100 cursor-pointer" />
                    <AnOutlinedUnorderedList @click="addUnorderedList" class="size-4 hover:size-5 duration-100 cursor-pointer" />
                    <BsCodeSquare @click="addCodeBlock" class="size-4 hover:size-5 duration-100 cursor-pointer" />
                </div>
                <TaHelpHexagonFilled @click="showGuide = true" class="size-5 text-blue-400 hover:text-blue-600 cursor-pointer transition-transform transform-gpu hover:scale-105 skew-x-6 hover:skew-x-0 mr-1" />
            </div>
            <textarea ref="textareaRef" v-model="markdown" @input="updatePreview" class="w-full h-60 p-4 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 resize-none text-sm" placeholder="Add ticket description..."></textarea>
        </div>

        <div class="relative self-end">
            <div v-if="isHovered" class="fixed inset-0 flex items-center justify-center z-20 bg-black/30" @mouseenter="isHovered = true" @mouseleave="handleMouseLeave">
                <div ref="modalRef" class="bg-white border border-gray-300 rounded-lg shadow-xl w-[40vw] h-[80vh] overflow-y-auto relative">
                    <button @click="isHovered = false" class="absolute top-4 right-4 text-gray-600 hover:text-gray-900">&times;</button>
                    <h2 class="text-lg font-bold p-4 border-b border-gray-200 text-gray-900 sticky top-0 bg-white">Preview</h2>
                    <div v-html="preview" class="p-4 prose prose-lg text-gray-800 overflow-y-auto"></div>
                </div>
            </div>
        </div>

        <div v-if="showGuide" class="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
            <div ref="guideModalRef" class="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto p-6 relative">
                <button @click="showGuide = false" class="absolute top-4 right-4 text-gray-600 hover:text-gray-900">&times;</button>
                <div v-html="guideContent" class="prose prose-lg max-w-none"></div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.prose {
    max-width: none;
}
.markdown-editor {
    max-width: 800px;
    margin: auto;
}
</style>
