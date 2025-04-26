let fastingStart = localStorage.getItem('fastingStart');

function startFasting() {
  fastingStart = Date.now();
  localStorage.setItem('fastingStart', fastingStart);
  updateTimer();
}

function stopFasting() {
  localStorage.removeItem('fastingStart');
  fastingStart = null;
  document.getElementById('timer').innerText = "Not fasting yet.";
}

function updateTimer() {
  if (fastingStart) {
    const now = Date.now();
    const elapsedMs = now - fastingStart;
    const hours = Math.floor(elapsedMs / (1000 * 60 * 60));
    const minutes = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60));
    document.getElementById('timer').innerText = `Fasting for ${hours}h ${minutes}m`;
  }
}

// Update timer every minute
setInterval(updateTimer, 60000);
updateTimer();
