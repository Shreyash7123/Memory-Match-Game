let gameActive = false;
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let totalPairs = 8;
let timer = 0;
let interval = null;

const animals = ["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮"];

const matchesEl = document.getElementById("matches");
const movesEl = document.getElementById("moves");
const grid = document.getElementById("memoryGrid");
const feedback = document.getElementById("feedback");
const gameOver = document.getElementById("gameOver");
const timerEl = document.getElementById("timer");
const starsEl = document.getElementById("stars");
const finalMovesEl = document.getElementById("finalMoves");
const finalTimeEl = document.getElementById("finalTime");
const performanceEl = document.getElementById("performance");

function setDifficulty(level, btn) {
  if (gameActive) return;

  document.querySelectorAll(".difficulty-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");

  totalPairs = level === "easy" ? 8 : level === "medium" ? 10 : 12;
  matchesEl.textContent = `0 / ${totalPairs}`;
}

function startGame() {
  if (gameActive) return;

  gameActive = true;
  matchedPairs = 0;
  moves = 0;
  flippedCards = [];
  timer = 0;

  matchesEl.textContent = `0 / ${totalPairs}`;
  movesEl.textContent = "0";
  feedback.textContent = "";
  gameOver.classList.remove("show");

  buildGrid();
  startTimer();
}

function startTimer() {
  interval = setInterval(() => {
    timer++;
    timerEl.textContent = `Time: ${timer}s`;
  }, 1000);
}

function buildGrid() {
  const selected = animals.slice(0, totalPairs);
  const cards = [...selected, ...selected].sort(() => Math.random() - 0.5);
  grid.innerHTML = "";

  cards.forEach(animal => {
    const card = document.createElement("div");
    card.className = "memory-card";
    card.dataset.animal = animal;
    card.textContent = "❓";

    card.onclick = () => flip(card);
    grid.appendChild(card);
  });
}

function flip(card) {
  if (!gameActive || flippedCards.length === 2) return;
  if (card.classList.contains("flipped")) return;

  card.classList.add("flipped");
  card.textContent = card.dataset.animal;
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    moves++;
    movesEl.textContent = moves;
    setTimeout(checkMatch, 800);
  }
}

function checkMatch() {
  const [a, b] = flippedCards;

  if (a.dataset.animal === b.dataset.animal) {
    a.classList.add("matched");
    b.classList.add("matched");
    matchedPairs++;
    matchesEl.textContent = `${matchedPairs} / ${totalPairs}`;
    feedback.textContent = "✅ Match!";
  } else {
    a.textContent = "❓";
    b.textContent = "❓";
    a.classList.remove("flipped");
    b.classList.remove("flipped");
    feedback.textContent = "❌ Try again!";
  }

  flippedCards = [];

  if (matchedPairs === totalPairs) endGame();
}

function endGame() {
  gameActive = false;
  clearInterval(interval);

  starsEl.textContent = matchedPairs === totalPairs ? "⭐⭐⭐" : "⭐⭐";
  finalMovesEl.textContent = `Moves: ${moves}`;
  finalTimeEl.textContent = `Time: ${timer}s`;
  performanceEl.textContent = "Great Memory!";
  gameOver.classList.add("show");
}

function resetGame() {
  gameActive = false;
  clearInterval(interval);
  grid.innerHTML = "";
  feedback.textContent = "";
  gameOver.classList.remove("show");
  timerEl.textContent = "Time: 0s";
  movesEl.textContent = "0";
  matchesEl.textContent = `0 / ${totalPairs}`;
}
