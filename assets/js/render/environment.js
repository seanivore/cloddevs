// Import config settings
import config from '../config.js';

// Create ground with different textured sections
export function createGround(scene) {
  // Main ground (grass)
  const groundGeom = new THREE.PlaneGeometry(100, 100);
  const groundMat = new THREE.MeshLambertMaterial({ color: 0x88aa88 }); // Hard-coded grass color
  const ground = new THREE.Mesh(groundGeom, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.1; // Slightly below everything else
  scene.add(ground);
  
  return ground;
}

// Create path layout - narrower paths connecting buildings
export function createPaths(scene) {
  const pathMat = new THREE.MeshLambertMaterial({ color: 0xCCCCCC }); // Light gray path
  const paths = [];
  
  // Main vertical path (narrower)
  const vertPathGeom = new THREE.PlaneGeometry(5, 30);
  const vertPath = new THREE.Mesh(vertPathGeom, pathMat);
  vertPath.rotation.x = -Math.PI / 2;
  vertPath.position.y = 0.01; // Just above ground
  scene.add(vertPath);
  paths.push(vertPath);
  
  // Horizontal paths to buildings (narrower)
  // Top row
  const topLeftPathGeom = new THREE.PlaneGeometry(15, 3);
  const topLeftPath = new THREE.Mesh(topLeftPathGeom, pathMat);
  topLeftPath.rotation.x = -Math.PI / 2;
  topLeftPath.position.set(-7.5, 0.01, -10); // To top left building
  scene.add(topLeftPath);
  paths.push(topLeftPath);
  
  const topRightPathGeom = new THREE.PlaneGeometry(15, 3);
  const topRightPath = new THREE.Mesh(topRightPathGeom, pathMat);
  topRightPath.rotation.x = -Math.PI / 2;
  topRightPath.position.set(7.5, 0.01, -10); // To top right building
  scene.add(topRightPath);
  paths.push(topRightPath);
  
  // Bottom row
  const bottomLeftPathGeom = new THREE.PlaneGeometry(15, 3);
  const bottomLeftPath = new THREE.Mesh(bottomLeftPathGeom, pathMat);
  bottomLeftPath.rotation.x = -Math.PI / 2;
  bottomLeftPath.position.set(-7.5, 0.01, 10); // To bottom left building
  scene.add(bottomLeftPath);
  paths.push(bottomLeftPath);
  
  const bottomRightPathGeom = new THREE.PlaneGeometry(15, 3);
  const bottomRightPath = new THREE.Mesh(bottomRightPathGeom, pathMat);
  bottomRightPath.rotation.x = -Math.PI / 2;
  bottomRightPath.position.set(7.5, 0.01, 10); // To bottom right building
  scene.add(bottomRightPath);
  paths.push(bottomRightPath);
  
  // Path to radio tower
  const radioPathGeom = new THREE.PlaneGeometry(3, 10);
  const radioPath = new THREE.Mesh(radioPathGeom, pathMat);
  radioPath.rotation.x = -Math.PI / 2;
  radioPath.position.set(8.5, 0.01, -5); // Connect to radio tower
  scene.add(radioPath);
  paths.push(radioPath);
  
  return paths;
}

// Create interactive areas (stoops) that trigger dialogs
export function createInteractiveArea(scene, x, z, buildingId) {
  // Dark gray stoop with slight elevation
  const stoopGeom = new THREE.BoxGeometry(4, 0.2, 4);
  const stoopMat = new THREE.MeshLambertMaterial({ color: 0x999999 }); // Dark gray
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
    flowers.push(flowerGroup);
    
    // Store animation data
    flowerGroup.userData = {
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 1.5,
      baseY: flowerGroup.position.y
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
