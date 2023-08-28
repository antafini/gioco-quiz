// Elementi HTML
const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const scoreElement = document.getElementById("score");
const timeLeftElement = document.getElementById("time-left");
const leaderboardList = document.getElementById("leaderboard-list");

// Variabili di stato
let currentQuestionIndex = 0;
let currentLevel = 0;
let score = 0;
let timeLeft = 600;
let timerInterval; 
let optionsClickable = true;

// Funzione per avviare il gioco in modalità giocatore singolo
async function startSinglePlayer() {
  clearInterval(timerInterval);
  currentQuestionIndex = 0;
  currentLevel = 0;
  await loadQuestions(); // Carica le domande da JSON

  const loadingMessage = document.getElementById("new-game-message");
  loadingMessage.style.display = "block";
  optionsClickable = false;

  startTimer();

  setTimeout(() => {
    loadingMessage.style.display = "none";
    optionsClickable = true;
    showQuestion();
  }, 2000);
}

async function loadQuestions() {
  try {
    const response = await fetch("questions.json");
    const data = await response.json();
    levels = data;
  } catch (error) {
    console.error("Errore durante il caricamento delle domande:", error);
  }
}

// Funzione per mostrare la transizione tra i livelli
function showLevelTransitionMessage() {
  optionsClickable = false;
  const levelTransitionMessage = document.getElementById("level-transition-message");
  levelTransitionMessage.style.display = "block";

  setTimeout(() => {
    levelTransitionMessage.style.display = "none";
    optionsClickable = true;
    showQuestion();
  }, 2000);
}

// Funzione per inizializzare il gioco
function setupGame() {
  currentLevel = 0;
  score = 0;
  showQuestion();
}

// Funzione per mostrare la domanda corrente e le opzioni
function showQuestion() {
  const currentQuestion = levels[currentLevel][currentQuestionIndex];
  questionElement.textContent = currentQuestion.text;
  optionsElement.innerHTML = "";

  currentQuestion.options.forEach((option, index) => {
    const optionButton = document.createElement("button");
    optionButton.textContent = option;
    optionButton.addEventListener("click", () => {
      if (optionsClickable) { // Verifica se le opzioni sono cliccabili
        checkAnswer(index);
      }
    });
    optionsElement.appendChild(optionButton);
  });

  const levelIndicator = document.createElement("p");
  levelIndicator.textContent = `Livello ${currentLevel + 1}`;
  optionsElement.appendChild(levelIndicator);
}

// Funzione per controllare la risposta data dall'utente
function checkAnswer(selectedIndex) {
  const currentQuestion = levels[currentLevel][currentQuestionIndex];
  if (selectedIndex === currentQuestion.correctOption) {
    score++;
  }
  currentQuestionIndex++;

  if (currentQuestionIndex < levels[currentLevel].length) {
    showQuestion();
  } else {
    if (currentLevel < levels.length - 1) {
      currentLevel++;
      currentQuestionIndex = 0;
      showLevelTransitionMessage();
    } else {
      endGame();
    }
  }
}

// Funzione per avviare il timer
function startTimer() {
  timeLeft = 600;
  timeLeftElement.textContent = timeLeft;
  timerInterval = setInterval(updateTimer, 1000);
}

// Funzione per aggiornare il timer e controllare se è scaduto
function updateTimer() {
  timeLeft--;
  timeLeftElement.textContent = timeLeft;
  if (timeLeft === 0) {
    clearInterval(timerInterval);
    checkAnswer(-1);  // Risposta scaduta
  }
}

// Funzione per terminare il gioco e mostrare il punteggio finale
function endGame() {
  clearInterval(timerInterval);
  questionElement.textContent = "Game Over!";
  optionsElement.innerHTML = "";
  scoreElement.textContent = "Score: " + score;

  addToLeaderboard(score);
  
}

// Funzione per aggiungere il punteggio alla classifica
function addToLeaderboard(score) {
  const listItem = document.createElement("li");
  listItem.textContent = `Score: ${score}`;
  leaderboardList.appendChild(listItem);
}
startSinglePlayer();
