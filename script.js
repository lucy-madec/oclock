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

function startTimer() {
    const inputSeconds = parseInt(timerInput.value, 10);
    if (isNaN(inputSeconds) || inputSeconds <= 0) {
        alert("Veuillez entrer un temps valide !");
        return;
    }

    let remainingTime = inputSeconds;
    timerDisplay.textContent = formatTime(remainingTime);

    timerInterval = setInterval(() => {
        remainingTime--;
        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            alert("Temps écoulé !");
        }
        timerDisplay.textContent = formatTime(remainingTime);
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    timerDisplay.textContent = "00:00";
    timerInput.value = "";
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${secs}`;
}

startTimerButton.addEventListener("click", startTimer);
resetTimerButton.addEventListener("click", resetTimer);

// Stopwatch
let chronoInterval;
let chronoTime = 0;
let isChronoRunning = false;
const chronoDisplay = document.getElementById("chrono-time");
const startChronoButton = document.getElementById("start-chrono");
const lapChronoButton = document.getElementById("lap-chrono");
const resetChronoButton = document.getElementById("reset-chrono");
const chronoLaps = document.getElementById("chrono-laps");

function updateChronoDisplay() {
    const hours = Math.floor(chronoTime / 3600).toString().padStart(2, "0");
    const minutes = Math.floor((chronoTime % 3600) / 60).toString().padStart(2, "0");
    const seconds = (chronoTime % 60).toString().padStart(2, "0");
    chronoDisplay.textContent = `${hours}:${minutes}:${seconds}`;
}

function toggleChrono() {
    if (isChronoRunning) {
        clearInterval(chronoInterval);
    } else {
        chronoInterval = setInterval(() => {
            chronoTime++;
            updateChronoDisplay();
        }, 1000);
    }
    isChronoRunning = !isChronoRunning;
}

function addLap() {
    const lapTime = chronoDisplay.textContent;
    const lapItem = document.createElement("li");
    lapItem.textContent = `Tour : ${lapTime}`;
    chronoLaps.appendChild(lapItem);
}

function resetChrono() {
    clearInterval(chronoInterval);
    chronoTime = 0;
    isChronoRunning = false;
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

let alarms = [];

function checkAlarms() {
    const now = new Date();
    const currentHours = now.getHours().toString().padStart(2, "0");
    const currentMinutes = now.getMinutes().toString().padStart(2, "0");
    const currentTime = `${currentHours}:${currentMinutes}`;

    alarms.forEach((alarm, index) => {
        if (currentTime === alarm.time && !alarm.triggered) {
            alert(alarm.message);
            alarm.triggered = true; // Marque l'alarme comme déclenchée
            updateAlarmList();
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
    };
    alarms.push(newAlarm);
    updateAlarmList();

    alarmTimeInput.value = "";
    alarmMessageInput.value = "";
}

function updateAlarmList() {
    alarmList.innerHTML = "";
    alarms.forEach((alarm) => {
        const alarmItem = document.createElement("li");
        const now = new Date();
        const alarmDate = new Date();
        const [hours, minutes] = alarm.time.split(":");
        alarmDate.setHours(hours);
        alarmDate.setMinutes(minutes);
        alarmDate.setSeconds(0);

        const timeDiff = alarmDate - now;
        if (timeDiff < 0) {
            alarmItem.textContent = `${alarm.time} - ${alarm.message} (Passée)`;
        } else {
            const timeLeft = Math.ceil(timeDiff / 1000 / 60); // Minutes restantes
            alarmItem.textContent = `${alarm.time} - ${alarm.message} (Dans ${timeLeft} min)`;
        }
        alarmList.appendChild(alarmItem);
    });
}

addAlarmButton.addEventListener("click", addAlarm);
setInterval(checkAlarms, 1000);
