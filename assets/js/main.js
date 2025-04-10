// Import modules
import config from './config.js';
import buildingData from './buildingData.js';
import * as BuildingRenderer from './render/buildings.js';
import * as Environment from './render/environment.js';
import * as PlayerRenderer from './render/player.js';
import * as Dialogs from './ui/dialogs.js';
import * as Effects from './ui/effects.js';
import * as PlayerController from './interaction/player.js';
import * as ProximitySystem from './interaction/proximity.js';
import * as RadioSystem from './interaction/radio.js';
import keypadManager from './keypads.js';

// Global references
let scene, camera, renderer;
let playerMesh, tower;
let buildings = [];
let interactiveAreas = [];
let lastTime = 0;
let welcomeMessageShown = false;

// Game state
let gameState = {
  player: null,
  playerSprite: null,
  keyboard: null,
  interactable: null
};

// === Scene setup ===
function init() {
  const canvas = document.getElementById('sceneCanvas');
  renderer = new THREE.WebGLRenderer({ 
    canvas, 
    alpha: true, 
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x88aa88, 1); // Set a grass-colored background

  scene = new THREE.Scene();

  // Isometric-like camera - positioned higher for a more zoomed out view
  const aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(
    45, 
    aspect, 
    0.1, 
    1000
  );
  camera.position.set(0, 80, 80); // Positioned much higher to see more of the town
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // Basic directional light
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(10, 40, 20);
  scene.add(light);

  // Add ambient light for better overall illumination
  const ambientLight = new THREE.AmbientLight(0x404040, 0.7);
  scene.add(ambientLight);

  // Initialize game world
  initializeWorld();
  
  // Initialize player
  initializePlayer();
  
  // Initialize UI
  initializeUI();
  
  // Show welcome message after a short delay
  setTimeout(() => {
    Dialogs.showWelcomeMessage();
    welcomeMessageShown = true;
  }, 1000);

  // Set up window resize handler
  window.addEventListener('resize', onWindowResize);
  
  // Start game loop
  lastTime = performance.now();
  animate();
}

// Initialize the game world
function initializeWorld() {
  // Create ground
  Environment.createGround(scene);
  
  // Create paths
  Environment.createPaths(scene);
  
  // Create buildings from buildingData
  Object.values(buildingData).forEach(data => {
    const building = BuildingRenderer.createBuildingByType(scene, data.id, data.position.x, data.position.z, data.color);
    // Attach 'meta' so we know which building it corresponds to
    building.userData = { 
      id: data.id, 
      title: data.name, 
      body: data.description 
    };
    buildings.push(building);
    
    // Create interactive area (stoop) in front of each building
    const interactiveArea = Environment.createInteractiveArea(scene, data.position.x, data.position.z + 6, data.id);
    interactiveAreas.push(interactiveArea);
  });
  
  // Create radio tower
  tower = BuildingRenderer.createRadioTower(scene);
  
  // Create interactive area around radio tower
  const radioArea = Environment.createInteractiveArea(scene, 10, -10, 'radio');
  interactiveAreas.push(radioArea);
  
  // Add decorative flowers
  Environment.createFlowers(scene);
  
  // Add decorative HTML flowers
  Environment.createHTMLFlowers();
}

// Initialize player
function initializePlayer() {
  // Create player controller
  const playerControllerState = PlayerController.initPlayer();
  gameState.player = playerControllerState.player;
  gameState.playerSprite = playerControllerState.playerSprite;
  gameState.keyboard = playerControllerState.keyboard;
  
  // Create player mesh
  playerMesh = PlayerRenderer.createPlayerMesh(scene);
}

// Initialize UI
function initializeUI() {
  // Initialize dialog system
  Dialogs.initDialogs();
  
  // Initialize radio
  RadioSystem.initRadio();
  
  // Initialize UI effects
  Effects.initUIEffects();
  
  // Initialize keypad manager
  keypadManager.init();
}

// === Window resize ===
function onWindowResize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

// === Animate loop ===
function animate(currentTime) {
  requestAnimationFrame(animate);
  
  // Calculate delta time for smooth animations
  const deltaTime = (currentTime - lastTime) / 1000; // convert to seconds
  lastTime = currentTime;
  
  // Update player movement
  const movement = PlayerController.handlePlayerMovement(gameState.player, deltaTime);
  
  // Update player visuals
  if (movement.moved) {
    PlayerRenderer.updatePlayerVisuals(playerMesh, gameState.player);
    PlayerController.updateBackgroundLayers(movement.deltaX, movement.deltaY);
  }
  
  // Update player sprite animation
  PlayerController.updatePlayerSprite(gameState.player, gameState.playerSprite, deltaTime);
  
  // Check proximity to interactive elements
  gameState.interactable = ProximitySystem.checkProximity(playerMesh, interactiveAreas, buildings);
  
  // Update interactive highlight
  const interactiveHighlight = document.getElementById('interactiveHighlight');
  ProximitySystem.updateInteractiveHighlight(interactiveHighlight, gameState.interactable, buildings);
  
  // Update camera to follow player
  PlayerRenderer.updateCamera(camera, playerMesh);
  
  // Render scene
  renderer.render(scene, camera);
}

// Start the game when window loads
window.onload = init;