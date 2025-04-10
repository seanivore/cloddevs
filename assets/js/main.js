// === Global references ===
let scene, camera, renderer;
let playerMesh, radioAudio, radioToggle;
let keyboard = {};
let tower;           // radio tower mesh
let welcomeMessageShown = false; // Track if welcome message has been shown

// Game constants
const MOVEMENT_SPEED = 3;
const PLAYER_SIZE = 32;
const INTERACTION_RADIUS = 64;
const WORLD_SIZE = 1024;

// Game state
let player = {
    x: WORLD_SIZE / 2,
    y: WORLD_SIZE / 2,
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    direction: 'down',
    isMoving: false,
    frame: 0
};

let playerSprite = {
    img: null,
    frameWidth: 32,
    frameHeight: 32,
    totalFrames: 4,
    currentFrame: 0,
    frameCounter: 0,
    frameDelay: 8, // Controls animation speed
    directions: ['down', 'left', 'right', 'up']
};

// Input controls
const keys = {
    up: false,
    down: false,
    left: false,
    right: false,
    w: false,
    a: false,
    s: false,
    d: false,
    space: false
};

// Building data with text from BUILDING_CHARACTER.md
const buildingData = [
  {
    id: 'apt',
    position: { x: -15, z: -10 }, // Moved to top left
    color: 0x9E9EB4, // Blue/purple
    title: 'Taller Multi-Story Apartment',
    body: "ZERO MARKETING IN OUR CONTENT FEED.\n\n You earn $CLAUD$ for watching tutorials and reading posts. Tokenization identifies the signal from the noise based on genuine community behavior. No brand can hijack your feed."
  },
  {
    id: 'mcp',
    position: { x: 15, z: -10 }, // Top right
    color: 0x6B9174, // Green
    title: 'Shop-Looking Building (MCP)',
    body: "WE GAMIFIED CODING.\n\n The tools are validated by usage. You earn $CLAUD$ every time you use a minted MCP. Total $CLAUD$ earned by everyone ranks the MCP tools. Knowing what tools are the best is as easy as using your favorites."
  },
  {
    id: 'ai-ide',
    position: { x: -15, z: 10 }, // Bottom left
    color: 0xE8CBB0, // Tan like a house
    title: 'Home with "AI IDE" on Mailbox',
    body: "GET PAID FOR YOUR DATA.\n\n Contribute code or share what you're building. Earn $CLAUD$ for valuable posts. Decentralized community means you keep the revenue; your content grows the ecosystem."
  },
  {
    id: 'gym',
    position: { x: 15, z: 10 }, // Bottom right
    color: 0xF5C0B8, // Light pink
    title: 'Gym-Looking Building with $CLAUD$ on Roof',
    body: "IT'S GAMIFIED SOCIAL MEDIA.\n\n You reply to a post, you share knowledge, you earn $CLAUD$. This self-sustaining community automates curation of development resources and fosters a helpful environment."
  }
];

// This array will store the building meshes after creation
let buildings = [];
// This array will store interactive areas
let interactiveAreas = [];

// === Scene setup ===
function init() {
  const canvas = document.getElementById('sceneCanvas');
  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xDDDDDD, 0); // Transparent background to let CSS layers show

  scene = new THREE.Scene();

  // Isometric-like camera
  const aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
  camera.position.set(0, 40, 40); // Higher up for more top-down view
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // Basic directional light
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(10, 40, 20);
  scene.add(light);

  // Add ambient light for better overall illumination
  const ambientLight = new THREE.AmbientLight(0x404040, 0.7);
  scene.add(ambientLight);

  // Create ground with textured sections
  createGround();

  // === Player mesh (placeholder) ===
  // Will be replaced with a sprite character later
  const playerGeom = new THREE.SphereGeometry(1, 16, 16);
  const playerMat = new THREE.MeshLambertMaterial({ color: 0x3366aa }); // Blue-ish like the pixel character
  playerMesh = new THREE.Mesh(playerGeom, playerMat);
  playerMesh.position.set(0, 1, -5); // Start at top middle of the path
  scene.add(playerMesh);

  // === Create paths ===
  createPaths();

  // === Create buildings from buildingData ===
  buildingData.forEach(data => {
    const building = createBuildingByType(data.id, data.position.x, data.position.z, data.color);
    // attach 'meta' so we know which building it corresponds to
    building.userData = { id: data.id, title: data.title, body: data.body };
    buildings.push(building);
    
    // Create interactive area (stoop) in front of each building
    createInteractiveArea(data.position.x, data.position.z + 6, data.id);
  });

  // === Radio tower (placeholder) ===
  createRadioTower();
  
  // Create interactive area around radio tower
  createInteractiveArea(10, -10, 'radio');

  // === Add decorative flowers ===
  createFlowers();

  // === Add decorative HTML flowers for layer animation ===
  createHTMLFlowers();

  // === Audio reference ===
  radioAudio = document.getElementById("radioAudio");
  radioToggle = document.getElementById("radioToggle");
  radioToggle.addEventListener('click', toggleRadio);

  // === Event listeners ===
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);
  window.addEventListener('resize', onWindowResize);

  // Show welcome message after a short delay
  setTimeout(showWelcomeMessage, 1000);

  animate();
}

// Create ground with different textured sections
function createGround() {
  // Main ground (grass)
  const groundGeom = new THREE.PlaneGeometry(100, 100);
  const groundMat = new THREE.MeshLambertMaterial({ color: 0x88aa88 }); // Grass color
  const ground = new THREE.Mesh(groundGeom, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.1; // Slightly below everything else
  scene.add(ground);
}

// Create path layout - narrower paths connecting buildings
function createPaths() {
  const pathMat = new THREE.MeshLambertMaterial({ color: 0xCCCCCC }); // Light gray path
  
  // Main vertical path (narrower)
  const vertPathGeom = new THREE.PlaneGeometry(5, 30);
  const vertPath = new THREE.Mesh(vertPathGeom, pathMat);
  vertPath.rotation.x = -Math.PI / 2;
  vertPath.position.y = 0.01; // Just above ground
  scene.add(vertPath);
  
  // Horizontal paths to buildings (narrower)
  // Top row
  const topLeftPathGeom = new THREE.PlaneGeometry(15, 3);
  const topLeftPath = new THREE.Mesh(topLeftPathGeom, pathMat);
  topLeftPath.rotation.x = -Math.PI / 2;
  topLeftPath.position.set(-7.5, 0.01, -10); // To top left building
  scene.add(topLeftPath);
  
  const topRightPathGeom = new THREE.PlaneGeometry(15, 3);
  const topRightPath = new THREE.Mesh(topRightPathGeom, pathMat);
  topRightPath.rotation.x = -Math.PI / 2;
  topRightPath.position.set(7.5, 0.01, -10); // To top right building
  scene.add(topRightPath);
  
  // Bottom row
  const bottomLeftPathGeom = new THREE.PlaneGeometry(15, 3);
  const bottomLeftPath = new THREE.Mesh(bottomLeftPathGeom, pathMat);
  bottomLeftPath.rotation.x = -Math.PI / 2;
  bottomLeftPath.position.set(-7.5, 0.01, 10); // To bottom left building
  scene.add(bottomLeftPath);
  
  const bottomRightPathGeom = new THREE.PlaneGeometry(15, 3);
  const bottomRightPath = new THREE.Mesh(bottomRightPathGeom, pathMat);
  bottomRightPath.rotation.x = -Math.PI / 2;
  bottomRightPath.position.set(7.5, 0.01, 10); // To bottom right building
  scene.add(bottomRightPath);
  
  // Path to radio tower
  const radioPathGeom = new THREE.PlaneGeometry(3, 10);
  const radioPath = new THREE.Mesh(radioPathGeom, pathMat);
  radioPath.rotation.x = -Math.PI / 2;
  radioPath.position.set(8.5, 0.01, -5); // Connect to radio tower
  scene.add(radioPath);
}

// Create interactive areas (stoops) that trigger dialogs
function createInteractiveArea(x, z, buildingId) {
  // Dark gray stoop with slight elevation
  const stoopGeom = new THREE.BoxGeometry(4, 0.2, 4);
  const stoopMat = new THREE.MeshLambertMaterial({ color: 0x999999 });
  const stoop = new THREE.Mesh(stoopGeom, stoopMat);
  stoop.position.set(x, 0.1, z); // Slightly raised
  stoop.userData = { buildingId: buildingId }; // Store which building/object this stoop belongs to
  scene.add(stoop);
  
  // Add shadow effect
  const shadowGeom = new THREE.PlaneGeometry(4.4, 4.4);
  const shadowMat = new THREE.MeshBasicMaterial({ 
    color: 0x000000, 
    transparent: true, 
    opacity: 0.2 
  });
  const shadow = new THREE.Mesh(shadowGeom, shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(x, 0.05, z);
  scene.add(shadow);
  
  // Add to interactive areas array for proximity checks
  interactiveAreas.push(stoop);
}

// Create buildings with different styles based on their type
function createBuildingByType(type, x, z, color) {
  switch (type) {
    case 'mcp':
      return createMCPShop(x, z, color);
    case 'apt':
      return createApartmentBuilding(x, z, color);
    case 'ai-ide':
      return createHouseBuilding(x, z, color);
    case 'gym':
      return createGymBuilding(x, z, color);
    default:
      return createGenericBuilding(x, z, color);
  }
}

// Create the MCP shop building (wide storefront with flat roof + angled edges)
function createMCPShop(x, z, color) {
  const group = new THREE.Group();
  
  // Main building box (wider)
  const buildingGeom = new THREE.BoxGeometry(10, 5, 8);
  const buildingMat = new THREE.MeshLambertMaterial({ color });
  const mainBlock = new THREE.Mesh(buildingGeom, buildingMat);
  mainBlock.position.y = 2.5;
  group.add(mainBlock);
  
  // Roof (mostly flat with angled edges)
  const roofGroup = new THREE.Group();
  
  // Main flat roof
  const flatRoofGeom = new THREE.BoxGeometry(8, 0.5, 6);
  const roofMat = new THREE.MeshLambertMaterial({ color: adjustColor(color, -30) });
  const flatRoof = new THREE.Mesh(flatRoofGeom, roofMat);
  flatRoof.position.y = 5.25;
  roofGroup.add(flatRoof);
  
  // Angled edges (front and back)
  const frontEdgeGeom = new THREE.BoxGeometry(10, 1, 1);
  const frontEdge = new THREE.Mesh(frontEdgeGeom, roofMat);
  frontEdge.position.set(0, 5, 3.5);
  frontEdge.rotation.x = Math.PI / 8;
  roofGroup.add(frontEdge);
  
  const backEdgeGeom = new THREE.BoxGeometry(10, 1, 1);
  const backEdge = new THREE.Mesh(backEdgeGeom, roofMat);
  backEdge.position.set(0, 5, -3.5);
  backEdge.rotation.x = -Math.PI / 8;
  roofGroup.add(backEdge);
  
  group.add(roofGroup);
  
  // Large storefront windows
  const windowMat = new THREE.MeshLambertMaterial({ color: 0x88CCFF });
  
  // Left window
  const leftWindowGeom = new THREE.BoxGeometry(3, 2, 0.1);
  const leftWindow = new THREE.Mesh(leftWindowGeom, windowMat);
  leftWindow.position.set(-2.5, 3, 4.05);
  group.add(leftWindow);
  
  // Right window
  const rightWindowGeom = new THREE.BoxGeometry(3, 2, 0.1);
  const rightWindow = new THREE.Mesh(rightWindowGeom, windowMat);
  rightWindow.position.set(2.5, 3, 4.05);
  group.add(rightWindow);
  
  // Door (centered)
  const doorGeom = new THREE.BoxGeometry(2.5, 3.5, 0.2);
  const doorMat = new THREE.MeshLambertMaterial({ color: 0x555555 });
  const door = new THREE.Mesh(doorGeom, doorMat);
  door.position.set(0, 1.75, 4.1);
  group.add(door);
  
  // "MCP" sign above door
  const signGeom = new THREE.BoxGeometry(5, 1, 0.2);
  const signMat = new THREE.MeshLambertMaterial({ color: 0xFFDD44 });
  const sign = new THREE.Mesh(signGeom, signMat);
  sign.position.set(0, 5.5, 4.2);
  group.add(sign);
  
  // Position the building at the specified coordinates
  group.position.set(x, 0, z);
  
  // All buildings face forward (south)
  group.rotation.y = Math.PI;
  
  scene.add(group);
  return group;
}

// Create the apartment building (tall multi-story)
function createApartmentBuilding(x, z, color) {
  const group = new THREE.Group();
  
  // Main tall building
  const buildingGeom = new THREE.BoxGeometry(10, 12, 8);
  const buildingMat = new THREE.MeshLambertMaterial({ color });
  const mainBlock = new THREE.Mesh(buildingGeom, buildingMat);
  mainBlock.position.y = 6;
  group.add(mainBlock);
  
  // Flat roof
  const roofGeom = new THREE.BoxGeometry(11, 0.5, 9);
  const roofMat = new THREE.MeshLambertMaterial({ color: adjustColor(color, -30) });
  const roof = new THREE.Mesh(roofGeom, roofMat);
  roof.position.y = 12.25;
  group.add(roof);
  
  // Windows (4 rows, 2 columns)
  const windowMat = new THREE.MeshLambertMaterial({ color: 0x88CCFF });
  
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 2; col++) {
      const windowGeom = new THREE.BoxGeometry(2, 1.5, 0.1);
      const window = new THREE.Mesh(windowGeom, windowMat);
      window.position.set(-2 + col * 4, 3 + row * 3, 4.05);
      group.add(window);
    }
  }
  
  // Door
  const doorGeom = new THREE.BoxGeometry(2.5, 3.5, 0.2);
  const doorMat = new THREE.MeshLambertMaterial({ color: 0x555555 });
  const door = new THREE.Mesh(doorGeom, doorMat);
  door.position.set(0, 1.75, 4.1);
  group.add(door);
  
  // Position the building at the specified coordinates
  group.position.set(x, 0, z);
  
  // All buildings face forward (south)
  group.rotation.y = Math.PI;
  
  scene.add(group);
  return group;
}

// Create the AI IDE house building
function createHouseBuilding(x, z, color) {
  const group = new THREE.Group();
  
  // Main house building
  const buildingGeom = new THREE.BoxGeometry(9, 5, 8);
  const buildingMat = new THREE.MeshLambertMaterial({ color });
  const mainBlock = new THREE.Mesh(buildingGeom, buildingMat);
  mainBlock.position.y = 2.5;
  group.add(mainBlock);
  
  // Pitched roof (triangular)
  const roofGeometry = new THREE.ConeGeometry(6, 4, 4);
  const roofMat = new THREE.MeshLambertMaterial({ color: adjustColor(color, -40) });
  const roof = new THREE.Mesh(roofGeometry, roofMat);
  roof.rotation.y = Math.PI / 4; // Rotate to get the right orientation
  roof.position.y = 7; // Position on top of the building
  group.add(roof);
  
  // Windows (2 on front, symmetrical)
  const windowMat = new THREE.MeshLambertMaterial({ color: 0x88CCFF });
  
  // Left window
  const leftWindowGeom = new THREE.BoxGeometry(2, 2, 0.1);
  const leftWindow = new THREE.Mesh(leftWindowGeom, windowMat);
  leftWindow.position.set(-2.5, 3, 4.05);
  group.add(leftWindow);
  
  // Right window
  const rightWindowGeom = new THREE.BoxGeometry(2, 2, 0.1);
  const rightWindow = new THREE.Mesh(rightWindowGeom, windowMat);
  rightWindow.position.set(2.5, 3, 4.05);
  group.add(rightWindow);
  
  // Door
  const doorGeom = new THREE.BoxGeometry(2, 3, 0.2);
  const doorMat = new THREE.MeshLambertMaterial({ color: 0x8B4513 }); // Brown wooden door
  const door = new THREE.Mesh(doorGeom, doorMat);
  door.position.set(0, 1.5, 4.1);
  group.add(door);
  
  // Mailbox with "AI IDE" sign
  const mailboxGeom = new THREE.BoxGeometry(1, 1, 0.8);
  const mailboxMat = new THREE.MeshLambertMaterial({ color: 0x3366AA });
  const mailbox = new THREE.Mesh(mailboxGeom, mailboxMat);
  mailbox.position.set(-3.5, 1, 3.5);
  group.add(mailbox);
  
  // Sign on mailbox
  const signGeom = new THREE.BoxGeometry(1, 0.5, 0.1);
  const signMat = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
  const sign = new THREE.Mesh(signGeom, signMat);
  sign.position.set(-3.5, 1.6, 3.5);
  group.add(sign);
  
  // Position the building at the specified coordinates
  group.position.set(x, 0, z);
  
  // All buildings face forward (south)
  group.rotation.y = Math.PI;
  
  scene.add(group);
  return group;
}

// Create the gym building (long with tall windows)
function createGymBuilding(x, z, color) {
  const group = new THREE.Group();
  
  // Main building (wider than tall)
  const buildingGeom = new THREE.BoxGeometry(15, 6, 8);
  const buildingMat = new THREE.MeshLambertMaterial({ color });
  const mainBlock = new THREE.Mesh(buildingGeom, buildingMat);
  mainBlock.position.y = 3;
  group.add(mainBlock);
  
  // Flat roof
  const roofGeom = new THREE.BoxGeometry(15.5, 0.5, 8.5);
  const roofMat = new THREE.MeshLambertMaterial({ color: adjustColor(color, -30) });
  const roof = new THREE.Mesh(roofGeom, roofMat);
  roof.position.y = 6.25;
  group.add(roof);
  
  // Windows (tall windows typical of a gym)
  const windowMat = new THREE.MeshLambertMaterial({ color: 0x88CCFF });
  
  // 4 tall windows across the front
  for (let i = 0; i < 4; i++) {
    const windowGeom = new THREE.BoxGeometry(2, 4, 0.1);
    const window = new THREE.Mesh(windowGeom, windowMat);
    window.position.set(-6 + i * 4, 3, 4.05);
    group.add(window);
  }
  
  // Double doors in center
  const doorGeom = new THREE.BoxGeometry(3, 4, 0.2);
  const doorMat = new THREE.MeshLambertMaterial({ color: 0x555555 });
  const door = new THREE.Mesh(doorGeom, doorMat);
  door.position.set(0, 2, 4.1);
  group.add(door);
  
  // "$CLAUD$" sign on roof
  const signGeom = new THREE.BoxGeometry(8, 1, 0.2);
  const signMat = new THREE.MeshLambertMaterial({ color: 0xFFDD44 });
  const sign = new THREE.Mesh(signGeom, signMat);
  sign.position.set(0, 6.6, 0);
  group.add(sign);
  
  // Position the building at the specified coordinates
  group.position.set(x, 0, z);
  
  // All buildings face forward (south)
  group.rotation.y = Math.PI;
  
  scene.add(group);
  return group;
}

// Create radio tower near the starting point
function createRadioTower() {
  const group = new THREE.Group();
  
  // Base
  const baseGeom = new THREE.CylinderGeometry(2, 2, 1, 16);
  const baseMat = new THREE.MeshLambertMaterial({ color: 0x888888 });
  const base = new THREE.Mesh(baseGeom, baseMat);
  base.position.y = 0.5;
  group.add(base);
  
  // Tower structure - thinner at top
  const towerGeom = new THREE.CylinderGeometry(1, 1.5, 12, 16);
  const towerMat = new THREE.MeshLambertMaterial({ color: 0x666666 });
  const towerBase = new THREE.Mesh(towerGeom, towerMat);
  towerBase.position.y = 7;
  group.add(towerBase);
  
  // Antenna
  const antennaGeom = new THREE.CylinderGeometry(0.1, 0.1, 5, 8);
  const antennaMat = new THREE.MeshLambertMaterial({ color: 0x444444 });
  const antenna = new THREE.Mesh(antennaGeom, antennaMat);
  antenna.position.y = 15.5;
  group.add(antenna);
  
  // Ball on top
  const ballGeom = new THREE.SphereGeometry(0.5, 16, 16);
  const ballMat = new THREE.MeshLambertMaterial({ color: 0xffff00 });
  const ball = new THREE.Mesh(ballGeom, ballMat);
  ball.position.y = 18;
  group.add(ball);
  
  // Position tower
  group.position.set(10, 0, -10);
  scene.add(group);
  tower = group;
}

// Create decorative flowers
function createFlowers() {
  // Create 30 random flowers
  for (let i = 0; i < 30; i++) {
    // Random position (avoiding paths)
    let x, z;
    do {
      x = Math.random() * 80 - 40;
      z = Math.random() * 80 - 40;
    } while (isOnPath(x, z));
    
    const flowerGroup = new THREE.Group();
    
    // Stem
    const stemGeom = new THREE.CylinderGeometry(0.1, 0.1, 1, 8);
    const stemMat = new THREE.MeshLambertMaterial({ color: 0x00AA00 });
    const stem = new THREE.Mesh(stemGeom, stemMat);
    stem.position.y = 0.5;
    flowerGroup.add(stem);
    
    // Blossom
    const blossomGeom = new THREE.SphereGeometry(0.3, 8, 8);
    const blossomMat = new THREE.MeshLambertMaterial({ color: 0xFF99AA }); // Pink flowers
    const blossom = new THREE.Mesh(blossomGeom, blossomMat);
    blossom.position.y = 1.1;
    flowerGroup.add(blossom);
    
    flowerGroup.position.set(x, 0, z);
    scene.add(flowerGroup);
    
    // Animate this flower
    animateFlower(flowerGroup);
  }
}

// Check if a position is on a path
function isOnPath(x, z) {
  // Main vertical path
  if (Math.abs(x) < 5 && z > -25 && z < 25) return true;
  // Horizontal paths
  if (z > 7.5 && z < 12.5 && x < 0 && x > -15) return true; // Top left
  if (z > 7.5 && z < 12.5 && x > 0 && x < 15) return true; // Top right
  if (z > 22.5 && z < 27.5 && x < 0 && x > -15) return true; // Bottom left
  if (z > 22.5 && z < 27.5 && x > 0 && x < 15) return true; // Bottom right
  // Buildings
  if (Math.abs(x - -15) < 5 && Math.abs(z - 10) < 5) return true; // Top left building
  if (Math.abs(x - 15) < 5 && Math.abs(z - 10) < 5) return true; // Top right building
  if (Math.abs(x - -15) < 5 && Math.abs(z - 25) < 5) return true; // Bottom left building
  if (Math.abs(x - 15) < 5 && Math.abs(z - 25) < 5) return true; // Bottom right building
  return false;
}

// Animate a flower with bobbing motion
function animateFlower(flower) {
  // Random starting phase and speed for natural variation
  const phase = Math.random() * Math.PI * 2;
  const speed = 0.5 + Math.random() * 1.5;
  
  // Store animation data
  flower.userData = {
    phase: phase,
    speed: speed,
    baseY: flower.position.y
  };
}

// Adjust a color by adding an amount to it
function adjustColor(color, amount) {
  const r = ((color >> 16) & 255) + amount;
  const g = ((color >> 8) & 255) + amount;
  const b = (color & 255) + amount;
  
  return (Math.min(255, Math.max(0, r)) << 16) + 
         (Math.min(255, Math.max(0, g)) << 8) + 
         Math.min(255, Math.max(0, b));
}

// Create HTML flowers for the lower-layer-art
function createHTMLFlowers() {
  const flowerLayer = document.getElementById('lower-layer-art');
  
  // Create 20 flowers
  for (let i = 0; i < 20; i++) {
    const flower = document.createElement('div');
    flower.className = 'pixel-flower';
    
    // Random position
    const x = Math.random() * 90 + 5; // 5-95% of width
    const y = Math.random() * 90 + 5; // 5-95% of height
    
    // Random animation delay for natural look
    const delay = Math.random() * 2;
    
    flower.style.left = `${x}%`;
    flower.style.top = `${y}%`;
    flower.style.animationDelay = `${delay}s`;
    
    flowerLayer.appendChild(flower);
  }
}

// === Animate loop ===
function animate() {
  requestAnimationFrame(animate);

  // Handle player movement and related effects
  handlePlayerMovement();
  
  // Check proximity to buildings
  checkProximity();

  // Move camera to follow player
  updateCamera();

  renderer.render(scene, camera);
}

// Handle player movement and parallax effects
function handlePlayerMovement() {
  let moved = false;
  const speed = 0.2;
  const originalX = playerMesh.position.x;
  const originalZ = playerMesh.position.z;
  
  if (keyboard['w'] || keyboard['ArrowUp']) {
    playerMesh.position.z -= speed;
    moved = true;
  }
  if (keyboard['s'] || keyboard['ArrowDown']) {
    playerMesh.position.z += speed;
    moved = true;
  }
  if (keyboard['a'] || keyboard['ArrowLeft']) {
    playerMesh.position.x -= speed;
    moved = true;
  }
  if (keyboard['d'] || keyboard['ArrowRight']) {
    playerMesh.position.x += speed;
    moved = true;
  }
  
  // If player moved, update the background layers (parallax effect)
  if (moved) {
    const deltaX = playerMesh.position.x - originalX;
    const deltaZ = playerMesh.position.z - originalZ;
    
    updateBackgroundLayers(deltaX, deltaZ);
  }
  
  // Animate flowers in the 3D scene
  scene.traverse(function(obj) {
    if (obj.isGroup && obj.userData && obj.userData.phase !== undefined) {
      const time = Date.now() * 0.001;
      // Bobbing motion
      obj.position.y = obj.userData.baseY + Math.sin(time * obj.userData.speed + obj.userData.phase) * 0.1;
    }
  });
}

// Update background layers for parallax effect
function updateBackgroundLayers(deltaX, deltaZ) {
  const textureLayer = document.getElementById('lower-layer-texture');
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

// Check proximity to interactive elements
function checkProximity() {
  // Check proximity to interactive areas (stoops)
  interactiveAreas.forEach(area => {
    const dist = area.position.distanceTo(playerMesh.position);
    if (dist < 3) {
      // Determine which building or object this area belongs to
      const buildingId = area.userData.buildingId;
      
      if (buildingId === 'radio') {
        // Radio tower interaction
        showPopup('towerInfo');
      } else {
        // Building interaction - find the matching building
        const building = buildings.find(b => b.userData.id === buildingId);
        if (building) {
          showBuildingInfo(building.userData.title, building.userData.body);
        }
      }
    }
  });
}

// Update camera position to follow player
function updateCamera() {
  camera.position.x = playerMesh.position.x;
  camera.position.z = playerMesh.position.z + 30;
  camera.lookAt(playerMesh.position);
}

// === Keyboard ===
function onKeyDown(event) {
  keyboard[event.key] = true;
  
  // If Space is pressed and welcome message is showing, hide it
  if (event.key === ' ' && welcomeMessageShown) {
    hideWelcomeMessage();
  }
  
  // hide popups when user moves away
  hidePopup('genericBuildingPopup');
  hidePopup('towerInfo');
}
function onKeyUp(event) {
  keyboard[event.key] = false;
}

// === Radio ===
function toggleRadio() {
  if (!radioOn) {
    radioAudio.play();
    radioToggle.textContent = "Radio: ON";
    showPopup('towerInfo');
    startTranscriptDisplay();
  } else {
    radioAudio.pause();
    radioToggle.textContent = "Radio: OFF";
    hidePopup('towerInfo');
    stopTranscriptDisplay();
  }
  radioOn = !radioOn;
}

// Sample transcript with timestamps
const transcript = [
  { time: 2, text: "Welcome to the Deep Dive podcast..." },
  { time: 6, text: "Today we're exploring the $CLAUD Protocol..." },
  { time: 10, text: "A revolutionary approach to AI developer communities..." },
  { time: 14, text: "Where tokenization validates and curates content..." },
  { time: 18, text: "Instead of traditional marketing dynamics..." }
  // Add more transcript entries as needed
];

let transcriptTimer;

// Display transcript based on audio playback position
function startTranscriptDisplay() {
  const transcriptElement = document.getElementById('transcriptText');
  transcriptElement.innerHTML = "Transcript loading...";
  
  transcriptTimer = setInterval(() => {
    const currentTime = Math.floor(radioAudio.currentTime);
    
    // Find the current transcript segment
    const currentSegment = transcript.filter(seg => seg.time <= currentTime)
      .sort((a, b) => b.time - a.time)[0];
    
    if (currentSegment) {
      transcriptElement.innerHTML = currentSegment.text;
    }
  }, 500);
}

// Stop transcript display
function stopTranscriptDisplay() {
  if (transcriptTimer) {
    clearInterval(transcriptTimer);
    transcriptTimer = null;
  }
}

// Show building-specific popup
function showBuildingInfo(title, body) {
  document.getElementById('popupTitle').textContent = title;
  document.getElementById('popupBody').textContent = body;
  showPopup('genericBuildingPopup');
}

function showPopup(id) {
  document.getElementById(id).style.display = 'block';
}
function hidePopup(id) {
  document.getElementById(id).style.display = 'none';
}

// === Resize ===
function onWindowResize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

// Show the welcome message dialog
function showWelcomeMessage() {
  if (!welcomeMessageShown) {
    document.getElementById('welcomeMessage').style.display = 'block';
    welcomeMessageShown = true;
  }
}

// Hide the welcome message dialog
function hideWelcomeMessage() {
  document.getElementById('welcomeMessage').style.display = 'none';
}

// === Start ===
window.onload = init;