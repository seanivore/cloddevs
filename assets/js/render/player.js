// Import config settings
import config from '../config.js';

// Create the player mesh for rendering
export function createPlayerMesh(scene) {
  // Simple placeholder sphere for now
  const playerGeom = new THREE.SphereGeometry(1, 16, 16);
  const playerMat = new THREE.MeshLambertMaterial({ color: 0x3366aa }); // Hard-coded player color
  const playerMesh = new THREE.Mesh(playerGeom, playerMat);
  playerMesh.position.set(0, 1, -5); // Start at top middle of the path
  scene.add(playerMesh);
  
  return playerMesh;
}

// Update player visuals based on state
export function updatePlayerVisuals(playerMesh, playerState) {
  // Position the mesh at the player's current position
  playerMesh.position.x = playerState.x;
  playerMesh.position.z = playerState.y;
  
  // This will be expanded later with animations and direction changes
  // For now, it's a simple position update
}

// Update camera to follow player
export function updateCamera(camera, playerMesh) {
  camera.position.x = playerMesh.position.x;
  camera.position.z = playerMesh.position.z + 30;
  camera.lookAt(playerMesh.position);
}

// Animate player's movement
export function animatePlayer(playerState, keyboardState, deltaTime) {
  // Check if player is moving
  const isMoving = 
    keyboardState.w || 
    keyboardState.a || 
    keyboardState.s || 
    keyboardState.d || 
    keyboardState.ArrowUp || 
    keyboardState.ArrowDown || 
    keyboardState.ArrowLeft || 
    keyboardState.ArrowRight;
  
  // Update player's moving state
  playerState.isMoving = isMoving;
  
  const MOVEMENT_SPEED = 3; // hardcoded for now
  
  if (isMoving) {
    // Determine direction based on keys
    if (keyboardState.w || keyboardState.ArrowUp) {
      playerState.direction = 'up';
      playerState.y -= MOVEMENT_SPEED * deltaTime;
    }
    if (keyboardState.s || keyboardState.ArrowDown) {
      playerState.direction = 'down';
      playerState.y += MOVEMENT_SPEED * deltaTime;
    }
    if (keyboardState.a || keyboardState.ArrowLeft) {
      playerState.direction = 'left';
      playerState.x -= MOVEMENT_SPEED * deltaTime;
    }
    if (keyboardState.d || keyboardState.ArrowRight) {
      playerState.direction = 'right';
      playerState.x += MOVEMENT_SPEED * deltaTime;
    }
    
    // Keep player within bounds
    const WORLD_SIZE = config.map.width; // Using map width as world size
    playerState.x = Math.max(0, Math.min(WORLD_SIZE - playerState.width, playerState.x));
    playerState.y = Math.max(0, Math.min(WORLD_SIZE - playerState.height, playerState.y));
    
    // Update animation frame
    playerState.frameCounter = (playerState.frameCounter + 1) % playerState.frameDelay;
    if (playerState.frameCounter === 0) {
      playerState.currentFrame = (playerState.currentFrame + 1) % playerState.totalFrames;
    }
  } else {
    // Reset animation to idle frame when not moving
    playerState.currentFrame = 0;
    playerState.frameCounter = 0;
  }
  
  return playerState;
}
