let startTime;
let interval;
let isPaused = false;
let pausedTime = 0;
let goalHours = 0;

function startFast() {
  startTime = Date.now();
  pausedTime = 0;
  isPaused = false;
  document.getElementById('status').innerText = "Fasting...";
  interval = setInterval(updateTimer, 1000);
}

function pauseFast() {
  if (!isPaused) {
    clearInterval(interval);
    pausedTime = Date.now() - startTime;
    isPaused = true;
    document.getElementById('status').innerText = "Paused";
  } else {
    startTime = Date.now() - pausedTime;
    interval = setInterval(updateTimer, 1000);
    isPaused = false;
    document.getElementById('status').innerText = "Fasting...";
  }
}

function stopFast() {
  clearInterval(interval);
  const endTime = Date.now();
  const duration = endTime - startTime;
  saveFast(duration);
  document.getElementById('timer').innerText = "00:00:00";
  document.getElementById('status').innerText = "Not Fasting";
}

function updateTimer() {
  const elapsedMs = Date.now() - startTime;
  const totalSeconds = Math.floor(elapsedMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  document.getElementById('timer').innerText =
    `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

  if (goalHours) {
    const goalSeconds = goalHours * 3600;
    const percent = Math.min(100, (totalSeconds / goalSeconds) * 100);
    document.getElementById('goalStatus').innerText = 
      `Goal Progress: ${percent.toFixed(1)}%`;
  }
}

function pad(num) {
  return num.toString().padStart(2, '0');
}

function saveFast(duration) {
  let history = JSON.parse(localStorage.getItem('fastHistory')) || [];
  history.push({
    date: new Date().toLocaleString(),
    duration: formatDuration(duration)
  });
  localStorage.setItem('fastHistory', JSON.stringify(history));
  updateHistory();
}

function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
}

function updateHistory() {
  const historyList = document.getElementById('history');
  historyList.innerHTML = '';
  const history = JSON.parse(localStorage.getItem('fastHistory')) || [];
  history.forEach(entry => {
    const li = document.createElement('li');
    li.innerText = `${entry.date} - ${entry.duration}`;
    historyList.appendChild(li);
  });
}

function resetHistory() {
  if (confirm("Are you sure you want to delete all history?")) {
    localStorage.removeItem('fastHistory');
    updateHistory();
  }
}

function setGoal() {
  const input = document.getElementById('goalInput').value;
  goalHours = parseFloat(input);
  if (isNaN(goalHours) || goalHours <= 0) {
    goalHours = 0;
    document.getElementById('goalStatus').innerText = "Invalid goal.";
  } else {
    document.getElementById('goalStatus').innerText = `Goal set: ${goalHours} hours.`;
  }
}

// Initialize
updateHistory();
