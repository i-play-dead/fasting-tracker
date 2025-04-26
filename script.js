let fastingStart = localStorage.getItem('fastingStart');
let isPaused = localStorage.getItem('isPaused') === 'true'; // Save pause status

function startFasting() {
  if (!fastingStart) {
    fastingStart = Date.now();
    localStorage.setItem('fastingStart', fastingStart);
  }
  isPaused = false;
  localStorage.setItem('isPaused', 'false');
  updateTimer();
}

function pauseFasting() {
  isPaused = true;
  localStorage.setItem('isPaused', 'true');
}

function stopFasting() {
  if (fastingStart && !isPaused) {
    saveToHistory(); // Save only if a real fast was ongoing
  }
  localStorage.removeItem('fastingStart');
  localStorage.removeItem('isPaused');
  fastingStart = null;
  isPaused = false;
  document.getElementById('timer').innerText = "Not fasting yet.";
  updateHistory();
}

function updateTimer() {
  if (fastingStart && !isPaused) {
    const now = Date.now();
    const elapsedMs = now - fastingStart;
    const hours = Math.floor(elapsedMs / (1000 * 60 * 60));
    const minutes = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((elapsedMs % (1000 * 60)) / 1000);
    document.getElementById('timer').innerText = `Fasting for ${hours}h ${minutes}m ${seconds}s`;
  } else if (fastingStart && isPaused) {
    document.getElementById('timer').innerText = "Paused.";
  }
}

// Update timer every second
setInterval(updateTimer, 1000);
updateTimer();
function saveToHistory() {
  const now = Date.now();
  const elapsedMs = now - fastingStart;
  const hours = Math.floor(elapsedMs / (1000 * 60 * 60));
  const minutes = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((elapsedMs % (1000 * 60)) / 1000);
  
  const entry = `Fasted for ${hours}h ${minutes}m ${seconds}s`;

  let history = JSON.parse(localStorage.getItem('fastHistory')) || [];
  history.push(entry);
  localStorage.setItem('fastHistory', JSON.stringify(history));
}

function updateHistory() {
  const historyList = document.getElementById('history');
  historyList.innerHTML = '';
  const history = JSON.parse(localStorage.getItem('fastHistory')) || [];
  history.forEach(item => {
    const li = document.createElement('li');
    li.innerText = item;
    historyList.appendChild(li);
  });
}

updateHistory(); // Call it at startup

