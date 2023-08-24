// Elementi HTML
const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const scoreElement = document.getElementById("score");
const timeLeftElement = document.getElementById("time-left");
const leaderboardList = document.getElementById("leaderboard-list");

// Lista di domande
const questions = [
    {
      text: "Quale pianeta è conosciuto come la 'Stella del Mattino' o la 'Stella della Sera'?",
      options: ["Marte", "Venere", "Giove", "Saturno"],
      correctOption: 1
    },
    {
      text: "Chi scrisse l'opera '1984'?",
      options: ["Ray Bradbury", "George Orwell", "F. Scott Fitzgerald", "Aldous Huxley"],
      correctOption: 1
    },
    {
      text: "Qual è l'organo più grande del corpo umano?",
      options: ["Il fegato", "La pelle", "Il cervello", "Il cuore"],
      correctOption: 1
    },
    {
      text: "Quale scienziato formulò la legge della gravità?",
      options: ["Nikola Tesla", "Isaac Newton", "Albert Einstein", "Galileo Galilei"],
      correctOption: 1
    },
    {
      text: "Qual è la capitale dell'Italia?",
      options: ["Milano", "Firenze", "Napoli", "Roma"],
      correctOption: 3
    },
    {
      text: "Qual è l'elemento chimico con simbolo 'Fe'?",
      options: ["Fosforo", "Fluoro", "Ferro", "Francio"],
      correctOption: 2
    },
    {
      text: "In quale continente si trova il deserto del Sahara?",
      options: ["Asia", "Europa", "Africa", "America"],
      correctOption: 2
    },
    {
      text: "Qual è l'unità di misura della corrente elettrica?",
      options: ["Volt (V)", "Ohm (Ω)", "Watt (W)", "Ampere (A)"],
      correctOption: 3
    },
    {
      text: "Quale artista è famoso per dipinti come 'La notte stellata' e 'Il campo di grano con i corvi'?",
      options: ["Michelangelo", "Pablo Picasso", "Leonardo da Vinci", "Vincent van Gogh"],
      correctOption: 3
    },
    {
      text: "Qual è il libro sacro dell'ebraismo?",
      options: ["Corano", "Tanakh", "Bibbia", "Vedas"],
      correctOption: 1
    },
    {
      text: "Quale famoso discorso inizia con le parole 'I have a dream'?",
      options: ["Il discorso di Abraham Lincoln", "Il discorso di Martin Luther King Jr.", "Il discorso di Winston Churchill", "Il discorso di John F. Kennedy"],
      correctOption: 1
    },
    {
      text: "Qual è la montagna più alta del mondo?",
      options: ["Monte Kilimanjaro", "Monte Aconcagua", "Monte Everest", "Monte McKinley (Denali)"],
      correctOption: 2
    },
    {
      text: "Quale fenomeno naturale è responsabile dell'arcobaleno?",
      options: ["L'assorbimento selettivo dei colori", "La rifrazione della luce solare nelle gocce d'acqua", "L'interferenza tra onde luminose", "La fluorescenza dell'aria"],
      correctOption: 1
    },
    {
      text: "Quale famoso compositore è noto per le sue 'Quattro stagioni'?",
      options: ["Wolfgang Amadeus Mozart", "Ludwig van Beethoven", "Antonio Vivaldi", "Johann Sebastian Bach"],
      correctOption: 2
    },
    {
      text: "Quale città è conosciuta come la 'Città eterna'?",
      options: ["Atene", "Gerusalemme", "Roma", "Parigi"],
      correctOption: 2
    },
    {
      text: "Qual è il fiume più lungo del mondo?",
      options: ["Il fiume Amazonas", "Il fiume Yangtze", "Il fiume Mississippi", "Il fiume Nilo"],
      correctOption: 3
    },
    {
      text: "Chi è stato il primo uomo a camminare sulla Luna?",
      options: ["Buzz Aldrin", "John Glenn", "Neil Armstrong", "Yuri Gagarin"],
      correctOption: 2
    },
    {
      text: "Quale processo chimico fornisce energia alle cellule dei viventi?",
      options: ["La sintesi proteica", "La fotosintesi", "La fermentazione", "La respirazione cellulare"],
      correctOption: 3
    },
    {
      text: "Qual è il pianeta più grande del sistema solare?",
      options: ["Saturno", "Nettuno", "Giove", "Urano"],
      correctOption: 2
    },
    {
      text: "Qual è il fiume più lungo del mondo?",
      options: ["Il fiume Amazonas", "Il fiume Yangtze", "Il fiume Mississippi", "Il fiume Nilo"],
      correctOption: 3
    }
  ];

// Variabili di stato
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 600;
let timerInterval;

// Avvia la modalità gioco per il singolo giocatore
function startSinglePlayer() {
    clearInterval(timerInterval);
    setupGame();
    startTimer(); // Avvia il timer all'inizio del gioco
}

// Inizializza il gioco
function setupGame() {
    currentQuestionIndex = 0;
    score = 0;
    showQuestion();
}

// Mostra la domanda corrente e le opzioni
function showQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.text;
    optionsElement.innerHTML = "";

    currentQuestion.options.forEach((option, index) => {
        const optionButton = document.createElement("button");
        optionButton.textContent = option;
        optionButton.addEventListener("click", () => checkAnswer(index));
        optionsElement.appendChild(optionButton);
    });
}

// Controlla la risposta data dall'utente
function checkAnswer(selectedIndex) {
    const currentQuestion = questions[currentQuestionIndex];
    if (selectedIndex === currentQuestion.correctOption) {
        score++;
    }
    
    currentQuestionIndex++;
    
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        endGame();
    }
}

// Avvia il timer
function startTimer() {
    timeLeft = 600;
    timeLeftElement.textContent = timeLeft;
    timerInterval = setInterval(updateTimer, 1000);
}

// Aggiorna il timer e controlla se è scaduto
function updateTimer() {
    timeLeft--;
    timeLeftElement.textContent = timeLeft;
    if (timeLeft === 0) {
        clearInterval(timerInterval);
        checkAnswer(-1);  // Risposta scaduta
    }
}

// Termina il gioco e mostra il punteggio finale
function endGame() {
    clearInterval(timerInterval);
    questionElement.textContent = "Game Over!";
    optionsElement.innerHTML = "";
    scoreElement.textContent = "Score: " + score;

    addToLeaderboard(score); // Aggiungi il punteggio alla classifica
    showLeaderboard(); // Mostra la classifica alla fine del gioco
}

// Aggiungi il punteggio alla classifica
function addToLeaderboard(score) {
    const listItem = document.createElement("li");
    listItem.textContent = `Score: ${score}`;
    leaderboardList.appendChild(listItem);
}

function showLeaderboard() {
    // Calcola il punteggio totale
    var totalScore = calculateTotalScore(); // Da implementare

    // Aggiungi il punteggio alla classifica
    var leaderboardList = document.getElementById("leaderboard-list");
    var leaderboardEntry = document.createElement("li");
    leaderboardEntry.textContent = "Total Score: " + totalScore;
    leaderboardList.appendChild(leaderboardEntry);

    // ... (aggiungi altre voci alla classifica come necessario) ...
}

// Avvia il gioco al caricamento della pagina
startSinglePlayer();
