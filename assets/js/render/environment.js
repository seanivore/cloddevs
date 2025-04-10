// Import config settings
import config from '../config.js';

// Create ground with different textured sections
export function createGround(scene) {
  // Main ground (grass)
  const groundGeom = new THREE.PlaneGeometry(150, 150); // Larger ground area
  const groundMat = new THREE.MeshLambertMaterial({ color: 0x88aa88 }); // Hard-coded grass color
  const ground = new THREE.Mesh(groundGeom, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.1; // Slightly below everything else
  scene.add(ground);
  
  return ground;
}

// Create path layout - paths connecting buildings in a cross pattern
export function createPaths(scene) {
  const pathMat = new THREE.MeshLambertMaterial({ color: 0xCCCCCC }); // Light gray path
  const paths = [];
  
  // Main vertical path (North-South)
  const vertPathGeom = new THREE.PlaneGeometry(5, 65); // Longer to reach both N/S buildings
  const vertPath = new THREE.Mesh(vertPathGeom, pathMat);
  vertPath.rotation.x = -Math.PI / 2;
  vertPath.position.y = 0.01; // Just above ground
  scene.add(vertPath);
  paths.push(vertPath);
  
  // Main horizontal path (East-West)
  const horizPathGeom = new THREE.PlaneGeometry(65, 5); // Wider to reach both E/W buildings
  const horizPath = new THREE.Mesh(horizPathGeom, pathMat);
  horizPath.rotation.x = -Math.PI / 2;
  horizPath.position.y = 0.01; // Just above ground
  scene.add(horizPath);
  paths.push(horizPath);
  
  // Path to radio tower - should be in center now
  const radioPathCircleGeom = new THREE.CircleGeometry(8, 16);
  const radioPathCircle = new THREE.Mesh(radioPathCircleGeom, pathMat);
  radioPathCircle.rotation.x = -Math.PI / 2;
  radioPathCircle.position.set(0, 0.01, 0); // Center of the cross
  scene.add(radioPathCircle);
  paths.push(radioPathCircle);
  
  return paths;
}

// Create interactive areas (stoops) that trigger dialogs
export function createInteractiveArea(scene, x, z, buildingId) {
  // Dark gray stoop with slight elevation
  const stoopGeom = new THREE.BoxGeometry(4, 0.2, 4);
  const stoopMat = new THREE.MeshLambertMaterial({ color: 0x999999 }); // Dark gray
  const stoop = new THREE.Mesh(stoopGeom, stoopMat);
  stoop.position.set(x, 0.1, z); // Slightly raised
  stoop.userData = { 
    buildingId: buildingId,
    isInteractive: true, 
    class: 'interactive-stoop'
  }; // Store which building/object this stoop belongs to
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
  
  // After the scene is rendered, create an HTML element for this stoop
  setTimeout(() => {
    const interactiveArea = document.createElement('div');
    interactiveArea.className = 'interactive-stoop';
    interactiveArea.dataset.buildingId = buildingId;
    interactiveArea.style.position = 'absolute';
    interactiveArea.style.width = '4rem';
    interactiveArea.style.height = '4rem';
    interactiveArea.style.pointerEvents = 'none';
    interactiveArea.style.opacity = '0.01';
    
    // Position will be updated in the render loop
    document.getElementById('ui-layer').appendChild(interactiveArea);
  }, 1000);
  
  return stoop;
}

// Create decorative flowers
export function createFlowers(scene) {
  const flowers = [];
  
  // Create 30 random flowers
  for (let i = 0; i < 30; i++) {
    // Random position (avoiding paths)
    let x, z;
    do {
      x = Math.random() * 120 - 60; // Wider distribution
      z = Math.random() * 120 - 60; // Wider distribution
    } while (isOnPath(x, z));
    
    const flowerGroup = new THREE.Group();
    
    // Stem
    const stemGeom = new THREE.CylinderGeometry(0.1, 0.1, 1, 8);
    const stemMat = new THREE.MeshLambertMaterial({ color: 0x00AA00 });
    const stem = new THREE.Mesh(stemGeom, stemMat);
    stem.position.y = 0.5; // Half the stem height
    flowerGroup.add(stem);
    
    // Blossom
    const blossomGeom = new THREE.SphereGeometry(0.3, 8, 8);
    const blossomMat = new THREE.MeshLambertMaterial({ color: 0xFF99AA }); // Pink flowers
    const blossom = new THREE.Mesh(blossomGeom, blossomMat);
    blossom.position.y = 1.1; // At the top of the stem
    flowerGroup.add(blossom);
    
    // Position at ground level, not floating
    flowerGroup.position.set(x, 0, z); // y=0 ensures it's at ground level
    scene.add(flowerGroup);
    flowers.push(flowerGroup);
    
    // Store animation data for gentle swaying
    flowerGroup.userData = {
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 1.5,
      baseY: 0 // Set base at ground level
    };
  }
  
  return flowers;
}

// Create decorative HTML flowers for the lower-layer-art
export function createHTMLFlowers() {
  const flowerLayer = document.getElementById('lower-layer-art');
  const flowers = [];
  
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
    flowers.push(flower);
  }
  
  return flowers;
}

// Check if a position is on a path
export function isOnPath(x, z) {
  // Main cross paths with padding
  const pathWidth = 6; // Width of the paths plus some padding
  
  // Vertical path (z-axis)
  if (Math.abs(x) < pathWidth && Math.abs(z) < 35) return true;
  
  // Horizontal path (x-axis)
  if (Math.abs(z) < pathWidth && Math.abs(x) < 35) return true;
  
  // Center circle for radio tower
  if (Math.sqrt(x*x + z*z) < 10) return true;
  
  // Buildings
  // North building (apartment)
  if (Math.abs(x) < 10 && z < -25 && z > -40) return true;
  
  // South building (token exchange)
  if (Math.abs(x) < 10 && z > 25 && z < 40) return true;
  
  // East building (MCP lab)
  if (Math.abs(z) < 10 && x > 25 && x < 40) return true;
  
  // West building (dev hub)
  if (Math.abs(z) < 10 && x < -25 && x > -40) return true;
  
  return false;
}
