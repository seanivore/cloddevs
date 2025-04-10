// Import modules
import config from '../config.js';

// Dialog elements cache
let dialogElements = {
  welcomeMessage: null,
  genericBuildingPopup: null,
  buildingCloseBtn: null,
  buildingTitle: null,
  buildingDescription: null,
  towerInfo: null,
  towerCloseBtn: null
};

// Initialize the dialog system
export function initDialogs() {
  // Cache dialog elements
  dialogElements = {
    welcomeMessage: document.getElementById('welcomeMessage'),
    genericBuildingPopup: document.getElementById('genericBuildingPopup'),
    buildingCloseBtn: document.getElementById('buildingCloseBtn'),
    buildingTitle: document.getElementById('buildingTitle'),
    buildingDescription: document.getElementById('buildingDescription'),
    towerInfo: document.getElementById('towerInfo'),
    towerCloseBtn: document.getElementById('towerCloseBtn')
  };
  
  // Set up dialog event listeners
  setupDialogListeners();
  
  return dialogElements;
}

// Set up dialog event listeners
function setupDialogListeners() {
  // Set up welcome message to close on any key press
  document.addEventListener('keydown', handleKeyForWelcome);
  
  // Building dialog
  if (dialogElements.buildingCloseBtn) {
    dialogElements.buildingCloseBtn.addEventListener('click', () => {
      hideDialog(dialogElements.genericBuildingPopup);
    });
  }
  
  // Tower dialog
  if (dialogElements.towerCloseBtn) {
    dialogElements.towerCloseBtn.addEventListener('click', () => {
      hideDialog(dialogElements.towerInfo);
    });
  }
  
  // Close dialogs when clicking outside
  const dialogLayer = document.getElementById('dialog-layer');
  if (dialogLayer) {
    dialogLayer.addEventListener('click', (e) => {
      // Only close if clicking directly on the dialog layer (not on dialog content)
      if (e.target === dialogLayer) {
        hideAllDialogs();
      }
    });
  }
  
  // Close dialogs when pressing Escape key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      hideAllDialogs();
    }
  });
}

// Handle key press for welcome dialog
function handleKeyForWelcome(e) {
  if (dialogElements.welcomeMessage && dialogElements.welcomeMessage.classList.contains('active')) {
    hideDialog(dialogElements.welcomeMessage);
    // Remove the event listener after first use to prevent closing other dialogs
    document.removeEventListener('keydown', handleKeyForWelcome);
  }
}

// Show welcome message dialog
export function showWelcomeMessage() {
  if (dialogElements.welcomeMessage) {
    dialogElements.welcomeMessage.classList.add('active');
    document.getElementById('dialog-layer').classList.add('active');
  }
}

// Show building info dialog
export function showBuildingInfo(buildingId, title, description) {
  if (dialogElements.genericBuildingPopup) {
    // Set title and description
    if (dialogElements.buildingTitle) dialogElements.buildingTitle.textContent = title || 'Building';
    if (dialogElements.buildingDescription) dialogElements.buildingDescription.textContent = description || 'No information available.';
    
    // Show dialog
    dialogElements.genericBuildingPopup.classList.add('active');
    document.getElementById('dialog-layer').classList.add('active');
  }
}

// Show tower info dialog
export function showTowerInfo() {
  if (dialogElements.towerInfo) {
    dialogElements.towerInfo.classList.add('active');
    document.getElementById('dialog-layer').classList.add('active');
  }
}

// Hide a specific dialog
export function hideDialog(dialog) {
  if (dialog) {
    dialog.classList.remove('active');
    
    // Check if any dialogs are still active
    const activeDialogs = document.querySelectorAll('.dialog-box.active');
    if (activeDialogs.length === 0) {
      document.getElementById('dialog-layer').classList.remove('active');
    }
  }
}

// Hide all dialogs
export function hideAllDialogs() {
  const dialogs = document.querySelectorAll('.dialog-box');
  dialogs.forEach(dialog => {
    dialog.classList.remove('active');
  });
  
  document.getElementById('dialog-layer').classList.remove('active');
}
