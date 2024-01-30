let currentPlayer;
let gameBoard;
let playerXPoints;
let playerOPoints;
const resultsElement = document.getElementById("results");

function updateResults() {
    const resultsText = `Wyniki: Gracz X - ${playerXPoints} punktów, Gracz O - ${playerOPoints} punktów`;
    if (resultsElement) {
        resultsElement.innerText = resultsText;
    }
}

function resetPoints() {
    playerXPoints = 0;
    playerOPoints = 0;
    updateResults();
}

document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("game-board");
    const resetButton = document.getElementById("reset-button");
    const resetPointsButton = document.getElementById("reset-points-button");

    currentPlayer = "X";
    gameBoard = Array(9).fill("");
    playerXPoints = 0;
    playerOPoints = 0;

    function initializeBoard() {
        board.innerHTML = "";
        gameBoard = Array(9).fill("");
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        updateCurrentPlayerInfo();
        updateResults();

        for (let index = 0; index < 9; index++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.addEventListener("click", handleCellClick);
            cell.innerText = "";
            cell.dataset.index = index;
            board.appendChild(cell);
        }
    }

    function handleCellClick(event) {
        if (checkWin() || checkDraw()) {
            return;
        }

        const index = event.target.dataset.index;

        if (gameBoard[index] === "") {
            gameBoard[index] = currentPlayer;
            event.target.innerText = currentPlayer;

            if (checkWin() || checkDraw()) {
                setTimeout(() => {
                    handleGameEnd();
                }, 1000);
            } else {
                currentPlayer = currentPlayer === "X" ? "O" : "X";
                updateCurrentPlayerInfo();
            }
        }
    }

    function handleGameEnd() {
        if (checkWin()) {
            currentPlayer === "X" ? playerXPoints++ : playerOPoints++;
            highlightWinner();
            updateResults();
    
            const winner = currentPlayer === "X" ? "Gracz X" : "Gracz O";
            showModal(`${winner} wygrywa!`);
        } else if (checkDraw()) {
            showModal("Gra zakończona remisem!");
        }
    
        initializeBoard();
    }

    function highlightWinner() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Wiersze
            [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Kolumny
            [0, 4, 8], [2, 4, 6]               // Przekątne
        ];

        winPatterns.forEach(pattern => {
            const [a, b, c] = pattern;
            if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
                highlightCells([a, b, c]);
            }
        });
    }

    function highlightCells(cellsToHighlight) {
        cellsToHighlight.forEach(index => {
            const cell = document.querySelector(`[data-index="${index}"]`);
            if (cell) {
                // Zmień kolor na zielony po zakończeniu gry
                cell.style.backgroundColor = "limegreen";
            }
        });
    }

    function checkWin() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Wiersze
            [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Kolumny
            [0, 4, 8], [2, 4, 6]               // Przekątne
        ];

        return winPatterns.some(pattern => {
            const [a, b, c] = pattern;
            return gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c];
        });
    }

    function checkDraw() {
        return gameBoard.every(cell => cell !== "");
    }

    function updateCurrentPlayerInfo() {
        const currentPlayerElement = document.getElementById("current-player");
        if (currentPlayerElement) {
            currentPlayerElement.innerText = `Aktualny gracz: ${currentPlayer}`;
        }
    }

    function showModal(message) {
        const modal = document.createElement("div");
        modal.classList.add("modal");
        modal.innerHTML = `<div class="modal-content">${message}</div>`;
        document.body.appendChild(modal);
    
        setTimeout(() => {
            modal.remove();
        }, 3000); // Po 3 sekundach usuń modal
    }

    initializeBoard();

    if (resetButton) {
        resetButton.addEventListener("click", initializeBoard);
    }

    if (resetPointsButton) {
        resetPointsButton.addEventListener("click", resetPoints);
    }
});
