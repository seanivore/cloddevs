// === Global references ===
let scene, camera, renderer;
let playerMesh, radioAudio, radioToggle;
let keyboard = {};
let tower;           // radio tower mesh
let radioOn = false;

// Building data with text from BUILDING_CHARACTER.md
const buildingData = [
  {
    id: 'mcp',
    position: { x: -10, z: 10 },
    color: 0x4466aa,
    title: 'Shop-Looking Building (MCP)',
    body: "WE GAMIFIED CODING.\n\n The tools are validated by usage. You earn $CLAUD$ every time you use a minted MCP. Total $CLAUD$ earned by everyone ranks the MCP tools. Knowing what tools are the best is as easy as using your favorites."
  },
  {
    id: 'apt',
    position: { x: 0, z: 10 },
    color: 0xaa6644,
    title: 'Taller Multi-Story Apartment',
    body: "ZERO MARKETING IN OUR CONTENT FEED.\n\n You earn $CLAUD$ for watching tutorials and reading posts. Tokenization identifies the signal from the noise based on genuine community behavior. No brand can hijack your feed."
  },
  {
    id: 'ai-ide',
    position: { x: 10, z: 10 },
    color: 0x22bb99,
    title: 'Home with "AI IDE" on Mailbox',
    body: "GET PAID FOR YOUR DATA.\n\n Contribute code or share what you're building. Earn $CLAUD$ for valuable posts. Decentralized community means you keep the revenue; your content grows the ecosystem."
  },
  {
    id: 'gym',
    position: { x: -5, z: 20 },
    color: 0xdd9933,
    title: 'Gym-Looking Building with $CLAUD$ on Roof',
    body: "IT'S GAMIFIED SOCIAL MEDIA.\n\n You reply to a post, you share knowledge, you earn $CLAUD$. This self-sustaining community automates curation of development resources and fosters a helpful environment."
  },
  {
    id: 'community',
    position: { x: 5, z: 20 },
    color: 0x9944dd,
    title: 'Community Center',
    body: "DEVELOPER-OWNED ECOSYSTEM.\n\n The community collectively owns the most comprehensive map of AI development patterns ever created. This knowledge graph is a crystal ball for the future of development that benefits those who create it."
  }
];

// This array will store the building meshes after creation
let buildings = [];

// === Scene setup ===
function init() {
  const canvas = document.getElementById('sceneCanvas');
  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  scene = new THREE.Scene();

  // Isometric-ish camera: mild perspective
  const aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 1000);
  camera.position.set(0, 50, 50);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // Basic directional light
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(10, 40, 20);
  scene.add(light);

  // Add ambient light for better overall illumination
  const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
  scene.add(ambientLight);

  // === Ground plane ===
  const groundGeom = new THREE.PlaneGeometry(100, 100);
  const groundMat = new THREE.MeshLambertMaterial({ color: 0x88aa88 });
  const ground = new THREE.Mesh(groundGeom, groundMat);
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  // === Player mesh (placeholder) ===
  // a tiny sphere that moves around
  const playerGeom = new THREE.SphereGeometry(1, 16, 16);
  const playerMat = new THREE.MeshLambertMaterial({ color: 0xff6666 });
  playerMesh = new THREE.Mesh(playerGeom, playerMat);
  playerMesh.position.set(0, 1, 0); // Start at top middle
  scene.add(playerMesh);

  // === Create walkway ===
  const walkwayGeom = new THREE.BoxGeometry(10, 0.3, 40);
  const walkwayMat = new THREE.MeshLambertMaterial({ color: 0xcccccc });
  const walkway = new THREE.Mesh(walkwayGeom, walkwayMat);
  walkway.position.set(0, 0.15, 10); // Position the walkway
  scene.add(walkway);

  // === Create buildings from buildingData ===
  buildingData.forEach(data => {
    const building = makeBuilding(data.position.x, data.position.z, data.color);
    // attach 'meta' so we know which building it corresponds to
    building.userData = { id: data.id, title: data.title, body: data.body };
    buildings.push(building);
  });

  // === Radio tower (placeholder) ===
  const towerGroup = new THREE.Group();
  const towerBaseGeom = new THREE.CylinderGeometry(0.5, 0.5, 8, 12);
  const towerMat = new THREE.MeshLambertMaterial({ color: 0xffff66 });
  const towerBase = new THREE.Mesh(towerBaseGeom, towerMat);
  towerBase.position.set(0, 4, 0);
  towerGroup.add(towerBase);

  // Antenna top
  const antennaGeom = new THREE.ConeGeometry(1, 2, 6);
  const antenna = new THREE.Mesh(antennaGeom, towerMat);
  antenna.position.set(0, 8, 0);
  towerGroup.add(antenna);

  towerGroup.position.set(15, 0, -10); // Position to the right of the starting point
  scene.add(towerGroup);
  tower = towerGroup;

  // === Audio reference ===
  radioAudio = document.getElementById("radioAudio");
  radioToggle = document.getElementById("radioToggle");
  radioToggle.addEventListener('click', toggleRadio);

  // === Event listeners ===
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);
  window.addEventListener('resize', onWindowResize);

  animate();
}

// Make a simple boxy building
function makeBuilding(x, z, color) {
  // Random height between 4 and 8
  const height = Math.random() * 4 + 4;
  const geom = new THREE.BoxGeometry(5, height, 5);
  const mat = new THREE.MeshLambertMaterial({ color });
  const building = new THREE.Mesh(geom, mat);
  building.position.set(x, height/2, z);
  scene.add(building);
  return building;
}

// === Animate loop ===
function animate() {
  requestAnimationFrame(animate);

  // Player movement
  const speed = 0.2;
  if (keyboard['w'] || keyboard['ArrowUp']) {
    playerMesh.position.z -= speed;
  }
  if (keyboard['s'] || keyboard['ArrowDown']) {
    playerMesh.position.z += speed;
  }
  if (keyboard['a'] || keyboard['ArrowLeft']) {
    playerMesh.position.x -= speed;
  }
  if (keyboard['d'] || keyboard['ArrowRight']) {
    playerMesh.position.x += speed;
  }

  // Check proximity to each building
  buildings.forEach(bldg => {
    const dist = bldg.position.distanceTo(playerMesh.position);
    if (dist < 3) {
      // Show building info from building.userData
      showBuildingInfo(bldg.userData.title, bldg.userData.body);
    }
  });

  // Check proximity to tower
  const towerDist = tower.position.distanceTo(playerMesh.position);
  if (towerDist < 3) {
    showPopup('towerInfo');
  }

  // Move camera to follow player (above & behind)
  camera.position.x = playerMesh.position.x;
  camera.position.z = playerMesh.position.z + 30;
  camera.lookAt(playerMesh.position);

  renderer.render(scene, camera);
}

// === Keyboard ===
function onKeyDown(event) {
  keyboard[event.key] = true;
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
    radioToggle.textContent = "Turn Radio Off";
  } else {
    radioAudio.pause();
    radioToggle.textContent = "Toggle Radio";
  }
  radioOn = !radioOn;
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

// === Start ===
window.onload = init;