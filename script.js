// Initialisation des données et localStorage
let appData = {
    timer: {
        inputValue: '',
        remainingTime: 0,
        isRunning: false
    },
    chrono: {
        time: 0,
        isRunning: false,
        laps: []
    },
    alarms: []
};

// Fonction pour sauvegarder les données dans localStorage
function saveToLocalStorage() {
    localStorage.setItem('oclockData', JSON.stringify(appData));
}

// Fonction pour charger les données depuis localStorage
function loadFromLocalStorage() {
    const savedData = localStorage.getItem('oclockData');
    if (savedData) {
        appData = JSON.parse(savedData);
    }
}

// Réinitialiser quand l'onglet est fermé
window.addEventListener('beforeunload', function() {
    localStorage.removeItem('oclockData');
});

// Charger les données au démarrage
loadFromLocalStorage();

// Watch
function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    document.getElementById("current-time").textContent = `${hours}:${minutes}:${seconds}`;
}
setInterval(updateClock, 1000);
updateClock(); // Immediate initialization

// Timer
let timerInterval;
const startTimerButton = document.getElementById("start-timer");
const resetTimerButton = document.getElementById("reset-timer");
const timerInput = document.getElementById("timer-input");
const timerDisplay = document.getElementById("timer-time");

// Initialiser le timer depuis localStorage
function initTimer() {
    timerInput.value = appData.timer.inputValue;
    if (appData.timer.remainingTime > 0) {
        timerDisplay.textContent = formatTime(appData.timer.remainingTime);
        if (appData.timer.isRunning) {
            startTimer(false);
        }
    } else {
        timerDisplay.textContent = "00:00";
    }
}

function startTimer(isNewTimer = true) {
    clearInterval(timerInterval);
    
    let remainingTime;
    if (isNewTimer) {
        const inputSeconds = parseInt(timerInput.value, 10);
        if (isNaN(inputSeconds) || inputSeconds <= 0) {
            alert("Veuillez entrer un temps valide !");
            return;
        }
        remainingTime = inputSeconds;
        appData.timer.inputValue = timerInput.value;
    } else {
        remainingTime = appData.timer.remainingTime;
    }
    
    appData.timer.remainingTime = remainingTime;
    appData.timer.isRunning = true;
    timerDisplay.textContent = formatTime(remainingTime);
    saveToLocalStorage();

    timerInterval = setInterval(() => {
        remainingTime--;
        appData.timer.remainingTime = remainingTime;
        saveToLocalStorage();
        
        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            alert("Temps écoulé !");
            appData.timer.isRunning = false;
            saveToLocalStorage();
        }
        timerDisplay.textContent = formatTime(remainingTime);
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    timerDisplay.textContent = "00:00";
    timerInput.value = "";
    appData.timer.remainingTime = 0;
    appData.timer.isRunning = false;
    appData.timer.inputValue = "";
    saveToLocalStorage();
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${secs}`;
}

startTimerButton.addEventListener("click", () => startTimer(true));
resetTimerButton.addEventListener("click", resetTimer);

// Stopwatch
let chronoInterval;
const chronoDisplay = document.getElementById("chrono-time");
const startChronoButton = document.getElementById("start-chrono");
const lapChronoButton = document.getElementById("lap-chrono");
const resetChronoButton = document.getElementById("reset-chrono");
const chronoLaps = document.getElementById("chrono-laps");

// Initialiser le chronomètre depuis localStorage
function initChrono() {
    updateChronoDisplay();
    if (appData.chrono.isRunning) {
        startChronometer();
    }
    renderLaps();
}

function updateChronoDisplay() {
    const hours = Math.floor(appData.chrono.time / 3600).toString().padStart(2, "0");
    const minutes = Math.floor((appData.chrono.time % 3600) / 60).toString().padStart(2, "0");
    const seconds = (appData.chrono.time % 60).toString().padStart(2, "0");
    chronoDisplay.textContent = `${hours}:${minutes}:${seconds}`;
}

function startChronometer() {
    chronoInterval = setInterval(() => {
        appData.chrono.time++;
        updateChronoDisplay();
        saveToLocalStorage();
    }, 1000);
}

function toggleChrono() {
    if (appData.chrono.isRunning) {
        clearInterval(chronoInterval);
    } else {
        startChronometer();
    }
    appData.chrono.isRunning = !appData.chrono.isRunning;
    saveToLocalStorage();
}

function renderLaps() {
    chronoLaps.innerHTML = "";
    appData.chrono.laps.forEach(lap => {
        const lapItem = document.createElement("li");
        lapItem.innerHTML = `<i class="fas fa-flag"></i> Tour : ${lap}`;
        chronoLaps.appendChild(lapItem);
    });
}

function addLap() {
    const lapTime = chronoDisplay.textContent;
    appData.chrono.laps.push(lapTime);
    saveToLocalStorage();
    renderLaps();
}

function resetChrono() {
    clearInterval(chronoInterval);
    appData.chrono.time = 0;
    appData.chrono.isRunning = false;
    appData.chrono.laps = [];
    saveToLocalStorage();
    updateChronoDisplay();
    chronoLaps.innerHTML = "";
}

startChronoButton.addEventListener("click", toggleChrono);
lapChronoButton.addEventListener("click", addLap);
resetChronoButton.addEventListener("click", resetChrono);

// Alarm clock
const addAlarmButton = document.getElementById("add-alarm");
const alarmTimeInput = document.getElementById("alarm-time");
const alarmMessageInput = document.getElementById("alarm-message");
const alarmList = document.getElementById("alarm-list");

// Initialiser les alarmes depuis localStorage
function initAlarms() {
    renderAlarms();
}

function checkAlarms() {
    const now = new Date();
    const currentHours = now.getHours().toString().padStart(2, "0");
    const currentMinutes = now.getMinutes().toString().padStart(2, "0");
    const currentTime = `${currentHours}:${currentMinutes}`;

    appData.alarms.forEach((alarm, index) => {
        if (currentTime === alarm.time && !alarm.triggered) {
            alert(alarm.message);
            alarm.triggered = true; // Marque l'alarme comme déclenchée
            saveToLocalStorage();
            renderAlarms();
        }
    });
}

function addAlarm() {
    const alarmTime = alarmTimeInput.value;
    const alarmMessage = alarmMessageInput.value;

    if (!alarmTime || !alarmMessage) {
        alert("Veuillez remplir tous les champs !");
        return;
    }

    const newAlarm = {
        time: alarmTime,
        message: alarmMessage,
        triggered: false,
        id: Date.now() // Identifiant unique pour chaque alarme
    };
    appData.alarms.push(newAlarm);
    saveToLocalStorage();
    renderAlarms();

    alarmTimeInput.value = "";
    alarmMessageInput.value = "";
}

function deleteAlarm(id) {
    appData.alarms = appData.alarms.filter(alarm => alarm.id !== id);
    saveToLocalStorage();
    renderAlarms();
}

function renderAlarms() {
    alarmList.innerHTML = "";
    appData.alarms.forEach((alarm) => {
        const alarmItem = document.createElement("li");
        const now = new Date();
        const alarmDate = new Date();
        const [hours, minutes] = alarm.time.split(":");
        alarmDate.setHours(hours);
        alarmDate.setMinutes(minutes);
        alarmDate.setSeconds(0);

        const timeDiff = alarmDate - now;
        let statusText;
        
        if (alarm.triggered) {
            statusText = "(Déclenchée)";
        } else if (timeDiff < 0) {
            // Si l'alarme est pour demain
            const tomorrowAlarm = new Date(alarmDate);
            tomorrowAlarm.setDate(tomorrowAlarm.getDate() + 1);
            const tomorrowDiff = tomorrowAlarm - now;
            const timeLeft = Math.ceil(tomorrowDiff / 1000 / 60); // Minutes restantes
            statusText = `(Demain, dans ${timeLeft} min)`;
        } else {
            const timeLeft = Math.ceil(timeDiff / 1000 / 60); // Minutes restantes
            statusText = `(Dans ${timeLeft} min)`;
        }
        
        alarmItem.innerHTML = `<i class="fas fa-bell"></i> ${alarm.time} - ${alarm.message} ${statusText} <button class="delete-alarm" data-id="${alarm.id}"><i class="fas fa-trash"></i></button>`;
        alarmList.appendChild(alarmItem);
    });
    
    // Ajouter les écouteurs d'événements pour les boutons de suppression
    document.querySelectorAll('.delete-alarm').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.getAttribute('data-id'));
            deleteAlarm(id);
        });
    });
}

// Mettre à jour les minutes restantes en temps réel sans rechargement
function updateAlarmTimes() {
    if (appData.alarms.length > 0) {
        renderAlarms();
    }
}

addAlarmButton.addEventListener("click", addAlarm);
setInterval(checkAlarms, 1000);
setInterval(updateAlarmTimes, 60000); // Mise à jour des minutes toutes les 60 secondes

// Initialiser l'application au chargement
document.addEventListener('DOMContentLoaded', function() {
    initTimer();
    initChrono();
    initAlarms();
});
