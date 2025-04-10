// Import dialog functions
import { showBuildingInfo, showPopup } from '../ui/dialogs.js';

// Check proximity to interactive elements
export function checkProximity(playerMesh, interactiveAreas, buildings) {
  let interactable = null;
  
  // Check proximity to interactive areas (stoops)
  for (const area of interactiveAreas) {
    const dist = distanceBetween(playerMesh.position, area.position);
    
    if (dist < 3) {
      // Determine which building or object this area belongs to
      const buildingId = area.userData.buildingId;
      
      if (buildingId === 'radio') {
        // Radio tower interaction
        showPopup('towerInfo');
        interactable = { type: 'radio', id: 'radio' };
      } else {
        // Building interaction - find the matching building
        const building = buildings.find(b => b.userData.id === buildingId);
        if (building) {
          showBuildingInfo(building.userData.title, building.userData.body);
          interactable = { type: 'building', id: buildingId, data: building.userData };
        }
      }
      
      break; // Only interact with one area at a time
    }
  }
  
  return interactable;
}

// Update the interactive highlight effect
export function updateInteractiveHighlight(interactiveHighlight, interactable, buildings) {
  if (!interactable) {
    // Hide highlight if nothing is interactable
    if (interactiveHighlight) {
      interactiveHighlight.style.display = 'none';
    }
    return;
  }
  
  // Show and position the highlight
  if (interactiveHighlight) {
    interactiveHighlight.style.display = 'block';
    
    // Position depends on what's being interacted with
    if (interactable.type === 'building') {
      const building = buildings.find(b => b.userData.id === interactable.id);
      if (building) {
        // Calculate position in screen coordinates
        interactiveHighlight.style.transform = `translate(${building.position.x}px, ${building.position.z + 6}px)`;
      }
    } else if (interactable.type === 'radio') {
      // Radio tower position
      interactiveHighlight.style.transform = 'translate(10px, -10px)';
    }
  }
}

// Check if the player is attempting to interact
export function checkInteraction(keyboardState, interactable) {
  // Space bar pressed
  if (keyboardState[' '] || keyboardState.Space) {
    if (interactable) {
      return true;
    }
  }
  
  return false;
}

// Handle the interaction with an interactable object
export function processInteraction(interactable) {
  if (!interactable) return;
  
  switch (interactable.type) {
    case 'building':
      showBuildingInfo(interactable.data.title, interactable.data.body);
      break;
    case 'radio':
      showPopup('towerInfo');
      break;
  }
}

// Calculate distance between two positions
function distanceBetween(pos1, pos2) {
  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  const dz = pos1.z - pos2.z;
  
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
