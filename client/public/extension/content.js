// content.js
console.log('Focus Guard Content Script Loaded');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SHOW_WARNING') {
    showOverlay(message.data);
  }
});

function showOverlay(data) {
  // Check if overlay already exists
  if (document.getElementById('focus-guard-overlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'focus-guard-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0,0,0,0.85)';
  overlay.style.zIndex = '999999';
  overlay.style.display = 'flex';
  overlay.style.flexDirection = 'column';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.color = 'white';
  overlay.style.fontFamily = 'sans-serif';

  overlay.innerHTML = `
    <div style="background: #1f2937; padding: 2rem; border-radius: 1rem; max-width: 500px; text-align: center; border: 1px solid #374151;">
      <h1 style="margin-bottom: 1rem; font-size: 1.5rem; color: #f87171;">⚠️ Semantic Drift Detected</h1>
      <p style="margin-bottom: 1.5rem; color: #d1d5db;">
        It seems you are drifting away from your goal: <br>
        <strong>${data.reason}</strong>
      </p>
      <div style="display: flex; gap: 1rem; justify-content: center;">
        <button id="focus-guard-return" style="padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: bold;">Return to Focus</button>
        <button id="focus-guard-snooze" style="padding: 0.5rem 1rem; background: #4b5563; color: white; border: none; border-radius: 0.5rem; cursor: pointer;">Snooze (5m)</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  document.getElementById('focus-guard-return').addEventListener('click', () => {
    overlay.remove();
    // In a real app, maybe close the tab or redirect?
  });

  document.getElementById('focus-guard-snooze').addEventListener('click', () => {
    overlay.remove();
    // Send message to background to snooze
  });
}
