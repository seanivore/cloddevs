/**
 * Character Manager for the Clôd Cluster Pixel Town
 * Handles player character movement, animation, and interactions
 */
import config from './config.js';
import buildingData from './buildingData.js';
import uiManager from './uiManager.js';

class CharacterManager {
  constructor() {
    this.position = { x: 0, y: 0 };
    this.targetPosition = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
    this.speed = 2; // pixels per frame
    this.spriteElement = null;
    this.direction = 'down'; // 'up', 'down', 'left', 'right'
    this.isMoving = false;
    this.animationFrame = 0;
    this.animationTimer = 0;
    this.animationSpeed = 150; // ms per frame
    this.boundingBox = { width: 32, height: 32 }; // Collision detection size
    this.interactionRadius = 20; // Distance from which character can interact with objects
    this.initialized = false;
    this.lastUpdate = 0;
    this.movementKeys = {
      up: ['ArrowUp', 'w', 'W'],
      down: ['ArrowDown', 's', 'S'],
      left: ['ArrowLeft', 'a', 'A'],
      right: ['ArrowRight', 'd', 'D']
    };
    this.keysPressed = {
      up: false,
      down: false,
      left: false,
      right: false
    };
  }

  /**
   * Initialize the character manager
   */
  init() {
    if (this.initialized) return;
    
    // Get character sprite element
    this.spriteElement = document.getElementById('character-sprite');
    if (!this.spriteElement) {
      console.error('Character sprite element not found');
      return;
    }
    
    // Set initial position
    this.setPosition(config.character.startPosition.x, config.character.startPosition.y);
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Start animation loop
    this.lastUpdate = performance.now();
    this.update(this.lastUpdate);
    
    this.initialized = true;
    console.log('Character Manager initialized');
  }

  /**
   * Set up keyboard event listeners
   */
  setupEventListeners() {
    // Keyboard controls
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('keyup', this.handleKeyUp.bind(this));
    
    // Touch controls (for mobile)
    document.addEventListener('touchstart', this.handleTouchStart.bind(this));
    document.addEventListener('touchmove', this.handleTouchMove.bind(this));
    document.addEventListener('touchend', this.handleTouchEnd.bind(this));
    
    // Interaction key
    document.addEventListener('keypress', (e) => {
      if (e.key === 'e' || e.key === 'E' || e.key === ' ') {
        this.interact();
      }
    });
  }

  /**
   * Handle keydown events
   * @param {KeyboardEvent} e - The keyboard event
   */
  handleKeyDown(e) {
    // Movement keys
    for (const direction in this.movementKeys) {
      if (this.movementKeys[direction].includes(e.key)) {
        this.keysPressed[direction] = true;
        e.preventDefault();
      }
    }
  }

  /**
   * Handle keyup events
   * @param {KeyboardEvent} e - The keyboard event
   */
  handleKeyUp(e) {
    // Movement keys
    for (const direction in this.movementKeys) {
      if (this.movementKeys[direction].includes(e.key)) {
        this.keysPressed[direction] = false;
        e.preventDefault();
      }
    }
  }

  /**
   * Handle touch start event
   * @param {TouchEvent} e - The touch event
   */
  handleTouchStart(e) {
    // Store initial touch position
    if (e.touches.length > 0) {
      this.touchStartPosition = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
    }
  }

  /**
   * Handle touch move event
   * @param {TouchEvent} e - The touch event
   */
  handleTouchMove(e) {
    // Prevent scrolling
    e.preventDefault();
    
    if (e.touches.length > 0 && this.touchStartPosition) {
      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;
      
      // Calculate distance from start
      const deltaX = touchX - this.touchStartPosition.x;
      const deltaY = touchY - this.touchStartPosition.y;
      
      // Reset all keys
      for (const dir in this.keysPressed) {
        this.keysPressed[dir] = false;
      }
      
      // Set direction based on most significant axis
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal movement
        if (deltaX > 20) {
          this.keysPressed.right = true;
        } else if (deltaX < -20) {
          this.keysPressed.left = true;
        }
      } else {
        // Vertical movement
        if (deltaY > 20) {
          this.keysPressed.down = true;
        } else if (deltaY < -20) {
          this.keysPressed.up = true;
        }
      }
    }
  }

  /**
   * Handle touch end event
   * @param {TouchEvent} e - The touch event
   */
  handleTouchEnd(e) {
    // Reset all movement keys
    for (const dir in this.keysPressed) {
      this.keysPressed[dir] = false;
    }
    
    // Check if this was a tap (for interaction)
    if (e.changedTouches.length > 0 && this.touchStartPosition) {
      const touchX = e.changedTouches[0].clientX;
      const touchY = e.changedTouches[0].clientY;
      
      const deltaX = touchX - this.touchStartPosition.x;
      const deltaY = touchY - this.touchStartPosition.y;
      
      // If it was a tap (not a swipe)
      if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
        this.interact();
      }
    }
    
    this.touchStartPosition = null;
  }

  /**
   * Update character position and animation
   * @param {number} timestamp - Current animation frame timestamp
   */
  update(timestamp) {
    // Calculate delta time
    const deltaTime = timestamp - this.lastUpdate;
    this.lastUpdate = timestamp;
    
    // Get movement direction from keys
    this.updateMovement(deltaTime);
    
    // Update animation
    this.updateAnimation(deltaTime);
    
    // Apply movement
    this.applyMovement(deltaTime);
    
    // Update sprite position and state
    this.updateSprite();
    
    // Request next animation frame
    requestAnimationFrame(this.update.bind(this));
  }

  /**
   * Update movement direction and state based on keys pressed
   * @param {number} deltaTime - Time since last update in ms
   */
  updateMovement(deltaTime) {
    // Reset velocity
    this.velocity.x = 0;
    this.velocity.y = 0;
    
    // Check which keys are pressed
    if (this.keysPressed.up) {
      this.velocity.y = -this.speed;
      this.direction = 'up';
    } else if (this.keysPressed.down) {
      this.velocity.y = this.speed;
      this.direction = 'down';
    }
    
    if (this.keysPressed.left) {
      this.velocity.x = -this.speed;
      this.direction = 'left';
    } else if (this.keysPressed.right) {
      this.velocity.x = this.speed;
      this.direction = 'right';
    }
    
    // Calculate if moving
    this.isMoving = this.velocity.x !== 0 || this.velocity.y !== 0;
  }

  /**
   * Update animation frame based on movement
   * @param {number} deltaTime - Time since last update in ms
   */
  updateAnimation(deltaTime) {
    if (this.isMoving) {
      this.animationTimer += deltaTime;
      
      if (this.animationTimer >= this.animationSpeed) {
        this.animationTimer = 0;
        this.animationFrame = (this.animationFrame + 1) % config.character.animationFrames;
      }
    } else {
      // Reset to idle frame
      this.animationFrame = 0;
      this.animationTimer = 0;
    }
  }

  /**
   * Apply velocity to position with collision detection
   * @param {number} deltaTime - Time since last update in ms
   */
  applyMovement(deltaTime) {
    if (!this.isMoving) return;
    
    // Calculate new position
    const newX = this.position.x + this.velocity.x;
    const newY = this.position.y + this.velocity.y;
    
    // Check map boundaries
    const isXInBounds = newX >= 0 && newX + this.boundingBox.width <= config.map.width;
    const isYInBounds = newY >= 0 && newY + this.boundingBox.height <= config.map.height;
    
    // Apply movement if in bounds
    if (isXInBounds) {
      this.position.x = newX;
    }
    
    if (isYInBounds) {
      this.position.y = newY;
    }
    
    // Check building collisions
    this.checkBuildingCollisions();
  }

  /**
   * Check for collisions with buildings
   */
  checkBuildingCollisions() {
    // Create character bounding box
    const charBox = {
      left: this.position.x,
      right: this.position.x + this.boundingBox.width,
      top: this.position.y,
      bottom: this.position.y + this.boundingBox.height
    };
    
    // Check each building
    Object.values(buildingData).forEach(building => {
      // Create building bounding box
      const buildingBox = {
        left: building.position.x,
        right: building.position.x + building.dimensions.width,
        top: building.position.y,
        bottom: building.position.y + building.dimensions.height
      };
      
      // Check collision
      if (
        charBox.right > buildingBox.left &&
        charBox.left < buildingBox.right &&
        charBox.bottom > buildingBox.top &&
        charBox.top < buildingBox.bottom
      ) {
        // Push character out of collision
        if (this.velocity.x > 0) {
          // Moving right
          this.position.x = buildingBox.left - this.boundingBox.width;
        } else if (this.velocity.x < 0) {
          // Moving left
          this.position.x = buildingBox.right;
        }
        
        if (this.velocity.y > 0) {
          // Moving down
          this.position.y = buildingBox.top - this.boundingBox.height;
        } else if (this.velocity.y < 0) {
          // Moving up
          this.position.y = buildingBox.bottom;
        }
      }
    });
  }

  /**
   * Update sprite element position and animation
   */
  updateSprite() {
    if (!this.spriteElement) return;
    
    // Set position
    this.spriteElement.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
    
    // Set animation frame
    // Animation frames are arranged in a sprite sheet by direction
    const directionIndex = {
      'down': 0,
      'left': 1,
      'right': 2,
      'up': 3
    }[this.direction] || 0;
    
    // Calculate sprite position in sprite sheet
    const frameY = directionIndex * config.character.frameHeight;
    const frameX = this.animationFrame * config.character.frameWidth;
    
    // Update sprite background position
    this.spriteElement.style.backgroundPosition = 
      `-${frameX}px -${frameY}px`;
  }

  /**
   * Set character position
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   */
  setPosition(x, y) {
    this.position.x = x;
    this.position.y = y;
    
    // Update sprite
    if (this.spriteElement) {
      this.spriteElement.style.transform = `translate(${x}px, ${y}px)`;
    }
  }

  /**
   * Interact with nearby interactive objects
   */
  interact() {
    // Calculate interaction area
    const interactionArea = {
      left: this.position.x - this.interactionRadius,
      right: this.position.x + this.boundingBox.width + this.interactionRadius,
      top: this.position.y - this.interactionRadius,
      bottom: this.position.y + this.boundingBox.height + this.interactionRadius
    };
    
    // Check each building
    for (const buildingId in buildingData) {
      const building = buildingData[buildingId];
      
      // Skip non-interactive buildings
      if (!building.interactive) continue;
      
      // Create building bounding box
      const buildingBox = {
        left: building.position.x,
        right: building.position.x + building.dimensions.width,
        top: building.position.y,
        bottom: building.position.y + building.dimensions.height
      };
      
      // Check if within interaction area
      if (
        interactionArea.right > buildingBox.left &&
        interactionArea.left < buildingBox.right &&
        interactionArea.bottom > buildingBox.top &&
        interactionArea.top < buildingBox.bottom
      ) {
        // Show building dialog
        uiManager.showBuildingDialog(buildingId);
        return; // Only interact with one building at a time
      }
    }
  }
}

const characterManager = new CharacterManager();
export default characterManager; 