# $CLAUD Protocol Technical Specifications

## Landing Page Implementation

### Visual Layers Structure
The interactive landing page implements a 7-layer approach for visual depth and motion:

1. **lower-layer-texture** (Z=0)
   - 2D art, 120% vw and 120% vh
   - Intricate, detailed textures for grass and sidewalk
   - Absolute positioning to upper-layer-3d
   - Moves counter to user navigation direction

2. **lower-layer-color** (Z=1)
   - 2D art, static
   - Exact 100vw x 100vh
   - Transparent color overlays with simpler textures
   - Includes grass and sidewalk base colors

3. **lower-layer-art** (Z=2)
   - 2D art with independent animation
   - Simple bouncing motion patterns
   - 100vw x 105% vh, relatively positioned
   - Includes decorative elements like flowers

4. **upper-layer-3d** (Z=3)
   - Three.js generated 3D elements
   - 120% vw and 120% vh
   - Moves counter to user navigation
   - Contains buildings and character elements

5. **top-layer-ui** (Z=4)
   - 2D art for UI and detailing
   - Absolutely positioned to upper-layer-3d
   - 120% vw and 120% vh
   - Includes building textures and glass effects

6. **character-sprite** (Z=5)
   - 2D pixel art for the user's character
   - Relatively positioned
   - Animated with walking cycles

7. **ui-elements-dialogue** (Z=6)
   - 2D art for interactive UI components
   - Absolutely positioned
   - Includes dialogue boxes and control elements

### Animation Specifications

**Perspective Motion**
- Ground textures move opposite to character direction
- Movement synchronized between lower-layer-texture, upper-layer-3d, and top-layer-ui
- Rate matches character walking speed

**Independent Animation**
- Decorative elements (flowers) implement simple bouncing motion
- Subtle bobbing animation reminiscent of classic cartoons
- Optional left/right motion for added liveliness

**Character Animation**
- Four-directional walking animation
- Frame-based sprite animation for authentic pixel art feel
- Direction changes based on user input

### Technical Implementation

**Rendering**
- Three.js for 3D elements and scene management
- SVG assets for high-quality, scalable 2D elements
- CSS for layer management and positioning

**Interaction**
- Keyboard controls for character movement
- Proximity detection for building interaction
- Space bar triggers dialogue/information display
- Click/tap controls for podcast player

**Asset Management**
- SVG format for all custom artwork (created in Adobe Fresco and Illustrator)
- Pixel-perfect implementation with image-rendering: pixelated CSS
- Sprite sheets for animated elements

**Performance Optimization**
- Texture atlas for improved rendering performance
- Asset preloading to prevent visual pop-in
- Sprite batching for efficient animation
- Responsive scaling for various device sizes

## Podcast Integration

**Player Implementation**
- Record player visual metaphor in player's home
- Transitions UI when activated
- JSON-timed subtitle synchronization
- Animation representing character transformation

**Transcript Handling**
- Speaker identification and separation
- Timed display of dialogue
- Optional subtitle toggling
- Visual styling matching game aesthetic

## Responsive Design

**Viewport Management**
- Maintains pixel art aesthetic across screen sizes
- Preserves aspect ratio of game world
- Adjusts UI element positioning for different devices
- Implements touch controls for mobile users

**Accessibility Considerations**
- Alternative navigation methods
- High contrast mode option
- Text alternatives for visual storytelling
- Keyboard navigation support

## Development Priority

1. Core game world layout and character movement
2. Building visuals and interaction system
3. Dialogue/information display system
4. Podcast player integration
5. Animation and motion effects
6. Polish and optimization

This specification is subject to iteration as development progresses.
