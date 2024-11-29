<template>
    <div class="tic-tac-toe">
        <h2 class="text-xl font-bold mb-4">Tic Tac Toe</h2>
        <div class="grid grid-cols-3 gap-2">
            <div v-for="(cell, index) in board" :key="index"
                class="cell border p-4 text-4xl flex items-center justify-center cursor-pointer"
                @click="makeMove(index)">
                {{ cell }}
            </div>
        </div>
        <div class="mt-4">
            <button class="reset-button" @click="resetGame">Reset Game</button>
        </div>
        <div v-if="winner" class="mt-4 text-xl font-bold">
            <p class="winner-text">Winner: {{ winner }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const board = ref(Array(9).fill(null))
const currentPlayer = ref('X')
const winner = ref<string | null>(null)

const makeMove = (index: number) => {
    if (!board.value[index] && !winner.value) {
        board.value[index] = currentPlayer.value
        checkWinner()
        currentPlayer.value = currentPlayer.value === 'X' ? 'O' : 'X'
    }
}

const checkWinner = () => {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ]

    for (const combination of winningCombinations) {
        const [a, b, c] = combination
        if (board.value[a] && board.value[a] === board.value[b] && board.value[a] === board.value[c]) {
            winner.value = board.value[a]
            return
        }
    }
}

const resetGame = () => {
    board.value = Array(9).fill(null)
    winner.value = null
    currentPlayer.value = 'X'
}
</script>

<style scoped>
.tic-tac-toe {
    max-width: 300px;
    margin: auto;
    text-align: center;
}

.cell {
    height: 100px;
    width: 100px;
    background-color: #f0f0f0;
    border: 2px solid #ccc;
    border-radius: 8px;
    transition: background-color 0.3s, transform 0.2s;
    font-size: 2rem;
    font-weight: bold;
    color: #333;
}

.cell:hover {
    background-color: #e0e0e0;
    transform: scale(1.05);
}

.reset-button {
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.reset-button:hover {
    background-color: #0056b3;
}

.winner-text {
    color: #28a745;
    /* Green color for winner text */
}
</style>