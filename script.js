const board = document.getElementById("board");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restart");
const modeButtons = document.querySelectorAll(".mode-switch button");

const clickSound = document.getElementById("click-sound");
const winSound = document.getElementById("win-sound");
const drawSound = document.getElementById("draw-sound");

let cells = Array.from(document.querySelectorAll(".cell"));
let currentPlayer = "X";
let gameActive = true;
let vsAI = false;
let aiThinking = false;

const winningCombos = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

modeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    modeButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    vsAI = btn.id === "ai";
    restartGame();
  });
});

cells.forEach(cell => {
  cell.addEventListener("click", handleClick);
});

restartBtn.addEventListener("click", restartGame);

function handleClick(e) {
  if (!gameActive || aiThinking) return;

  const cell = e.target;
  const index = cell.dataset.index;

  if (cell.textContent !== "") return;

  makeMove(cell, currentPlayer);

  if (vsAI && gameActive) {
    aiThinking = true;
    setTimeout(() => {
      aiMove();
      aiThinking = false;
    }, 500);
  }
}

function makeMove(cell, player) {
  cell.textContent = player;
  clickSound.play();
  checkResult();
}

function aiMove() {
  const emptyCells = cells.filter(cell => cell.textContent === "");
  if (emptyCells.length === 0) return;

  const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  makeMove(randomCell, "O");
}

function checkResult() {
  const values = cells.map(cell => cell.textContent);
  let winner = null;

  winningCombos.forEach(combo => {
    const [a, b, c] = combo;
    if (values[a] && values[a] === values[b] && values[a] === values[c]) {
      winner = values[a];
    }
  });

  if (winner) {
    gameActive = false;
    statusText.textContent = `${winner} wins! 🎉`;
    winSound.play();
    return;
  }

  if (values.every(v => v !== "")) {
    gameActive = false;
    statusText.textContent = "It's a draw!";
    drawSound.play();
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `${currentPlayer}'s turn`;
}

function restartGame() {
  currentPlayer = "X";
  gameActive = true;
  aiThinking = false;
  cells.forEach(cell => (cell.textContent = ""));
  statusText.textContent = "X's turn";
}
