// Import config settings
import config from '../config.js';

// Keyboard state tracking
const keyboard = {};

// Initialize player state and control
export function initPlayer() {
  // Set up initial player state
  const player = { 
    x: config.character.startPosition.x, 
    y: config.character.startPosition.y,
    width: config.character.frameWidth,
    height: config.character.frameHeight,
    direction: 'down',
    isMoving: false,
    frame: 0
  };
  
  // Set up player sprite
  const playerSprite = {
    frameWidth: config.character.frameWidth,
    frameHeight: config.character.frameHeight,
    totalFrames: config.character.animationFrames,
    frameDelay: 8, // Controls animation speed
    directions: ['down', 'left', 'right', 'up'],
    currentFrame: 0,
    frameCounter: 0
  };
  
  // Set up keyboard event listeners
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
  
  return { player, playerSprite, keyboard };
}

// Handle key down events
function handleKeyDown(event) {
  keyboard[event.key] = true;
}

// Handle key up events
function handleKeyUp(event) {
  keyboard[event.key] = false;
}

// Get current keyboard state
export function getKeyboardState() {
  return keyboard;
}

// Handle player movement based on keyboard input
export function handlePlayerMovement(playerState, deltaTime = 1) {
  const originalX = playerState.x;
  const originalY = playerState.y;
  let moved = false;
  
  const MOVEMENT_SPEED = 3; // hardcoded for now
  
  // Check for movement keys (WASD and arrow keys)
  if (keyboard['w'] || keyboard['ArrowUp']) {
    playerState.y -= MOVEMENT_SPEED * deltaTime;
    playerState.direction = 'up';
    moved = true;
  }
  if (keyboard['s'] || keyboard['ArrowDown']) {
    playerState.y += MOVEMENT_SPEED * deltaTime;
    playerState.direction = 'down';
    moved = true;
  }
  if (keyboard['a'] || keyboard['ArrowLeft']) {
    playerState.x -= MOVEMENT_SPEED * deltaTime;
    playerState.direction = 'left';
    moved = true;
  }
  if (keyboard['d'] || keyboard['ArrowRight']) {
    playerState.x += MOVEMENT_SPEED * deltaTime;
    playerState.direction = 'right';
    moved = true;
  }
  
  // Keep player within bounds
  const WORLD_SIZE = config.map.width; // Using map width as world size
  playerState.x = Math.max(0, Math.min(WORLD_SIZE - playerState.width, playerState.x));
  playerState.y = Math.max(0, Math.min(WORLD_SIZE - playerState.height, playerState.y));
  
  // Update player state
  playerState.isMoving = moved;
  
  // Return movement delta for others to use (like parallax)
  return {
    moved,
    playerState,
    deltaX: playerState.x - originalX,
    deltaY: playerState.y - originalY
  };
}

// Update background parallax based on player movement
export function updateBackgroundLayers(deltaX, deltaZ) {
  const textureLayer = document.getElementById('lower-layer-texture');
  if (!textureLayer) return;
  
  const currentTransform = getComputedStyle(textureLayer).transform;
  
  // Get current transform or set default
  let matrix;
  if (currentTransform && currentTransform !== 'none') {
    matrix = new DOMMatrix(currentTransform);
  } else {
    matrix = new DOMMatrix();
  }
  
  // Update based on movement - we move opposite to player for parallax
  const parallaxFactor = 5; // Amplify the effect a bit
  const newX = matrix.e - (deltaX * parallaxFactor);
  const newY = matrix.f - (deltaZ * parallaxFactor);
  
  // Keep within reasonable bounds
  const boundedX = Math.max(-50, Math.min(50, newX));
  const boundedY = Math.max(-50, Math.min(50, newY));
  
  // Apply new transform
  textureLayer.style.transform = `translate(${boundedX}px, ${boundedY}px)`;
}

// Handle player sprite animation
export function updatePlayerSprite(playerState, playerSpriteState, deltaTime = 1) {
  if (playerState.isMoving) {
    // Update animation frame counter
    playerSpriteState.frameCounter += deltaTime;
    
    // Advance animation frame when counter exceeds delay
    if (playerSpriteState.frameCounter >= playerSpriteState.frameDelay) {
      playerSpriteState.frameCounter = 0;
      playerSpriteState.currentFrame = (playerSpriteState.currentFrame + 1) % playerSpriteState.totalFrames;
    }
  } else {
    // Reset to idle frame
    playerSpriteState.currentFrame = 0;
    playerSpriteState.frameCounter = 0;
  }
  
  // Get direction index
  const directionIndex = playerSpriteState.directions.indexOf(playerState.direction);
  
  // Update sprite element if available
  const spriteElement = document.getElementById('character-sprite');
  if (spriteElement) {
    // Update position
    spriteElement.style.transform = `translate(${playerState.x}px, ${playerState.y}px)`;
    
    // Update sprite frame (would set background-position for sprite sheets)
    // This is placeholder since we don't have the actual sprite sheet handling yet
    // spriteElement.style.backgroundPosition = `-${playerSpriteState.currentFrame * playerSpriteState.frameWidth}px -${directionIndex * playerSpriteState.frameHeight}px`;
  }
  
  return playerSpriteState;
}
