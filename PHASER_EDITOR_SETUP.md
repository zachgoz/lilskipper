# Phaser Editor Setup Guide for Little Skipper

This guide explains how to use Phaser Editor v5 with your Little Skipper game project. The Phaser Editor MCP server is already configured and running!

## ✅ What's Already Set Up

1. **MCP Server Connected**: `@phaserjs/editor-mcp-server` is running
2. **Directory Structure**: Created folders for assets and scenes
3. **Asset Pack**: `public/assets/asset-pack.json` configured with all boat parts
4. **Image Generator**: `scripts/generate-boat-images.html` to export textures

## 📁 Directory Structure

```
lilskipper/
├── public/
│   └── assets/
│       ├── asset-pack.json          # Phaser Editor asset configuration
│       ├── boats/                   # Boat part images (to be generated)
│       ├── cards/                   # Memory card images (to be generated)
│       └── audio/                   # Sound effects
├── src/
│   └── game/
│       └── scenes/
│           ├── BuildBoatScene.ts    # Current TypeScript scene
│           ├── MemoryScene.ts       # Current TypeScript scene
│           ├── DrawingScene.ts      # Current TypeScript scene
│           └── editor/              # Future .scene files
└── scripts/
    └── generate-boat-images.html    # Tool to create PNG assets
```

## 🎨 Step 1: Generate Image Assets

Your current project uses procedurally generated graphics. To use Phaser Editor visually, you need actual PNG files.

### Option A: Use the Image Generator (Quick)

1. Open `scripts/generate-boat-images.html` in a web browser
2. Click each download link to save the PNG files
3. Place files in `public/assets/boats/` and `public/assets/cards/`

### Option B: Create Custom Images (Better Quality)

Create PNG images for each boat part:

**Required Boat Parts:**
- `hull.png` (165×60px) - Main boat body
- `hull-cat.png` (80×40px) - Catamaran hull
- `hull-large.png` (220×75px) - Large ship hull
- `mast.png` (28×100px) - Sail mast
- `sail.png` (45×95px) - Large sail
- `sail-small.png` (30×65px) - Small sail
- `cabin.png` (75×65px) - Boat cabin
- `console.png` (60×66px) - Steering console
- `outboard.png` (50×86px) - Outboard motor
- `seat.png` (55×50px) - Boat seat
- `ttop.png` (95×60px) - T-Top canopy
- `cooler.png` (50×46px) - Cooler box
- `bridge.png` (100×18px) - Deck bridge
- `smokestack.png` (38×72px) - Smoke stack
- `deck.png` (150×12px) - Wooden deck
- `deck-large.png` (180×15px) - Large deck
- `bumper.png` (38×38px) - Bumper
- `flag.png` (52×40px) - Flag
- `antenna.png` (25×75px) - Antenna
- `cargo.png` (65×45px) - Cargo container
- `crane.png` (58×78px) - Crane
- `ship-bridge.png` (95×72px) - Ship bridge
- `funnel.png` (52×65px) - Funnel
- `lifeboat.png` (48×20px) - Lifeboat

**Required Card Images:**
- `card-front.png` (120×140px)
- `card-back.png` (120×140px)

**Design Tips:**
- Use transparent backgrounds (PNG format)
- Match the colors from your existing graphics code
- Keep designs simple and toddler-friendly
- Use bold outlines for visibility

## 🚀 Step 2: Install Phaser Editor v5

### Download & Install

1. Visit: https://phasereditor2d.com/downloads
2. Download Phaser Editor v5 for your OS (macOS/Windows/Linux)
3. Install and launch the application

### Open Your Project

1. In Phaser Editor: **File → Open Project**
2. Navigate to `/Users/zgosling/sourcecode/lilskipper`
3. Click **Open**

Phaser Editor will detect:
- Your `public/assets/asset-pack.json`
- Your Vite/TypeScript configuration
- Your existing scene files

## 🎬 Step 3: Create Your First Visual Scene

### Create a New Scene

1. Right-click `src/game/scenes/editor/` folder
2. Select **New → Scene File**
3. Name it: `BuildBoatVisual.scene`
4. Choose **Scene** as the template

### Configure the Scene

In the **Inspector Panel**:

```javascript
Scene Settings:
- Class Name: BuildBoatVisual
- Base Class: Phaser.Scene
- Scene Key: 'BuildBoatVisual'
- Width: 800
- Height: 600
```

### Add Assets to Scene

1. Open **Asset Pack** panel (bottom-left)
2. Drag `hull.png` onto the scene canvas
3. Position it using the transform tools
4. Set properties in Inspector:
   - Label: `hull`
   - Scale X: 1.2
   - Scale Y: 1.2
   - Interactive: true
   - Draggable: true

5. Repeat for other boat parts (mast, sail, etc.)

### Add Interactive Behavior

The visual scene creates the structure. Add behavior in code:

```typescript
// src/game/scenes/editor/BuildBoatVisual.ts (auto-generated)
export default class BuildBoatVisual extends Phaser.Scene {
  hull!: Phaser.GameObjects.Image;
  mast!: Phaser.GameObjects.Image;
  sail!: Phaser.GameObjects.Image;

  constructor() {
    super('BuildBoatVisual');
  }

  editorCreate(): void {
    // Auto-generated code from Phaser Editor
    this.hull = this.add.image(400, 520, 'hull');
    this.hull.scaleX = 1.2;
    this.hull.scaleY = 1.2;
    this.hull.setInteractive();
    // ... more objects
  }

  create(): void {
    this.editorCreate();

    // Add your custom logic here
    this.input.setDraggable(this.hull);
    this.hull.on('drag', (pointer, dragX, dragY) => {
      this.hull.setPosition(dragX, dragY);
    });
  }
}
```

## 📊 Step 4: Using MCP Server with Claude Code

The Phaser Editor MCP server lets you:
- Query scene data
- List available assets
- Get texture information
- Analyze game objects

### Example Commands in Claude Code

```
# Get all scenes in your project
Can you list all Phaser scenes using the MCP server?

# Analyze a scene
Analyze the BuildBoatVisual scene structure

# Get texture info
What textures are available in the asset pack?

# Get scene screenshot
Show me what the BuildBoatScene looks like
```

## 🔄 Step 5: Hybrid Workflow (Recommended)

You don't have to convert everything at once. Use a **hybrid approach**:

### Visual Elements in Phaser Editor
- Background graphics
- Static decorations
- Initial layout
- Guide silhouettes
- UI buttons

### Code-Based Logic in TypeScript
- Drag & drop mechanics
- Snap detection
- Level progression
- Audio/haptics
- Animations

### Example Hybrid Scene

```typescript
import BuildBoatVisual from './editor/BuildBoatVisual';

export default class BuildBoatScene extends BuildBoatVisual {
  // Visual layout from Phaser Editor
  // Logic implemented here

  create() {
    super.create(); // Create visual elements

    // Add your game logic
    this.setupDragAndDrop();
    this.loadLevel(1);
  }

  private setupDragAndDrop() {
    // Your custom drag logic
  }
}
```

## 🎯 Benefits of Using Phaser Editor

1. **Visual Development**
   - See changes instantly
   - No need to reload game repeatedly
   - Easier positioning and layout

2. **Asset Management**
   - Centralized asset pack
   - Texture atlas support
   - Audio preview

3. **Code Generation**
   - Auto-generates TypeScript
   - Type-safe object references
   - Clean, maintainable code

4. **Prefab System**
   - Reusable boat parts
   - Consistent styling
   - Easy updates across levels

5. **MCP Integration**
   - Query scenes via Claude Code
   - Automated analysis
   - Quick prototyping

## 🛠️ Advanced Features

### Creating Prefabs

1. Create a new **Prefab Scene**
2. Add a boat part (e.g., hull + mast + sail)
3. Save as `Sailboat.prefab`
4. Use in multiple levels by dragging into scenes

### Using Containers

Group related objects:
1. Right-click canvas → **Create Container**
2. Drag objects into container
3. Animate/transform as a group

### Particle Effects

Add celebration effects:
1. **Create → Particle Emitter**
2. Configure in Inspector
3. Trigger from code

### Physics Bodies

If you add physics later:
1. Select object
2. Inspector → **Arcade Physics**
3. Enable body, set properties
4. Configure collision shapes

## 📝 Next Steps

1. **Generate Images**: Run `generate-boat-images.html`
2. **Install Phaser Editor**: Download from phasereditor2d.com
3. **Open Project**: Load your lilskipper directory
4. **Create Test Scene**: Build one level visually
5. **Integrate**: Extend visual scene with logic
6. **Iterate**: Gradually migrate scenes

## 🐛 Troubleshooting

### Asset Pack Not Found

Make sure `public/assets/asset-pack.json` exists and is valid JSON.

### Images Not Loading

Check file paths in asset-pack.json match actual file locations.

### MCP Server Not Working

Restart Phaser Editor and verify connection:
```bash
claude mcp list
```

Should show: `phaser-editor: ✓ Connected`

### TypeScript Compilation Errors

Phaser Editor generates code in `src/game/scenes/editor/`.
Make sure this folder is included in your `tsconfig.json`:

```json
{
  "include": ["src/**/*"]
}
```

## 📚 Resources

- **Phaser Editor Docs**: https://phasereditor2d.com/docs/
- **Phaser 3 API**: https://photonstorm.github.io/phaser3-docs/
- **Phaser Examples**: https://phaser.io/examples
- **MCP Server**: https://github.com/phaserjs/editor-mcp-server

## 🎮 Current Status

✅ MCP Server configured and running
✅ Asset pack created
✅ Directory structure ready
⏳ Boat part images (use generator or create custom)
⏳ Phaser Editor installed
⏳ First visual scene created

---

**Happy scene building! 🚤**

Questions? Ask Claude Code to help with the Phaser Editor MCP server!
