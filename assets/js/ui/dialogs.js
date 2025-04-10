// Dialog elements cache
let dialogElements = {
  welcomeMessage: null,
  welcomeCloseBtn: null,
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
    welcomeCloseBtn: document.getElementById('welcomeCloseBtn'),
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
  // Welcome dialog
  dialogElements.welcomeCloseBtn.addEventListener('click', () => {
    hideWelcomeMessage();
  });
  
  // Building dialog
  dialogElements.buildingCloseBtn.addEventListener('click', () => {
    hidePopup('genericBuildingPopup');
  });
  
  // Tower dialog
  dialogElements.towerCloseBtn.addEventListener('click', () => {
    hidePopup('towerInfo');
  });
  
  // Close dialogs when pressing Escape key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      hideAllDialogs();
    }
  });
}

// Show the welcome message dialog
export function showWelcomeMessage() {
  dialogElements.welcomeMessage.style.display = 'block';
}

// Hide the welcome message dialog
export function hideWelcomeMessage() {
  dialogElements.welcomeMessage.style.display = 'none';
}

// Show building-specific popup
export function showBuildingInfo(title, body) {
  dialogElements.buildingTitle.textContent = title;
  dialogElements.buildingDescription.textContent = body;
  showPopup('genericBuildingPopup');
}

// Show a specific popup by ID
export function showPopup(id) {
  const element = document.getElementById(id);
  if (element) {
    element.style.display = 'block';
  }
}

// Hide a specific popup by ID
export function hidePopup(id) {
  const element = document.getElementById(id);
  if (element) {
    element.style.display = 'none';
  }
}

// Hide all dialogs
export function hideAllDialogs() {
  hideWelcomeMessage();
  hidePopup('genericBuildingPopup');
  hidePopup('towerInfo');
}

// Check if any dialog is currently open
export function isDialogOpen() {
  return (
    dialogElements.welcomeMessage.style.display === 'block' ||
    dialogElements.genericBuildingPopup.style.display === 'block' ||
    dialogElements.towerInfo.style.display === 'block'
  );
}
