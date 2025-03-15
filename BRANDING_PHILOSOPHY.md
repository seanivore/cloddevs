# Brand Art Psychology

## Core Theme
Using subtlety, texture, and motion to create layers of intentional but strategic contrast in visual and experiential elements, completely centered around two core emotional triggered experiences. 

## Key Strategy 
Emotional intelligence. Contrast that produces pattern of past, present, past, present.

## Presenting Value Propositions by Using Themes That Trigger Emotion 
1. Marry modernity with nostalgia. 
   - Visually, we will use maximalism (modernity) but in a minimalistic way (nostalgia), to set the stage.
2. UX will use nostalgia to create emotion that can be mirrored in our product. 
   - Have the user navigate an 8-bit pixel art environment that feels very "Pokémon Blue on Gameboy Color" 
   - This will encourage recall of a simple but social time where passion created emotion that was fed by purpose and amplified by community connections. 
3. This is the **First Framing** for how we write the copy about Clôd Cluster community's core values. 
   - Trigger memory of *shared experiences that created shared purpose*
   - Illuminate for the User that this experience is what they need most in life right now. 
   - Present the Clôd Cluster community values by framing them first as an obvious solution to that need. 
4. UX will now use modern, present realities to create emotion that will be refracted through the values of the project. 
   - User is reminded that discovery of *shared experiences that create shared purpose* using today's passion is more complex. 
   - Development requires resources, more tools, and comes with heavy implications for the future and long term planning. 
5. We are the 2%, we are the 16 million new developers entering the market. 
   - Reasons to worry. 'Who are we?" "Who will hire illiterate coders?" "Note every can make millions from their own product." 
   - Unsettling landscape. Tech companies employed ~1,500 developers five years ago; today it is ~20. 
   - Hiring managers aren't ready even though users learned to be experts in tech that didn't exist TWO MONTHS AGO. 
6. This is our **Second Framing** for how we write the copy about Clôd Cluster community's core values. 
   - User sees 'Safe Space' need. To explore, learn, grow, and feel secure. Current community spaces (social media) don't provide or create value. 
   - UI will respond to user movement with unexpected, simple motion. The UX is mesmerizing. This is that that worry and chaos. 
   - When they walk their character to each location, the ground has a parallax-like effect.
7. The rest of our product we present framed around the discomfort and desperation emotions we tapped into; Users need a solution right now.
   - Present the Clôd Cluster community as building for developers' futures, pays them to learn, 
   - Most significantly, undeniably, it creates a priceless set of novel data that will enable the community to lead the entire industry. 
   - The community is the security needed when a bubble is going to burst at some point.
   - UI has a secondary motion that is background and unrelated to user movement, but is experienced as emotional intelligence. 
   - As the User explores the map, the flowers bounce in a subtle, happy, dance. 

----

# Art Appearance 

## Feel 
1. Monochromatic Element Detailing = Step into the past 
- Muted pastels and earth tones. 
- Paired with pale, lighter variation of the same color. 
2. Layered Texturing = Looking toward an innovative future 
- Marry the current maximalist style with minimalistic 8-bit pixel art style via details. 
- Lay very intricate textured patterns so they're seen through transparent color solids. 
3. Perspective Motion = Emotional Intelligence 
- When they walk their character to each location, the ground has a parallax-like effect moving the detailing the opposite direction.
- Inanimate object exhibit joy through through repetitive, simple movement, like bouncing flowers that move constantly just like the future.

## Element Placement for Motion
1. `lower-layer-texture` 
Intricate, ornate even, detailed texture for grass and sidewalk. Moves with `upper-layer-3d` 
Z = 0
   - 2D art 
   - 120% vw and 120% vh
   - Absolute to `upper-layer-3d` 
   - Moves at steady pace against the direction the User is walking
     - Grass
     - Gravel
     - Sidewalk Texture 

2. `lower-layer-color`
Transparent color and shape of the ground art with some simpler complimentary textures. 
Z = 1
   - 2D art 
   - Static 
   - Exact 100vw x 100vh size
     - Grass solid color, transparent
     - Sidewalk solid color, transparent

3. `lower-layer-art` 
Additional details like flowers with a bit of color; significantly, this layer moves slightly, independently of the other layers.
Z = 2
   - 2D art 
   - Simple bouncing motion 
   - 100vw x 105% vh
   - Relative 
     - Flowers

4. `upper-layer-3d` 
Layer of the 3D elements created from the three.js code. It moves in sync `lower-layer-texture` 
Z = 3
   - 3D art 
   - 120% vw and 120% vh
   - Relative to move against the direction the User is walking
     - Houses
     - Character 

5. `top-layer-ui` 
Top layer UI elements and detailing for art. 
Z = 4
   - 2D art 
   - Absolute stuck to `upper-layer-3d` 
   - 120% vw and 120% vh
     - Home texture
     - Glass and building texture

6. `character-sprite`
Person the User will move to get to each location. 
Z = 5
   - 2D art 
   - Relative 
     - Character sprite

7. `ui-elements-dialogue`
UI elements for dialogue, and other UI elements that come up. 
Z = 6
   - 2D art 
   - Absolute 
     - Dialogue box
     - Other UI elements

## Paragraph Style Visual Effect Explanation
The first layer — `lower-layer-texture` — is texture, as we want it below the transparent colors of the next layer for grass and sidewalk. This layer, along with `upper-layer-3d` and `top-layer-ui` will move at the same speed as the User's character, but in the opposite direction. All three layers will then need to be slightly larger than the vw and vh. 

The second layer — `lower-layer-color` — is a transparent color solid. It will be the same size as the vw and vh of the screen. It need not ever move, as things like the sidewalk, fences, and mailboxes, don't move. Only the texture of these items on the layer below has motion relative to the user, and as mentioned above it moves with a couple other layers. But `lower-layer-color` can be legit static. Or absolute. 

The third layer — `lower-layer-art` — is a simple bouncing motion. It will be the same size as the vw and have a slightly larger then 100% vh to allow for the repetitive bouncing. The bounce is much like an old cartoon; like Mickey Mouse originals or Pop-Pie. Mostly like a bobbing head. Some left and right would be nice, but are not essential. 

The fourth layer — `upper-layer-3d` — is the 3D elements created from the three.js code. It moves in sync `lower-layer-texture` and its `top-layer-ui` which all move at the same speed as the User's character, but in the opposite direction. All three layers will then need to be slightly larger than the vw and vh. 

The fifth layer — `top-layer-ui` — is the UI elements. It will be the same size as the layer it is adding details to, which is `upper-layer-3d`. 

When conceptualizing the movement of the main perspective shift layer, don't think of it as parallax which is much more complex. Think of it as a simple shift in perspective. Simply, it should all move at the same speed the character is walking, but in the opposite direction. 

----

# Art Technical Notes 
All artwork will be created in Adobe Fresco (all vector) and Adobe Illustrator, to be exported as SVGs unless other file types are requested. 