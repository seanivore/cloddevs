// Import config settings
import config from '../config.js';

// Helper function to adjust color brightness
export function adjustColor(color, amount) {
  const r = ((color >> 16) & 255) + amount;
  const g = ((color >> 8) & 255) + amount;
  const b = (color & 255) + amount;
  
  return (Math.min(255, Math.max(0, r)) << 16) + 
         (Math.min(255, Math.max(0, g)) << 8) + 
         Math.min(255, Math.max(0, b));
}

// Create buildings with different styles based on their type
export function createBuildingByType(scene, type, x, z, color) {
  switch (type) {
    case 'mcp':
      return createMCPShop(scene, x, z, color);
    case 'apt':
      return createApartmentBuilding(scene, x, z, color);
    case 'ai-ide':
      return createHouseBuilding(scene, x, z, color);
    case 'gym':
      return createGymBuilding(scene, x, z, color);
    default:
      return createGenericBuilding(scene, x, z, color);
  }
}

// Create a generic building (fallback)
function createGenericBuilding(scene, x, z, color) {
  const group = new THREE.Group();
  
  // Simple box building
  const buildingGeom = new THREE.BoxGeometry(8, 6, 7);
  const buildingMat = new THREE.MeshLambertMaterial({ color });
  const mainBlock = new THREE.Mesh(buildingGeom, buildingMat);
  mainBlock.position.y = 3;
  group.add(mainBlock);
  
  // Simple roof
  const roofGeom = new THREE.BoxGeometry(9, 1, 8);
  const roofMat = new THREE.MeshLambertMaterial({ color: adjustColor(color, -30) });
  const roof = new THREE.Mesh(roofGeom, roofMat);
  roof.position.y = 6.5;
  group.add(roof);
  
  // Position the building at the specified coordinates
  group.position.set(x, 0, z);
  
  // All buildings face forward (south)
  group.rotation.y = Math.PI;
  
  scene.add(group);
  return group;
}

// Create the MCP shop building (wide storefront with flat roof + angled edges)
export function createMCPShop(scene, x, z, color) {
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
export function createApartmentBuilding(scene, x, z, color) {
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
export function createHouseBuilding(scene, x, z, color) {
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
export function createGymBuilding(scene, x, z, color) {
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
export function createRadioTower(scene, x = 10, z = -10) {
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
  group.position.set(x, 0, z);
  scene.add(group);
  return group;
}
