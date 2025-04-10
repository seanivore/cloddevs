// Create the buildings and interactive areas
export function createBuildings(scene, camera, buildings) {
    const buildingObjects = [];
    const interactiveAreas = [];
    
    buildings.forEach(building => {
        // Create the building
        const buildingObject = createBuilding(scene, building.x, building.y, building.z, building.width, building.height, building.depth, building.texture);
        buildingObjects.push(buildingObject);
        
        // Create an interactive area (stoop) in front of the building
        if (building.interactive) {
            const interactiveArea = createInteractiveArea(scene, camera, building.x, building.z, building);
            interactiveAreas.push(interactiveArea);
        }
    });
    
    return { buildingObjects, interactiveAreas };
} 