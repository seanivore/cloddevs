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
    this.initialized = false;
    this.keySequence = ['left', 'right', 'left', 'right', 'up', 'down'];
    this.currentKeyIndex = 0;
    this.animationInterval = null;
    this.keyStates = {
      up: false,
      down: false,
      left: false,
      right: false,
      space: false
    };
  }
  
  /**
   * Initialize the keypad manager
   */
  init() {
    if (this.initialized) return;
    
    // Get DOM elements
    this.keypadImage = document.getElementById('keypad-svg');
    this.keysInstruction = document.getElementById('keys-instruction');
    
    if (!this.keypadImage) {
      console.error('Keypad SVG element not found');
      return;
    }
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Create interactive area glows
    this.createInteractiveAreaGlows();
    
    // Start initial animation sequence after a short delay
    setTimeout(() => {
      this.startKeypadAnimation();
    }, 2000);
    
    this.initialized = true;
    console.log('Keypad Manager initialized');
  }
  
  /**
   * Set up keyboard event listeners
   */
  setupEventListeners() {
    // Keyboard controls
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('keyup', this.handleKeyUp.bind(this));
    
    // Click/touch events for the keypad
    if (this.keypadImage) {
      this.keypadImage.parentElement.addEventListener('click', this.handleKeypadClick.bind(this));
    }
  }
  
  /**
   * Handle keydown events
   * @param {KeyboardEvent} e - The keyboard event
   */
  handleKeyDown(e) {
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        this.keyStates.up = true;
        this.updateKeypadImage('up');
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        this.keyStates.down = true;
        this.updateKeypadImage('down');
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        this.keyStates.left = true;
        this.updateKeypadImage('left');
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        this.keyStates.right = true;
        this.updateKeypadImage('right');
        break;
      case ' ':
        this.keyStates.space = true;
        break;
    }
  }
  
  /**
   * Handle keyup events
   * @param {KeyboardEvent} e - The keyboard event
   */
  handleKeyUp(e) {
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        this.keyStates.up = false;
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        this.keyStates.down = false;
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        this.keyStates.left = false;
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        this.keyStates.right = false;
        break;
      case ' ':
        this.keyStates.space = false;
        break;
    }
    
    // Reset keypad image if no direction keys are pressed
    if (!this.keyStates.up && !this.keyStates.down && 
        !this.keyStates.left && !this.keyStates.right) {
      this.updateKeypadImage('neutral');
    }
  }
  
  /**
   * Handle clicks on the keypad
   * @param {MouseEvent} e - The mouse event
   */
  handleKeypadClick(e) {
    const rect = this.keypadImage.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Determine which direction was clicked
    if (Math.abs(x - centerX) > Math.abs(y - centerY)) {
      // Horizontal movement
      if (x < centerX) {
        this.updateKeypadImage('left');
        setTimeout(() => this.updateKeypadImage('neutral'), 200);
      } else {
        this.updateKeypadImage('right');
        setTimeout(() => this.updateKeypadImage('neutral'), 200);
      }
    } else {
      // Vertical movement
      if (y < centerY) {
        this.updateKeypadImage('up');
        setTimeout(() => this.updateKeypadImage('neutral'), 200);
      } else {
        this.updateKeypadImage('down');
        setTimeout(() => this.updateKeypadImage('neutral'), 200);
      }
    }
  }
  
  /**
   * Update the keypad image based on direction
   * @param {string} direction - The direction key that was pressed
   */
  updateKeypadImage(direction) {
    if (!this.keypadImage) return;
    
    // Update the SVG source based on direction
    this.keypadImage.src = `assets/svg/directional-keypad-ui/keypad-${direction === 'neutral' ? 'neutral' : 'select-' + direction}.svg`;
    
    // Highlight the corresponding interactive area
    this.highlightInteractiveArea(direction);
  }
  
  /**
   * Start the keypad animation sequence
   */
  startKeypadAnimation() {
    // Show the keys instruction
    if (this.keysInstruction) {
      this.keysInstruction.style.opacity = '1';
    }
    
    // Stop any existing animation
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
    
    this.currentKeyIndex = 0;
    
    // Animate through the key sequence
    this.animationInterval = setInterval(() => {
      const direction = this.keySequence[this.currentKeyIndex];
      this.updateKeypadImage(direction);
      
      this.currentKeyIndex++;
      
      // Reset to neutral between keys
      setTimeout(() => {
        this.updateKeypadImage('neutral');
      }, 300);
      
      // End of sequence
      if (this.currentKeyIndex >= this.keySequence.length) {
        clearInterval(this.animationInterval);
        this.currentKeyIndex = 0;
        
        // Hide the keys instruction after the animation
        setTimeout(() => {
          if (this.keysInstruction) {
            this.keysInstruction.style.opacity = '0';
          }
          
          // Blink interactive areas in sequence
          setTimeout(() => {
            this.blinkInteractiveAreas();
          }, 500);
        }, 1000);
      }
    }, 600);
  }
  
  /**
   * Create glowing elements for interactive areas
   */
  createInteractiveAreaGlows() {
    // Find all interactive areas (stoops)
    const stoops = document.querySelectorAll('.interactive-stoop');
    
    stoops.forEach(stoop => {
      const glow = document.createElement('div');
      glow.className = 'interactive-area-glow';
      
      // Position the glow based on the stoop's position
      const position = stoop.getBoundingClientRect();
      glow.style.width = position.width + 'px';
      glow.style.height = position.height + 'px';
      glow.style.left = position.left + 'px';
      glow.style.top = position.top + 'px';
      
      document.body.appendChild(glow);
      this.interactiveAreas.push(glow);
    });
  }
  
  /**
   * Highlight an interactive area based on direction
   * @param {string} direction - The direction key that was pressed
   */
  highlightInteractiveArea(direction) {
    // Map directions to interactive areas
    const areaIndex = {
      'up': 0,     // North building
      'right': 1,  // East building
      'down': 2,   // South building
      'left': 3    // West building
    }[direction];
    
    // Reset all areas
    this.interactiveAreas.forEach(area => {
      area.style.animation = 'none';
    });
    
    // Highlight the selected area
    if (areaIndex !== undefined && this.interactiveAreas[areaIndex]) {
      this.interactiveAreas[areaIndex].style.animation = 'blink 1s infinite';
    }
  }
  
  /**
   * Blink all interactive areas in sequence
   */
  blinkInteractiveAreas() {
    const directions = ['up', 'right', 'down', 'left'];
    let index = 0;
    
    const blinkInterval = setInterval(() => {
      this.highlightInteractiveArea(directions[index]);
      
      index++;
      
      if (index >= directions.length) {
        clearInterval(blinkInterval);
        
        // After blinking in sequence, reset all areas
        setTimeout(() => {
          this.interactiveAreas.forEach(area => {
            area.style.animation = 'none';
          });
        }, 1000);
      }
    }, 800);
  }
}

const keypadManager = new KeypadManager();
export default keypadManager; 