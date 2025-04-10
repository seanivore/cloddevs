# Read Me for Claude

## To Preview 

```bash
cd /Users/seanivore/Development/cloddevs
npx serve
```
Then visit http://localhost:5000 in your browser.

## Directory Structure

cloddevs/
├── _config.yml
├── assets
│   ├── audio
│   │   └── CLAUD_PROTOCOL_NOTEBOOK_LM.mp3  `<-- podcast deep dive`
│   ├── docs
│   │   ├── BRANDING_PHILOSOPHY.md  `<-- branding philosophy`
│   │   ├── BUILDING_CHARACTER.md  `<-- building character`
│   │   ├── culture  `<-- VALUE PROPOSITIONS`
│   │   │   ├── 1_DEVELOPER_REVOLUTION.md 
│   │   │   ├── 2_COMMUNITY_DATA.md 
│   │   │   ├── 3_VALUE_RECOGNITION.md
│   │   │   ├── 4_DEMOCRATIZING_TOOLS.md
│   │   │   ├── 5_ACCELERATED_EDUCATION.md
│   │   │   └── 6_DEVELOPER_PIPELINE.md
│   │   ├── index.md  `<-- homepage original concept has good copy`
│   │   ├── LANDING_PAGE_CONCEPT.md  `<-- homepage`
│   │   ├── SPECIFICATIONS.md  `<-- specifications`
│   │   └── technicals  `<-- technicals about the project to link to`
│   │       ├── 01_MCP_TRANSPORT_LAYER.md
│   │       ├── 02_TOKEN_ECONOMICS.md
│   │       ├── 03_USER_INTERACTION.md
│   │       ├── 04_COMMUNITY_MANAGEMENT.md
│   │       ├── 05_DEVELOPMENT_PHASES.md
│   │       └── 06_INFRASTRUCTURE_REQUIREMENTS.md
│   ├── drafts  `<-- drafts for the project; ignore`
│   │   ├── art-files-illustrator  `<-- art files for illustrator`
│   │   ├── marketing-copy-drafting  `<-- marketing copy drafting` 
│   │   └── original-prototypes  `<-- original prototypes`
│   ├── img  `<-- images for the project; inspiration`
│   │   ├── CLAUD_PROTOCOL.png  `<-- title text there is an SVG of`
│   │   └── static-draft-example.png  `<-- neighborhood example`
│   ├── js  `<-- javascript files`
│   │   ├── buildingData.js  `<-- building definitions and content`
│   │   ├── characterManager.js  `<-- character manager`
│   │   ├── config.js  `<-- game constants and settings`
│   │   ├── interaction  `<-- interaction files`
│   │   │   ├── player.js  `<-- player movement and controls`
│   │   │   ├── proximity.js  `<-- proximity detection`
│   │   │   └── radio.js  `<-- radio functionality`
│   │   ├── main.js  `<-- Core initialization and game loop`
│   │   ├── render  `<-- rendering files`
│   │   │   ├── buildings.js  `<-- building creation functions`
│   │   │   ├── environment.js  `<-- paths, flowers, ground`
│   │   │   └── player.js  `<-- player character rendering`
│   │   ├── ui  `<-- UI files`
│   │   │   ├── dialogs.js  `<-- dialog system`
│   │   │   └── effects.js  `<-- visual effects`
│   │   └── uiManager.js  `<-- UI manager`
│   ├── svg  `<-- SVGs for the project`
│   │   ├── CLAUDE_PROTOCOL.svg
│   │   ├── draft-BUILDING_EXAMPLE_1.svg
│   │   ├── draft-BUILDING_EXAMPLE_2.svg
│   │   ├── draft-BUILDING_EXAMPLE_3.svg
│   │   ├── draft-BUILDING_EXAMPLE_4.svg
│   │   ├── draft-inspiration-only.svg
│   │   ├── fencing.svg
│   │   ├── FLOWERS_1.svg
│   │   ├── FLOWERS_2.svg
│   │   ├── GRASS_DETAIL.svg
│   │   ├── GRASS_GREEN_b7d688.svg
│   │   └── GROUND_TEXTURE.svg
│   └── transcript  `<-- transcript of the podcast`
│       ├── CLAUD_PROTOCOL_NOTEBOOK_LM.json
│       └── CLAUD_PROTOCOL_NOTEBOOK_LM.txt
├── CLAUDE.md  `<-- this file`
├── index.html  `<-- homepage`
├── LICENSE  `<-- license`
└── styles.css  `<-- stylesheet`

17 directories, 60 files

Hidden project directories:
./.cursor
./.notes
./.vscode

Hidden project files:
./.aider.conf.yml
./.example.env
./.gitignore

## JavaScript Architecture

The Clôd Cluster Pixel Town application uses a modular JavaScript architecture organized around core functional areas. Here's how the key components work together:

### Core Components

**1.x Core Modules**

1.0. **main.js** - Entry point and orchestrator
   - Initializes the Three.js scene, camera, and renderer
   - Manages the game loop and animation cycle
   - Coordinates all other modules (world, player, UI)
   - Handles window resize events

1.1. **config.js** - Global configuration
   - Contains game settings, dimensions, and parameters
   - Defines map sizes, character settings, and UI properties
   - Central place for tuning game behavior

1.2. **buildingData.js** - Content definitions
   - Defines all buildings with positions, dimensions, and colors
   - Contains marketing copy for building descriptions
   - Defines interactive elements and dialog content

### Manager Classes

**2.x Manager Classes**

2.1. **uiManager.js** - UI Coordination
   - Manages all dialog boxes and their content
   - Handles showing/hiding of UI elements
   - Controls radio toggle functionality
   - Shows notifications and loading screens
   - Centralizes all UI-related operations
   - *Dependencies: 1.1 (config.js), 1.2 (buildingData.js), 4.x (UI modules)*

2.2. **characterManager.js** - Player Control
   - Handles character movement and collision detection
   - Manages player animation states and sprite updates
   - Processes keyboard and touch input
   - Controls camera following behavior
   - *Dependencies: 1.1 (config.js), 3.3 (render/player.js), 5.1 (interaction/player.js)*

2.3. **keypads.js** - Directional Controls
   - Manages the on-screen directional keypad UI
   - Handles keypad animations and visual feedback
   - Creates interactive area highlighting
   - Processes keyboard input and touch events
   - *Dependencies: 1.1 (config.js)*

### Rendering Modules

**3.x Rendering Modules**

3.1. **render/buildings.js** - Building Creation
   - Creates 3D building meshes based on building data
   - Handles building colors and positioning
   - Specializes in creating specific building types
   - *Dependencies: 1.1 (config.js), 1.2 (buildingData.js)*

3.2. **render/environment.js** - World Elements
   - Creates ground, paths, and decorative elements
   - Manages interactive areas (stoops) in front of buildings
   - Creates HTML-based decorative elements
   - Handles collision detection zones
   - *Dependencies: 1.1 (config.js)*

3.3. **render/player.js** - Character Rendering
   - Creates the player's 3D representation
   - Updates player visuals based on state
   - Manages camera position relative to player
   - *Dependencies: 1.1 (config.js)*

### Interaction Modules

**5.x Interaction Modules**

5.1. **interaction/player.js** - Player Behavior
    - Processes player movement input
    - Updates player sprite animations
    - Handles background parallax effects
    - *Dependencies: 1.1 (config.js), 2.2 (characterManager.js), 3.3 (render/player.js)*

5.2. **interaction/proximity.js** - Object Interaction
    - Detects when player is near interactive objects
    - Manages highlighting of interactive elements
    - Triggers building information display
    - *Dependencies: 1.1 (config.js), 3.2 (render/environment.js), 1.2 (buildingData.js)*

5.3. **interaction/radio.js** - Radio Feature
    - Controls audio playback for the radio tower
    - Manages radio toggle state
    - Handles audio loading and events
    - *Dependencies: 1.1 (config.js), 2.1 (uiManager.js)*

### UI Modules

**4.x UI Modules**

4.1. **ui/dialogs.js** - Dialog System
    - Creates and manages dialog boxes
    - Handles dialog content and animations
    - Manages dialog close buttons and events
    - *Dependencies: 1.1 (config.js), 1.2 (buildingData.js), 2.1 (uiManager.js)*

4.2. **ui/effects.js** - Visual Effects
    - Creates visual feedback for user actions
    - Manages transitions and animations
    - Provides particle effects and highlights
    - *Dependencies: 1.1 (config.js)*

### Data Flow and Dependencies

```
                   +----------------+
                   |  1.0 main.js   |
                   +----------------+
                       |
        +-----------------------------+
        |              |              |
+----------------+ +------------+ +----------------+
| 1.1 config.js  | | 1.2 data.js| | 3.x render/    |
+----------------+ +------------+ +----------------+
        |              |              |
        |              |              |
+----------------+ +------------+ +----------------+
| 2.3 keypad.js  | | 2.1 UI Mgr | | 5.x interaction|
+----------------+ +------------+ +----------------+
        |              |              |
        |              |              |
+----------------+ +------------+ +----------------+
| 2.2 character  | | 4.x UI/    | | 3.3 render/    |
|    Manager.js  | |            | |   player.js    |
+----------------+ +------------+ +----------------+
```

### Initialization Process:

1. `1.0 main.js` loads and starts the initialization sequence
2. Three.js scene, camera, and renderer are created
3. World elements are created via `initializeWorld()` (using 3.x modules)
4. Player character is initialized via `initializePlayer()` (using 2.2, 3.3, 5.1)
5. UI elements are set up via `initializeUI()` (using 2.1, 2.3, 4.x, 5.3)
6. Game loop begins with the `animate()` function

### Event Handling:

- **Player Input**: Keyboard events are captured by `2.2 characterManager.js` and `2.3 keypads.js`
- **Building Interaction**: Proximity detection (`5.2`) triggers dialog displays via `2.1 uiManager.js`
- **UI Interaction**: Dialog buttons and radio toggle are managed by `2.1 uiManager.js`
- **Window Events**: Resize handlers update the rendering canvas and UI layout
