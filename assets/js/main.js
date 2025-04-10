// === Global references ===
let scene, camera, renderer;
let playerMesh, radioAudio, radioToggle;
let keyboard = {};
let tower;           // radio tower mesh
let radioOn = false;
let welcomeMessageShown = false; // Track if welcome message has been shown

// Building data with text from BUILDING_CHARACTER.md
const buildingData = [
  {
    id: 'mcp',
    position: { x: -15, z: 10 },
    color: 0xF5C0B8, // Pink building (top left in image)
    title: 'Shop-Looking Building (MCP)',
    body: "WE GAMIFIED CODING.\n\n The tools are validated by usage. You earn $CLAUD$ every time you use a minted MCP. Total $CLAUD$ earned by everyone ranks the MCP tools. Knowing what tools are the best is as easy as using your favorites."
  },
  {
    id: 'apt',
    position: { x: 15, z: 10 },
    color: 0xDDCCAA, // Tan building (top right in image)
    title: 'Taller Multi-Story Apartment',
    body: "ZERO MARKETING IN OUR CONTENT FEED.\n\n You earn $CLAUD$ for watching tutorials and reading posts. Tokenization identifies the signal from the noise based on genuine community behavior. No brand can hijack your feed."
  },
  {
    id: 'ai-ide',
    position: { x: -15, z: 25 },
    color: 0xCEEAD6, // Light green building (bottom left in image)
    title: 'Home with "AI IDE" on Mailbox',
    body: "GET PAID FOR YOUR DATA.\n\n Contribute code or share what you're building. Earn $CLAUD$ for valuable posts. Decentralized community means you keep the revenue; your content grows the ecosystem."
  },
  {
    id: 'gym',
    position: { x: 15, z: 25 },
    color: 0xCCCCDD, // Gray/blue building (bottom right in image)
    title: 'Gym-Looking Building with $CLAUD$ on Roof',
    body: "IT'S GAMIFIED SOCIAL MEDIA.\n\n You reply to a post, you share knowledge, you earn $CLAUD$. This self-sustaining community automates curation of development resources and fosters a helpful environment."
  }
];

// This array will store the building meshes after creation
let buildings = [];

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
    const building = createBuilding(data.position.x, data.position.z, data.color);
    // attach 'meta' so we know which building it corresponds to
    building.userData = { id: data.id, title: data.title, body: data.body };
    buildings.push(building);
  });

  // === Radio tower (placeholder) ===
  createRadioTower();

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
  // Main ground
  const groundGeom = new THREE.PlaneGeometry(100, 100);
  const groundMat = new THREE.MeshLambertMaterial({ color: 0xAAAAAA }); // Gray base
  const ground = new THREE.Mesh(groundGeom, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.1; // Slightly below everything else
  scene.add(ground);
  
  // Textured overlay for decoration
  const decorGeom = new THREE.PlaneGeometry(90, 90);
  const decorMat = new THREE.MeshLambertMaterial({ 
    color: 0xEEEEEE,
    transparent: true,
    opacity: 0.5
  });
  const decorGround = new THREE.Mesh(decorGeom, decorMat);
  decorGround.rotation.x = -Math.PI / 2;
  decorGround.position.y = -0.05; // Just above the main ground
  scene.add(decorGround);
}

// Create path layout
function createPaths() {
  // Main vertical path
  const vertPathGeom = new THREE.PlaneGeometry(10, 50);
  const pathMat = new THREE.MeshLambertMaterial({ color: 0xCCCCCC }); // Light gray path
  const vertPath = new THREE.Mesh(vertPathGeom, pathMat);
  vertPath.rotation.x = -Math.PI / 2;
  vertPath.position.y = 0.01; // Just above ground
  scene.add(vertPath);
  
  // Horizontal paths connecting to buildings
  const leftPathGeom = new THREE.PlaneGeometry(15, 5);
  const leftPath1 = new THREE.Mesh(leftPathGeom, pathMat);
  leftPath1.rotation.x = -Math.PI / 2;
  leftPath1.position.set(-7.5, 0.01, 10); // Top left
  scene.add(leftPath1);
  
  const leftPath2 = new THREE.Mesh(leftPathGeom, pathMat);
  leftPath2.rotation.x = -Math.PI / 2;
  leftPath2.position.set(-7.5, 0.01, 25); // Bottom left
  scene.add(leftPath2);
  
  const rightPathGeom = new THREE.PlaneGeometry(15, 5);
  const rightPath1 = new THREE.Mesh(rightPathGeom, pathMat);
  rightPath1.rotation.x = -Math.PI / 2;
  rightPath1.position.set(7.5, 0.01, 10); // Top right
  scene.add(rightPath1);
  
  const rightPath2 = new THREE.Mesh(rightPathGeom, pathMat);
  rightPath2.rotation.x = -Math.PI / 2;
  rightPath2.position.set(7.5, 0.01, 25); // Bottom right
  scene.add(rightPath2);
}

// Create buildings with more detailed shapes
function createBuilding(x, z, color) {
  const group = new THREE.Group();
  
  // Main building box
  const height = 5 + Math.random() * 2; // Slight height variation
  const geom = new THREE.BoxGeometry(8, height, 8);
  const mat = new THREE.MeshLambertMaterial({ color });
  const mainBlock = new THREE.Mesh(geom, mat);
  mainBlock.position.y = height/2;
  group.add(mainBlock);
  
  // Roof
  const roofGeom = new THREE.BoxGeometry(9, 1, 9);
  const roofMat = new THREE.MeshLambertMaterial({ color: adjustColor(color, -30) }); // Darker
  const roof = new THREE.Mesh(roofGeom, roofMat);
  roof.position.y = height + 0.5;
  group.add(roof);
  
  // Door
  const doorGeom = new THREE.BoxGeometry(2, 3, 0.2);
  const doorMat = new THREE.MeshLambertMaterial({ color: 0x555555 });
  const door = new THREE.Mesh(doorGeom, doorMat);
  door.position.set(0, 1.5, 4.1); // Front of building
  group.add(door);
  
  // Windows (2 on front)
  const windowGeom = new THREE.BoxGeometry(1.5, 1.5, 0.1);
  const windowMat = new THREE.MeshLambertMaterial({ color: 0x88CCFF });
  
  const window1 = new THREE.Mesh(windowGeom, windowMat);
  window1.position.set(-2, height/2 + 1, 4.1);
  group.add(window1);
  
  const window2 = new THREE.Mesh(windowGeom, windowMat);
  window2.position.set(2, height/2 + 1, 4.1);
  group.add(window2);
  
  // Position the whole building
  group.position.set(x, 0, z);
  
  // Rotate to face the path
  if (x < 0) {
    group.rotation.y = Math.PI/2; // Left side buildings
  } else {
    group.rotation.y = -Math.PI/2; // Right side buildings
  }
  
  scene.add(group);
  return group;
}

// Create radio tower near the starting point
function createRadioTower() {
  const group = new THREE.Group();
  
  // Base
  const baseGeom = new THREE.BoxGeometry(4, 1, 4);
  const baseMat = new THREE.MeshLambertMaterial({ color: 0x888888 });
  const base = new THREE.Mesh(baseGeom, baseMat);
  base.position.y = 0.5;
  group.add(base);
  
  // Tower structure
  const towerGeom = new THREE.BoxGeometry(2, 8, 2);
  const towerMat = new THREE.MeshLambertMaterial({ color: 0x666666 });
  const towerBase = new THREE.Mesh(towerGeom, towerMat);
  towerBase.position.y = 5;
  group.add(towerBase);
  
  // Antenna
  const antennaGeom = new THREE.CylinderGeometry(0.1, 0.1, 5, 8);
  const antennaMat = new THREE.MeshLambertMaterial({ color: 0x444444 });
  const antenna = new THREE.Mesh(antennaGeom, antennaMat);
  antenna.position.y = 11.5;
  group.add(antenna);
  
  // Ball on top
  const ballGeom = new THREE.SphereGeometry(0.5, 16, 16);
  const ballMat = new THREE.MeshLambertMaterial({ color: 0xffff00 });
  const ball = new THREE.Mesh(ballGeom, ballMat);
  ball.position.y = 14;
  group.add(ball);
  
  // Position tower to the right of the path at the top
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
  // Check proximity to each building
  buildings.forEach(bldg => {
    const dist = bldg.position.distanceTo(playerMesh.position);
    if (dist < 6) {
      // Show building info from building.userData
      showBuildingInfo(bldg.userData.title, bldg.userData.body);
    }
  });

  // Check proximity to tower
  const towerDist = tower.position.distanceTo(playerMesh.position);
  if (towerDist < 6) {
    showPopup('towerInfo');
  }
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