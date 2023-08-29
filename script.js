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
let levels = [];

// Funzione per avviare il gioco in modalità giocatore singolo
function startSinglePlayer(selectedStartingLevel) {
  clearInterval(timerInterval);

  currentQuestionIndex = 0;
  currentLevel = selectedStartingLevel;
  loadQuestions(); // Carica le domande da JSON senza 'await'

  const loadingMessage = document.getElementById("new-game-message");
  loadingMessage.style.display = "block";
  optionsClickable = false;

  startTimer();

  setTimeout(() => {
    loadingMessage.style.display = "none";
    optionsClickable = true;
    setupGame(); // Inizializza il gioco al livello corrente
  }, 2000);
}

function startTimer() {
  timeLeft = 600;
  timeLeftElement.textContent = timeLeft;
  timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
  timeLeft--;
  timeLeftElement.textContent = timeLeft;
  if (timeLeft === 0) {
    clearInterval(timerInterval);
    checkAnswer(-1);  // Risposta scaduta
  }
}

function changeLevel() {
  if (currentLevel < levels.length - 1) {
    currentLevel++;
    currentQuestionIndex = 0;
    showLevelTransitionMessage();

    setTimeout(() => {
      const levelTransitionMessage = document.getElementById("level-transition-message");
      levelTransitionMessage.style.display = "none";
      optionsClickable = true;
      setupGame(); // Inizializza il gioco al nuovo livello
    });
  } else {
    endGame();
  }
}

async function loadQuestions() {
  try {
    const response = await fetch("questions.json");
    const data = await response.json();
    levels = data;
    setupGame(); // Chiamata qui per inizializzare il gioco dopo aver caricato le domande
  } catch (error) {
    console.error("Errore durante il caricamento delle domande:", error);
  }
}

function setupGame() {
  score = 0;
  showQuestion();
}

function showLevelTransitionMessage() {
  optionsClickable = false;
  const levelTransitionMessage = document.getElementById("level-transition-message");
  levelTransitionMessage.style.display = "block";

  document.getElementById("change-level-button").style.display = "hidden";
  document.getElementById("end-game-button").style.display = "hidden";
}

function showQuestion() {
  const currentLevelData = levels[currentLevel];

  if (currentQuestionIndex < currentLevelData.length) {
    const currentQuestion = currentLevelData[currentQuestionIndex];
    questionElement.textContent = currentQuestion.text;
    optionsElement.innerHTML = "";

    currentQuestion.options.forEach((option, index) => {
      const optionButton = document.createElement("button");
      optionButton.textContent = option;
      optionButton.addEventListener("click", () => {
        if (optionsClickable) {
          checkAnswer(index);
        }
      });
      optionButton.classList.remove("correct");
      optionButton.classList.remove("incorrect");

      optionsElement.appendChild(optionButton);
    });


    const questionNumberIndicator = document.createElement("p");
    questionNumberIndicator.textContent = `Domanda ${currentQuestionIndex + 1} di ${levels[currentLevel].length}`;
    optionsElement.appendChild(questionNumberIndicator);

    const levelIndicator = document.createElement("p");
    levelIndicator.textContent = `Livello ${currentLevel + 1}`;
    optionsElement.appendChild(levelIndicator);

    if (currentLevel < levels.length - 1) {
      document.getElementById("change-level-button").style.display = "block";
      document.getElementById("end-game-button").style.display = "block";
    } else {
      document.getElementById("change-level-button").style.display = "none";
      document.getElementById("end-game-button").style.display = "block";
    }
  }
}

function checkAnswer(selectedIndex) {
  const currentLevelData = levels[currentLevel];

  if (currentQuestionIndex < currentLevelData.length) {
    const currentQuestion = currentLevelData[currentQuestionIndex];
    const correctOptionIndex = currentQuestion.correctOption;

    if (selectedIndex === correctOptionIndex) {
      currentQuestion.correctAnswers++;
      optionsElement.children[selectedIndex].classList.add("correct");
    } else if (selectedIndex !== -1) {
      currentQuestion.incorrectAnswers++;
      optionsElement.children[selectedIndex].classList.add("incorrect");
      optionsElement.children[correctOptionIndex].classList.add("correct");
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < currentLevelData.length) {
      setTimeout(() => {
        showQuestion();
      }, 1000);
    } else {
      showLevelTransitionMessage();
    }
  }
}


function endGame() {
  clearInterval(timerInterval);
  questionElement.textContent = "Game Over!";
  optionsElement.innerHTML = "";

  levels.forEach((levelData, levelIndex) => {
    const correctAnswers = levelData.reduce((total, question) => total + question.correctAnswers, 0);
    const incorrectAnswers = levelData.reduce((total, question) => total + question.incorrectAnswers, 0);

    const resultMessage = document.createElement("p");
    resultMessage.textContent = `Livello ${levelIndex + 1}: Domande corrette: ${correctAnswers}, Domande errate: ${incorrectAnswers}`;
    resultMessage.classList.add("result-message");
    optionsElement.appendChild(resultMessage);
  });

  document.getElementById("change-level-button").style.display = "none";
  document.getElementById("end-game-button").style.display = "none";
  const levelTransitionMessage = document.getElementById("level-transition-message");
  levelTransitionMessage.style.display = "none";
}


startSinglePlayer(0);