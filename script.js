let startTime;
let interval;
let isPaused = false;
let pausedTime = 0;
let goalHours = 0;

// Create the progress circle
let bar = new ProgressBar.Circle('#progressContainer', {
  color: '#00bfff',
  strokeWidth: 6,
  trailWidth: 2,
  trailColor: '#eee',
  easing: 'easeInOut',
  duration: 1400,
  from: { color: '#00bfff', width: 6 },
  to: { color: '#00ff00', width: 6 },
  step: function(state, circle) {
    circle.path.setAttribute('stroke', state.color);
    circle.path.setAttribute('stroke-width', state.width);
  }
});
bar.set(0); // Start empty

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
  bar.set(0); // Reset progress bar
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
    const percent = Math.min(1, (elapsedMs / (goalHours * 60 * 60 * 1000)));
    bar.set(percent); // Fill the circle
    document.getElementById('goalStatus').innerText = `Goal: ${(percent * 100).toFixed(1)}% completed.`;
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

function saveNote() {
  const noteText = document.getElementById('feelingNote').value.trim();
  if (noteText !== "") {
    let notes = JSON.parse(localStorage.getItem('feelingNotes')) || [];
    notes.push(noteText);
    localStorage.setItem('feelingNotes', JSON.stringify(notes));
    document.getElementById('feelingNote').value = "";
    updateNotes();
  }
}

function updateNotes() {
  const notesList = document.getElementById('notes');
  notesList.innerHTML = '';
  const notes = JSON.parse(localStorage.getItem('feelingNotes')) || [];
  notes.forEach(note => {
    const li = document.createElement('li');
    li.innerText = note;
    notesList.appendChild(li);
  });
}

// Initialize
updateHistory();
updateNotes();
