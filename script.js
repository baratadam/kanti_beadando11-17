const cells = document.querySelectorAll('[data-cell]');
const board = document.querySelector('.board');
const messageElement = document.getElementById('message');
const restartButton = document.getElementById('restartButton');
const twoPlayerButton = document.getElementById('twoPlayerButton');
const computerButton = document.getElementById('computerButton');
let isXTurn = true;
let gameActive = true;
let vsComputer = false;

const winCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

twoPlayerButton.addEventListener('click', () => {
    vsComputer = false;
    startGame();
});
computerButton.addEventListener('click', () => {
    vsComputer = true;
    startGame();
});
restartButton.addEventListener('click', startGame);

function startGame() {
    isXTurn = true;
    gameActive = true;
    messageElement.textContent = '';
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
        cell.removeEventListener('click', handleCellClick);
        cell.addEventListener('click', handleCellClick, { once: true });
    });
}

function handleCellClick(event) {
    if (!gameActive) return;

    const cell = event.target;
    const currentClass = isXTurn ? 'x' : 'o';
    placeMark(cell, currentClass);

    if (checkWin(currentClass)) {
        endGame(false);
        messageElement.textContent = `${currentClass.toUpperCase()} játékos nyert.`;
    } else if (isDraw()) {
        endGame(true);
        messageElement.textContent = 'A játék döntetlen.';
    } else {
        isXTurn = !isXTurn;
        if (vsComputer && !isXTurn) {
            setTimeout(computerMove, 500);
        }
    }
}

function placeMark(cell, currentClass) {
    cell.textContent = currentClass.toUpperCase();
    cell.classList.add(currentClass);
}

function checkWin(currentClass) {
    return winCombinations.some(combination => {
        return combination.every(index => {
            return cells[index].classList.contains(currentClass);
        });
    });
}

function isDraw() {
    return [...cells].every(cell => {
        return cell.classList.contains('x') || cell.classList.contains('o');
    });
}

function endGame(draw) {
    gameActive = false;
    cells.forEach(cell => {
        cell.removeEventListener('click', handleCellClick);
    });
}

function computerMove() {
    const availableCells = [...cells].filter(cell => !cell.classList.contains('x') && !cell.classList.contains('o'));
    let bestMove = findBestMove('o');

    if (bestMove === null) {
        bestMove = findBestMove('x');
    }

    if (bestMove === null) {
        const randomIndex = Math.floor(Math.random() * availableCells.length);
        bestMove = availableCells[randomIndex];
    }

    placeMark(bestMove, 'o');

    if (checkWin('o')) {
        endGame(false);
        messageElement.textContent = 'O játékos (Számítógép) nyert.';
    } else if (isDraw()) {
        endGame(true);
        messageElement.textContent = 'A játék döntetlen.';
    } else {
        isXTurn = !isXTurn;
    }
}

function findBestMove(currentClass) {
    for (const combination of winCombinations) {
        const [a, b, c] = combination;
        const cellsArray = Array.from(cells);

        if (cellsArray[a].classList.contains(currentClass) && cellsArray[b].classList.contains(currentClass) && !cellsArray[c].classList.contains('x') && !cellsArray[c].classList.contains('o')) {
            return cellsArray[c];
        }
        if (cellsArray[a].classList.contains(currentClass) && !cellsArray[b].classList.contains('x') && !cellsArray[b].classList.contains('o') && cellsArray[c].classList.contains(currentClass)) {
            return cellsArray[b];
        }
        if (!cellsArray[a].classList.contains('x') && !cellsArray[a].classList.contains('o') && cellsArray[b].classList.contains(currentClass) && cellsArray[c].classList.contains(currentClass)) {
            return cellsArray[a];
        }
    }
    return null;
}

startGame();
