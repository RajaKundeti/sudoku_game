let timer = 0;
let mistakes = 0;
const maxMistakes = 3;
const timerElement = document.getElementById("timer");

// Generate an empty Sudoku board
function generateEmptyBoard() {
    return Array.from({ length: 9 }, () => Array(9).fill(""));
}

// Function to check if a number can be placed at (row, col)
function isValid(board, row, col, num) {
    for (let i = 0; i < 9; i++) {
        if (board[row][i] == num || board[i][col] == num) return false; // Row & Column check
        const boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
        const boxCol = 3 * Math.floor(col / 3) + (i % 3);
        if (board[boxRow][boxCol] == num) return false; // 3x3 Box check
    }
    return true;
}

// Backtracking function to fill the board
function fillBoard(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === "") {
                const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5); // Shuffle numbers
                for (let num of numbers) {
                    if (isValid(board, row, col, num)) {
                        board[row][col] = num;
                        if (fillBoard(board)) return true;
                        board[row][col] = "";
                    }
                }
                return false; // Backtrack if no number fits
            }
        }
    }
    return true;
}

// Remove numbers to create a puzzle
function removeNumbers(board, difficulty) {
    let attempts = difficulty === "easy" ? 40 : difficulty === "medium" ? 50 : 60; // More removal for harder levels
    while (attempts > 0) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        if (board[row][col] !== "") {
            board[row][col] = "";
            attempts--;
        }
    }
}

// Generate a new Sudoku puzzle
function generateSudoku(difficulty = "medium") {
    const board = generateEmptyBoard();
    fillBoard(board);
    removeNumbers(board, difficulty);
    return board;
}

// Create Sudoku board in the UI
function createSudokuBoard() {
    const board = document.getElementById("sudoku-board");
    board.innerHTML = "";
    const puzzle = generateSudoku(); // Generate new puzzle

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const cell = document.createElement("input");
            cell.type = "text";
            cell.maxLength = 1;
            cell.classList.add("cell");

            if (puzzle[r][c] !== "") {
                cell.value = puzzle[r][c];
                cell.setAttribute("data-fixed", true);
                cell.readOnly = true;
            } else {
                cell.addEventListener("input", (e) => validateInput(e, puzzle, r, c));
            }

            board.appendChild(cell);
        }
    }
}

// Validate user input
function validateInput(e, puzzle, row, col) {
    const input = e.target.value;
    if (!/^[1-9]$/.test(input)) {
        e.target.value = "";
        return;
    }

    // Check against the correct puzzle solution
    if (input != puzzle[row][col]) {
        mistakes++;
        if (mistakes >= maxMistakes) {
            alert("Maximum mistakes reached! Try again.");
            window.location.href = "index.html";
        }
    }
}

// Timer
function startTimer() {
    setInterval(() => {
        timer++;
        timerElement.textContent = `Time: ${timer} sec`;
    }, 1000);
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    createSudokuBoard();
    startTimer();
});
