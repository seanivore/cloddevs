/**
 * Keypad UI Manager for Clôd Cluster Pixel Town
 * Handles the directional keypad UI, animations, and interactions
 */
import config from './config.js';

class KeypadManager {
  constructor() {
    this.keypadImage = null;
    this.keysInstruction = null;
    this.interactiveAreas = [];
    this.keyStates = {
      up: false,
      down: false,
      left: false,
      right: false
    };
    this.isInitialized = false;
    this.currentDirection = null;
    this.glowElements = [];
  }
  
  /**
   * Initialize the keypad manager
   */
  init() {
    this.keypadImage = document.querySelector('.keypad-container img');
    this.keysInstruction = document.getElementById('keys-instruction');
    
    if (!this.keypadImage) {
      console.error('Keypad image not found');
      return;
    }
    
    // Set initial image
    this.keypadImage.src = config.ui.keypad.imagePaths.neutral;
    
    // Set up event listeners
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
    
    // Add click events to the keypad
    this.keypadImage.addEventListener('click', this.handleKeypadClick.bind(this));
    
    // Create glowing interactive areas elements
    setTimeout(() => {
      this.createGlowElements();
      // Start initial animation sequence
      this.animateInteractiveAreas();
    }, 2000);
    
    this.isInitialized = true;
  }
  
  /**
   * Handle keydown events
   * @param {KeyboardEvent} e - The keyboard event
   */
  handleKeyDown(e) {
    let directionChanged = false;
    
    switch(e.key) {
      case 'ArrowUp':
      case 'w':
        if (!this.keyStates.up) {
          this.keyStates.up = true;
          this.currentDirection = 'up';
          directionChanged = true;
        }
        break;
      case 'ArrowRight':
      case 'd':
        if (!this.keyStates.right) {
          this.keyStates.right = true;
          this.currentDirection = 'right';
          directionChanged = true;
        }
        break;
      case 'ArrowDown':
      case 's':
        if (!this.keyStates.down) {
          this.keyStates.down = true;
          this.currentDirection = 'down';
          directionChanged = true;
        }
        break;
      case 'ArrowLeft':
      case 'a':
        if (!this.keyStates.left) {
          this.keyStates.left = true;
          this.currentDirection = 'left';
          directionChanged = true;
        }
        break;
    }
    
    if (directionChanged) {
      this.updateKeypadImage();
      this.highlightInteractiveAreas(this.currentDirection);
    }
  }
  
  /**
   * Handle keyup events
   * @param {KeyboardEvent} e - The keyboard event
   */
  handleKeyUp(e) {
    switch(e.key) {
      case 'ArrowUp':
      case 'w':
        this.keyStates.up = false;
        break;
      case 'ArrowRight':
      case 'd':
        this.keyStates.right = false;
        break;
      case 'ArrowDown':
      case 's':
        this.keyStates.down = false;
        break;
      case 'ArrowLeft':
      case 'a':
        this.keyStates.left = false;
        break;
    }
    
    // Reset to neutral if no keys are pressed
    if (!this.keyStates.up && !this.keyStates.down && 
        !this.keyStates.left && !this.keyStates.right) {
      this.currentDirection = null;
      this.updateKeypadImage();
      this.resetInteractiveHighlights();
    } else {
      // Determine current direction based on remaining pressed keys
      if (this.keyStates.up) this.currentDirection = 'up';
      else if (this.keyStates.right) this.currentDirection = 'right';
      else if (this.keyStates.down) this.currentDirection = 'down';
      else if (this.keyStates.left) this.currentDirection = 'left';
      
      this.updateKeypadImage();
      this.highlightInteractiveAreas(this.currentDirection);
    }
  }
  
  /**
   * Update the keypad image based on direction
   */
  updateKeypadImage() {
    if (!this.keypadImage) return;
    
    if (this.currentDirection) {
      this.keypadImage.src = config.ui.keypad.imagePaths[this.currentDirection];
    } else {
      this.keypadImage.src = config.ui.keypad.imagePaths.neutral;
    }
  }
  
  /**
   * Handle clicks on the keypad
   * @param {MouseEvent} e - The mouse event
   */
  handleKeypadClick(e) {
    // Get click position relative to keypad
    const rect = this.keypadImage.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Determine which direction was clicked
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate distance from center
    const dx = x - centerX;
    const dy = y - centerY;
    
    // Determine direction based on which quadrant was clicked
    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal direction
      if (dx > 0) {
        this.currentDirection = 'right';
        this.simulateKeyPress('ArrowRight');
      } else {
        this.currentDirection = 'left';
        this.simulateKeyPress('ArrowLeft');
      }
    } else {
      // Vertical direction
      if (dy > 0) {
        this.currentDirection = 'down';
        this.simulateKeyPress('ArrowDown');
      } else {
        this.currentDirection = 'up';
        this.simulateKeyPress('ArrowUp');
      }
    }
    
    this.updateKeypadImage();
    this.highlightInteractiveAreas(this.currentDirection);
    
    // Reset to neutral after delay
    setTimeout(() => {
      this.currentDirection = null;
      this.updateKeypadImage();
      this.resetInteractiveHighlights();
    }, config.ui.keypad.animationDuration);
  }
  
  /**
   * Simulate a key press event
   * @param {string} key - The key to simulate
   */
  simulateKeyPress(key) {
    // Create and dispatch keydown event
    const keydownEvent = new KeyboardEvent('keydown', { key: key, bubbles: true });
    document.dispatchEvent(keydownEvent);
    
    // Create and dispatch keyup event after delay
    setTimeout(() => {
      const keyupEvent = new KeyboardEvent('keyup', { key: key, bubbles: true });
      document.dispatchEvent(keyupEvent);
    }, 200);
  }
  
  /**
   * Create glowing elements for interactive areas
   */
  createGlowElements() {
    // Get all interactive areas
    const interactiveElements = document.querySelectorAll('.interactive-stoop');
    
    interactiveElements.forEach(element => {
      // Create a glow element for each interactive area
      const glowElement = document.createElement('div');
      glowElement.classList.add('interactive-area-glow');
      
      // Position the glow element over the interactive area
      const rect = element.getBoundingClientRect();
      glowElement.style.width = `${rect.width + 20}px`;
      glowElement.style.height = `${rect.height + 20}px`;
      glowElement.style.left = `${element.offsetLeft - 10}px`;
      glowElement.style.top = `${element.offsetTop - 10}px`;
      
      // Add a data attribute to link the glow to its parent element
      glowElement.dataset.buildingId = element.dataset.buildingId;
      
      // Add to UI layer
      document.getElementById('ui-layer').appendChild(glowElement);
      
      // Save reference
      this.glowElements.push(glowElement);
    });
  }
  
  /**
   * Highlight interactive areas based on direction
   * @param {string} direction - The direction to highlight
   */
  highlightInteractiveAreas(direction) {
    // Reset all highlights first
    this.resetInteractiveHighlights();
    
    // Get player position
    const character = document.querySelector('.character-sprite');
    if (!character) return;
    
    const characterRect = character.getBoundingClientRect();
    const characterCenter = {
      x: characterRect.left + characterRect.width / 2,
      y: characterRect.top + characterRect.height / 2
    };
    
    // For each glow element, check if it's in the right direction
    this.glowElements.forEach(glow => {
      const glowRect = glow.getBoundingClientRect();
      const glowCenter = {
        x: glowRect.left + glowRect.width / 2,
        y: glowRect.top + glowRect.height / 2
      };
      
      // Calculate direction from player to glow
      const dx = glowCenter.x - characterCenter.x;
      const dy = glowCenter.y - characterCenter.y;
      
      // Calculate distance
      const distance = Math.sqrt(dx*dx + dy*dy);
      
      // Only highlight if within interaction distance
      if (distance > config.ui.keypad.interactionDistance) return;
      
      // Determine what direction the glow is in relative to player
      let glowDirection;
      if (Math.abs(dx) > Math.abs(dy)) {
        glowDirection = dx > 0 ? 'right' : 'left';
      } else {
        glowDirection = dy > 0 ? 'down' : 'up';
      }
      
      // If the direction matches, highlight the glow
      if (glowDirection === direction) {
        glow.classList.add('highlight');
      }
    });
  }
  
  /**
   * Reset interactive highlights
   */
  resetInteractiveHighlights() {
    this.glowElements.forEach(glow => {
      glow.classList.remove('highlight');
    });
  }
  
  /**
   * Animate interactive areas
   */
  animateInteractiveAreas() {
    // Animate all glow elements to blink
    this.glowElements.forEach((glow, index) => {
      // Stagger the animations
      setTimeout(() => {
        glow.classList.add('blink');
        
        // Remove the class after animation completes
        setTimeout(() => {
          glow.classList.remove('blink');
        }, config.ui.keypad.glowDuration);
      }, index * 300);
    });
    
    // Repeat the animation sequence after all elements have animated
    setTimeout(() => {
      this.animateInteractiveAreas();
    }, this.glowElements.length * 300 + config.ui.keypad.glowDuration + 1000);
  }
}

const keypadManager = new KeypadManager();
export default keypadManager; 