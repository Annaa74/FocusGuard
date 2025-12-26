// background.js

// Configuration
const API_ENDPOINT = 'https://YOUR_REPLIT_APP_URL.replit.app/api/analyze-focus'; // User needs to update this!
const CHECK_INTERVAL_MINUTES = 1;

// State
let currentGoal = null;
let isSessionActive = false;

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'START_SESSION') {
    currentGoal = message.goal;
    isSessionActive = true;
    chrome.storage.local.set({ currentGoal, isSessionActive: true });
    startMonitoring();
    sendResponse({ status: 'started' });
  } else if (message.type === 'END_SESSION') {
    currentGoal = null;
    isSessionActive = false;
    chrome.storage.local.set({ isSessionActive: false });
    stopMonitoring();
    sendResponse({ status: 'stopped' });
  } else if (message.type === 'GET_STATUS') {
    sendResponse({ isSessionActive, currentGoal });
  }
});

// Restore state on startup
chrome.storage.local.get(['currentGoal', 'isSessionActive'], (result) => {
  if (result.isSessionActive) {
    currentGoal = result.currentGoal;
    isSessionActive = true;
    startMonitoring();
  }
});

function startMonitoring() {
  chrome.alarms.create('checkFocus', { periodInMinutes: CHECK_INTERVAL_MINUTES });
}

function stopMonitoring() {
  chrome.alarms.clear('checkFocus');
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'checkFocus' && isSessionActive) {
    checkCurrentTab();
  }
});

async function checkCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.id) return;

  // Execute script to get content
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: extractPageContent
  }, async (results) => {
    if (results && results[0] && results[0].result) {
      const content = results[0].result;
      analyzeFocus(content, tab.id);
    }
  });
}

function extractPageContent() {
  // Simple extraction: headers + paragraphs
  const headers = Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.innerText).join(' ');
  const paragraphs = Array.from(document.querySelectorAll('p')).map(p => p.innerText).join(' ');
  return headers + '\n' + paragraphs;
}

async function analyzeFocus(content, tabId) {
  try {
    // Replace with your actual Replit URL
    // For development, we might not have the URL yet, so this is a placeholder
    // In a real extension, you'd fetch this from settings or hardcode the production URL
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal: currentGoal, content: content })
    });

    const result = await response.json();
    
    if (!result.isOnTrack) {
      // Trigger Nudge
      chrome.tabs.sendMessage(tabId, {
        type: 'SHOW_WARNING',
        data: result
      });
    }
  } catch (error) {
    console.error('Analysis failed', error);
  }
}
