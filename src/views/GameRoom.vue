<template>
    <div class="container mx-auto p-4 pt-6">
        <h1 class="text-3xl font-bold mb-4">Game Room</h1>
        <div class="flex space-x-4 mb-4">
            <div v-for="(folder, index) in folders" :key="index" class="cursor-pointer p-2 rounded"
                :class="{ 'bg-blue-500 text-white': activeFolder === index, 'bg-gray-200': activeFolder !== index }"
                @click="setActiveFolder(index)">
                {{ folder.name }}
            </div>
        </div>
        <div v-if="activeFolder !== null" class="bg-white rounded shadow-md p-4">
            <h2 class="text-lg font-bold mb-2">{{ folders[activeFolder].name }} Active</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="(menu, menuIndex) in folders[activeFolder].menus" :key="menuIndex"
                    class="bg-gray-100 rounded shadow-md p-4 cursor-pointer" @click="selectGame(menu)">
                    <h3 class="text-lg font-bold mb-2">{{ menu.name }}</h3>
                    <p class="text-gray-600">{{ menu.description }}</p>
                </div>
            </div>
        </div>
        <div v-if="selectedGame" class="mt-4">
            <h2 class="text-xl font-bold">Selected Game: {{ selectedGame.name }}</h2>
            <p>{{ selectedGame.description }}</p>
            <div v-if="selectedGame.name === 'Tic Tac Toe'">
                <TicTacToe />
            </div>
            <div v-if="selectedGame.name === 'Chess'">
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TicTacToe from './gameroom/TicTacToe.vue'

interface Menu {
    name: string
    description: string
}

interface Folder {
    name: string
    menus: Menu[]
}

const folders = ref<Folder[]>([
    {
        name: 'Board games',
        menus: [
            { name: 'Tic Tac Toe', description: 'Play the classic Tic Tac Toe game.' },
            { name: 'Chess', description: 'Challenge your strategy skills with Chess.' },
        ]
    },
    {
        name: 'Folder 2',
        menus: [
            { name: 'Tic Tac Toe', description: 'Play the classic Tic Tac Toe game.' },
            { name: 'Chess', description: 'Challenge your strategy skills with Chess.' },
        ]
    },
    {
        name: 'Folder 3',
        menus: [
            { name: 'Tic Tac Toe', description: 'Play the classic Tic Tac Toe game.' },
            { name: 'Chess', description: 'Challenge your strategy skills with Chess.' },
        ]
    },
])

const activeFolder = ref<number | null>(null)
const selectedGame = ref<Menu | null>(null)

const setActiveFolder = (index: number) => {
    activeFolder.value = index
    selectedGame.value = null // Reset selected game when changing folders
}

const selectGame = (menu: Menu) => {
    selectedGame.value = menu
}
</script>

<style scoped>
/* Add custom styles here */
</style>