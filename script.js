const cells = document.querySelectorAll("[data-cell]");
const board = document.getElementById("board");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restart");
const resetScoreBtn = document.getElementById("reset-score");
const scoreX = document.getElementById("score-x");
const scoreO = document.getElementById("score-o");

let currentPlayer = "X";
let gameActive = true;
let gameState = ["", "", "", "", "", "", "", "", ""];
let scores = { X: 0, O: 0 };

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Columns
    [0, 4, 8],
    [2, 4, 6], // Diagonals
];

const winningMessages = {
    X: "Player X wins! 🎉",
    O: "Player O wins! 🎉",
    draw: "It's a draw! 🤝",
};

// Initialize the game
function initGame() {
    cells.forEach((cell, index) => {
        cell.addEventListener("click", () => handleCellClick(index), {
            once: true,
        });
    });

    restartBtn.addEventListener("click", restartGame);
    resetScoreBtn.addEventListener("click", resetScore);

    updateStatus();
    updateScoreDisplay();
}

function handleCellClick(index) {
    if (!gameActive || gameState[index] !== "") return;

    // Update game state
    gameState[index] = currentPlayer;
    cells[index].textContent = currentPlayer;
    cells[index].classList.add(currentPlayer);

    // Add click animation
    cells[index].style.transform = "scale(0.9)";
    setTimeout(() => {
        cells[index].style.transform = "";
    }, 150);

    // Check for win
    if (checkWin(currentPlayer)) {
        handleWin(currentPlayer);
        return;
    }

    // Check for draw
    if (isDraw()) {
        handleDraw();
        return;
    }

    // Switch player
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateStatus();
}

function checkWin(player) {
    return winningCombinations.some((combination) => {
        const isWinning = combination.every((index) => {
            return gameState[index] === player;
        });

        if (isWinning) {
            // Highlight winning cells
            combination.forEach((index) => {
                cells[index].classList.add("winning");
            });
        }

        return isWinning;
    });
}

function isDraw() {
    return gameState.every((cell) => cell !== "");
}

function handleWin(player) {
    gameActive = false;
    scores[player]++;
    updateScoreDisplay();

    statusText.textContent = winningMessages[player];
    statusText.style.color = "#48bb78";
    statusText.style.fontWeight = "700";

    // Add celebration animation
    statusText.style.animation = "winner 0.6s ease-in-out";

    // Disable all cells
    cells.forEach((cell) => {
        cell.style.pointerEvents = "none";
    });
}

function handleDraw() {
    gameActive = false;
    statusText.textContent = winningMessages.draw;
    statusText.style.color = "#9f7aea";
    statusText.style.fontWeight = "700";

    // Disable all cells
    cells.forEach((cell) => {
        cell.style.pointerEvents = "none";
    });
}

function restartGame() {
    // Reset game state
    gameState = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;

    // Clear board
    cells.forEach((cell) => {
        cell.textContent = "";
        cell.classList.remove("X", "O", "winning");
        cell.style.pointerEvents = "auto";
        cell.style.animation = "";
    });

    // Reset status
    statusText.textContent = `Player ${currentPlayer}'s turn`;
    statusText.style.color = "#2d3748";
    statusText.style.fontWeight = "600";
    statusText.style.animation = "";

    // Re-add event listeners
    cells.forEach((cell, index) => {
        cell.removeEventListener("click", () => handleCellClick(index));
        cell.addEventListener("click", () => handleCellClick(index), {
            once: true,
        });
    });

    updateStatus();
}

function resetScore() {
    scores = { X: 0, O: 0 };
    updateScoreDisplay();

    // Add reset animation
    scoreX.style.animation = "winner 0.6s ease-in-out";
    scoreO.style.animation = "winner 0.6s ease-in-out";

    setTimeout(() => {
        scoreX.style.animation = "";
        scoreO.style.animation = "";
    }, 600);
}

function updateStatus() {
    if (gameActive) {
        statusText.textContent = `Player ${currentPlayer}'s turn`;
        statusText.style.color = currentPlayer === "X" ? "#e74c3c" : "#2980b9";
    }
}

function updateScoreDisplay() {
    scoreX.textContent = scores.X;
    scoreO.textContent = scores.O;
}

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
    switch (e.code) {
        case "KeyR":
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                restartGame();
            }
            break;
        case "KeyS":
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                resetScore();
            }
            break;
    }
});

// Add visual feedback for button clicks
document.querySelectorAll(".btn").forEach((button) => {
    button.addEventListener("click", function() {
        this.style.transform = "scale(0.95)";
        setTimeout(() => {
            this.style.transform = "";
        }, 150);
    });
});

// Initialize the game when the page loads
document.addEventListener("DOMContentLoaded", initGame);