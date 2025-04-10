/**
 * UI Manager for the Clôd Cluster Pixel Town
 * Handles all UI elements, dialog boxes, and user interactions
 */
import config from './config.js';
import buildingData from './buildingData.js';

class UIManager {
  constructor() {
    this.dialogs = {};
    this.activeDialog = null;
    this.uiElements = {};
    this.initialized = false;
  }

  /**
   * Initialize UI elements and event listeners
   */
  init() {
    if (this.initialized) return;
    
    // Cache UI elements
    this.cacheElements();
    
    // Set up dialog boxes
    this.setupDialogs();
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Show welcome dialog on first load
    this.showDialog('welcome-dialog');
    
    this.initialized = true;
    console.log('UI Manager initialized');
  }
  
  /**
   * Cache references to UI elements
   */
  cacheElements() {
    // Get dialog layer
    this.dialogLayer = document.getElementById('dialog-layer');
    
    // Get all dialog elements
    const dialogElements = document.querySelectorAll('.dialog-box');
    dialogElements.forEach(dialog => {
      this.dialogs[dialog.id] = dialog;
    });
    
    // Get UI elements
    this.uiElements = {
      radioToggle: document.getElementById('radio-toggle'),
      gameCanvas: document.getElementById('game-canvas'),
      loadingScreen: document.getElementById('loading-screen'),
      notificationPanel: document.getElementById('notification-panel')
    };
    
    console.log('UI elements cached:', Object.keys(this.dialogs).length, 'dialogs found');
  }
  
  /**
   * Set up dialog boxes with content and close buttons
   */
  setupDialogs() {
    // Set up each dialog
    Object.values(this.dialogs).forEach(dialog => {
      // Add close button functionality
      const closeBtn = dialog.querySelector('.close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.closeDialog(dialog.id));
      }
      
      // Set up building-specific content
      if (dialog.id.includes('building-')) {
        // Will be populated dynamically when building is clicked
      }
    });
    
    // Special handling for welcome dialog
    const welcomeDialog = this.dialogs['welcome-dialog'];
    if (welcomeDialog) {
      const exploreBtn = welcomeDialog.querySelector('.explore-btn');
      if (exploreBtn) {
        exploreBtn.addEventListener('click', () => this.closeDialog('welcome-dialog'));
      }
    }
  }
  
  /**
   * Set up global event listeners
   */
  setupEventListeners() {
    // Close dialogs with ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeDialog) {
        this.closeAllDialogs();
      }
    });
    
    // Radio toggle functionality
    if (this.uiElements.radioToggle) {
      this.uiElements.radioToggle.addEventListener('change', (e) => {
        // Toggle radio audio
        const isChecked = e.target.checked;
        this.toggleRadio(isChecked);
      });
    }
    
    // Handle dialog layer backdrop clicks
    this.dialogLayer.addEventListener('click', (e) => {
      // Only close if clicking directly on the dialog layer (backdrop)
      if (e.target === this.dialogLayer) {
        this.closeAllDialogs();
      }
    });
  }
  
  /**
   * Show a specific dialog box
   * @param {string} dialogId - The ID of the dialog to show
   * @param {Object} [data] - Optional data to populate dynamic content
   */
  showDialog(dialogId, data = null) {
    // Hide any active dialog first
    if (this.activeDialog) {
      this.dialogs[this.activeDialog].classList.remove('active');
    }
    
    // Show the requested dialog
    const dialog = this.dialogs[dialogId];
    if (dialog) {
      // Populate with data if provided
      if (data) {
        this.populateDialogContent(dialogId, data);
      }
      
      dialog.classList.add('active');
      this.dialogLayer.classList.add('active');
      this.activeDialog = dialogId;
      
      console.log(`Dialog shown: ${dialogId}`);
    } else {
      console.error(`Dialog not found: ${dialogId}`);
    }
  }
  
  /**
   * Show a building's info dialog
   * @param {string} buildingId - The ID of the building
   */
  showBuildingDialog(buildingId) {
    const building = buildingData[buildingId];
    if (!building || !building.interactive) return;
    
    this.showDialog(building.dialogId, building);
  }
  
  /**
   * Close a specific dialog box
   * @param {string} dialogId - The ID of the dialog to close
   */
  closeDialog(dialogId) {
    const dialog = this.dialogs[dialogId];
    if (dialog) {
      dialog.classList.remove('active');
      
      // If this was the active dialog, clear it
      if (this.activeDialog === dialogId) {
        this.activeDialog = null;
        this.dialogLayer.classList.remove('active');
      }
      
      console.log(`Dialog closed: ${dialogId}`);
    }
  }
  
  /**
   * Close all open dialogs
   */
  closeAllDialogs() {
    Object.keys(this.dialogs).forEach(dialogId => {
      this.closeDialog(dialogId);
    });
    this.dialogLayer.classList.remove('active');
    this.activeDialog = null;
  }
  
  /**
   * Populate dialog with dynamic content
   * @param {string} dialogId - The ID of the dialog
   * @param {Object} data - The data to populate
   */
  populateDialogContent(dialogId, data) {
    const dialog = this.dialogs[dialogId];
    if (!dialog) return;
    
    // Set title
    const titleElement = dialog.querySelector('.dialog-title');
    if (titleElement && data.name) {
      titleElement.textContent = data.name;
    }
    
    // Set description
    const descElement = dialog.querySelector('.dialog-description');
    if (descElement && data.content && data.content.description) {
      descElement.textContent = data.content.description;
    }
    
    // Set features list if present
    const featuresList = dialog.querySelector('.features-list');
    if (featuresList && data.content && data.content.features) {
      featuresList.innerHTML = '';
      data.content.features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        featuresList.appendChild(li);
      });
    }
  }
  
  /**
   * Toggle the community radio
   * @param {boolean} isOn - Whether the radio should be on
   */
  toggleRadio(isOn) {
    // This will be connected to the audio manager
    console.log(`Radio toggled ${isOn ? 'on' : 'off'}`);
    // Will emit an event that the audio manager listens for
    const event = new CustomEvent('radio-toggle', { detail: { isOn } });
    document.dispatchEvent(event);
  }
  
  /**
   * Show a notification message
   * @param {string} message - The message to display
   * @param {string} [type='info'] - The type of notification (info, success, warning, error)
   * @param {number} [duration=3000] - How long to show the notification in milliseconds
   */
  showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    this.uiElements.notificationPanel.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.classList.add('active');
    }, 10);
    
    // Remove after duration
    setTimeout(() => {
      notification.classList.remove('active');
      
      // Remove from DOM after animation
      setTimeout(() => {
        if (notification.parentNode) {
          this.uiElements.notificationPanel.removeChild(notification);
        }
      }, 300);
    }, duration);
  }
  
  /**
   * Show/hide the loading screen
   * @param {boolean} show - Whether to show or hide
   * @param {string} [message] - Optional message to display
   */
  toggleLoadingScreen(show, message = 'Loading...') {
    const loadingScreen = this.uiElements.loadingScreen;
    if (!loadingScreen) return;
    
    if (show) {
      const messageElement = loadingScreen.querySelector('.loading-message');
      if (messageElement) {
        messageElement.textContent = message;
      }
      loadingScreen.classList.add('active');
    } else {
      loadingScreen.classList.remove('active');
    }
  }
}

const uiManager = new UIManager();
export default uiManager; 