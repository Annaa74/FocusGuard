document.addEventListener('DOMContentLoaded', () => {
  const setupView = document.getElementById('setup-view');
  const activeView = document.getElementById('active-view');
  const goalInput = document.getElementById('goal-input');
  const currentGoalDisplay = document.getElementById('current-goal-display');
  const startBtn = document.getElementById('start-btn');
  const endBtn = document.getElementById('end-btn');

  // Check status
  chrome.runtime.sendMessage({ type: 'GET_STATUS' }, (response) => {
    if (response && response.isSessionActive) {
      showActive(response.currentGoal);
    } else {
      showSetup();
    }
  });

  startBtn.addEventListener('click', () => {
    const goal = goalInput.value;
    if (!goal) return;
    chrome.runtime.sendMessage({ type: 'START_SESSION', goal }, () => {
      showActive(goal);
    });
  });

  endBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'END_SESSION' }, () => {
      showSetup();
    });
  });

  function showSetup() {
    setupView.classList.remove('hidden');
    activeView.classList.add('hidden');
    goalInput.value = '';
  }

  function showActive(goal) {
    setupView.classList.add('hidden');
    activeView.classList.remove('hidden');
    currentGoalDisplay.textContent = goal;
  }
});
