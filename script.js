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
