# Migration Guide: TypeScript → Phaser Editor

Step-by-step guide for migrating your existing scenes to use Phaser Editor's visual scene system.

## 🎯 Migration Strategy

**Don't convert everything at once!** Use a gradual, hybrid approach:

1. ✅ **Phase 1**: Set up infrastructure (DONE)
2. ⏳ **Phase 2**: Create visual layouts for static elements
3. ⏳ **Phase 3**: Keep game logic in TypeScript
4. ⏳ **Phase 4**: Gradually migrate to prefabs

## 📊 What to Migrate vs What to Keep in Code

### ✅ Migrate to Phaser Editor (Visual)

**Static Visual Elements:**
- Background layers
- Decorative elements (clouds, sun, water)
- UI layout (buttons, text positions)
- Initial object positions
- Guide silhouettes

**Benefits:**
- Quick iteration
- No recompilation needed
- Easy to adjust positions
- Visual feedback

### ❌ Keep in TypeScript (Code)

**Dynamic Game Logic:**
- Drag and drop mechanics
- Physics simulations
- AI/pathfinding
- Complex animations
- State management
- Audio/haptic triggers
- Level progression
- Score calculations

**Benefits:**
- Full control
- Type safety
- Easier debugging
- Version control friendly

## 🚀 Phase 2: Create Visual Layouts

### Example: BuildBoatScene Background

Your current code (lines 76-144 in BuildBoatScene.ts) creates the environment procedurally.
Let's migrate the **static visual elements** to Phaser Editor.

#### Step 1: Open Phaser Editor

1. Launch Phaser Editor v5
2. Open your project: `/Users/zgosling/sourcecode/lilskipper`
3. Right-click `src/game/scenes/editor/`
4. New → Scene File → `BuildBoatEnvironment.scene`

#### Step 2: Create Background in Editor

In the visual editor:

1. **Add Sky Layer**
   - Create Rectangle (full screen)
   - Fill Color: `#74C0F4`
   - Name: `distantSky`

2. **Add Mid Sky Layer**
   - Create Rectangle
   - Fill Color: `#9FD6FF`
   - Height: 65% of screen
   - Name: `midSky`

3. **Add Water Layer**
   - Create Rectangle
   - Fill Color: `#4A90E2`
   - Position: Bottom 35%
   - Name: `water`

4. **Add Sun**
   - Create Circle
   - Fill Color: `#FFE082`
   - Position: Top-right
   - Radius: 70
   - Name: `sun`

5. **Save Scene**

#### Step 3: Generated Code

Phaser Editor generates this TypeScript:

```typescript
// BuildBoatEnvironment.ts (auto-generated)
export default class BuildBoatEnvironment extends Phaser.Scene {
  distantSky!: Phaser.GameObjects.Rectangle;
  midSky!: Phaser.GameObjects.Rectangle;
  water!: Phaser.GameObjects.Rectangle;
  sun!: Phaser.GameObjects.Ellipse;

  constructor() {
    super('BuildBoatEnvironment');
  }

  editorCreate(): void {
    const { width, height } = this.cameras.main;

    // distantSky
    this.distantSky = this.add.rectangle(0, 0, width, height, 0x74C0F4);
    this.distantSky.setOrigin(0, 0);

    // midSky
    this.midSky = this.add.rectangle(0, 0, width, height * 0.65, 0x9FD6FF);
    this.midSky.setOrigin(0, 0);

    // water
    this.water = this.add.rectangle(0, height * 0.65, width, height * 0.35, 0x4A90E2);
    this.water.setOrigin(0, 0);

    // sun
    this.sun = this.add.circle(width - 120, 120, 70, 0xFFE082);
  }

  create(): void {
    this.editorCreate();
  }
}
```

#### Step 4: Extend with Logic

Now extend the visual scene with your game logic:

```typescript
// BuildBoatScene.ts (your modified file)
import BuildBoatEnvironment from './editor/BuildBoatEnvironment';

export default class BuildBoatScene extends BuildBoatEnvironment {
  // Your game logic here

  create() {
    super.create(); // Creates visual layout

    // Add your animations
    this.animateSun();
    this.createClouds();
    this.createWaves();

    // Add your game logic
    this.createBoatParts();
  }

  private animateSun() {
    this.tweens.add({
      targets: this.sun,
      scale: { from: 1, to: 1.05 },
      duration: 2000,
      yoyo: true,
      repeat: -1
    });
  }

  private createClouds() {
    // Your cloud creation code
  }

  private createWaves() {
    // Your wave animation code
  }
}
```

### Before vs After Comparison

**Before (All Code):**
```typescript
// 144 lines of graphics code
create() {
  const { width, height } = this.cameras.main;
  this.add.rectangle(0, 0, width, height, 0x74C0F4).setOrigin(0);
  this.add.rectangle(0, 0, width, height * 0.65, 0x9FD6FF).setOrigin(0);
  this.add.rectangle(0, height * 0.65, width, height * 0.35, 0x4A90E2).setOrigin(0);
  // ... 140 more lines
}
```

**After (Hybrid):**
```typescript
// Visual layout in .scene file (0 lines of code!)
// Only behavior in TypeScript (20 lines)
create() {
  super.create(); // Loads visual layout
  this.animateSun();
  this.createGameLogic();
}
```

## 📦 Phase 3: Create Prefabs

Prefabs are reusable game objects. Perfect for boat parts!

### Example: Create Hull Prefab

#### Step 1: Create Prefab Scene

1. In Phaser Editor: New → Prefab Scene → `HullPrefab.prefab`
2. Set prefab object type: **Image**
3. Base class: `Phaser.GameObjects.Image`

#### Step 2: Configure in Editor

1. Add hull image texture
2. Set origin to center (0.5, 0.5)
3. Enable interactive
4. Add user properties:
   - `boatType`: string (sailboat/speedboat/yacht)
   - `durability`: number (default: 100)
   - `color`: color (default: #FFFFFF)

#### Step 3: Use Prefab in Scene

Drag the prefab into any scene, or instantiate in code:

```typescript
// Auto-instantiate from scene editor (drag & drop)
// OR manually in code:
const hull = new HullPrefab(this, 400, 500);
this.add.existing(hull);

// Access user properties
hull.setData('durability', 80);
console.log(hull.getData('boatType')); // 'sailboat'
```

### Benefits of Prefabs

1. **Consistency**: All hulls look the same
2. **Easy Updates**: Change prefab → affects all instances
3. **Properties**: Define custom data per instance
4. **Nesting**: Prefabs can contain other prefabs
5. **Variants**: Create variations of base prefab

## 🔄 Phase 4: Full Migration Example

Let's migrate a complete simple scene: **MemoryScene Card**

### Original Code (TypeScript)

```typescript
// 195 lines just for card graphics!
private createCardGraphics() {
  const graphics = this.add.graphics();

  // Card back
  graphics.fillStyle(0x4A90E2, 1);
  graphics.fillRoundedRect(0, 0, 120, 140, 12);
  graphics.lineStyle(4, 0xFFFFFF, 0.8);
  graphics.strokeRoundedRect(0, 0, 120, 140, 12);
  // ... 40 more lines
  graphics.generateTexture('card-back', 120, 140);

  // Card front
  graphics.fillStyle(0xFFFFFF, 1);
  graphics.fillRoundedRect(0, 0, 120, 140, 12);
  // ... 40 more lines
  graphics.generateTexture('card-front', 120, 140);
}
```

### New Approach (Hybrid)

**1. Create Card Prefab** (`CardPrefab.prefab`)

Visual:
- Container with card front/back sprites
- Icon text child
- Proper layering

Properties:
- `icon`: string (emoji)
- `flipped`: boolean
- `matched`: boolean

**2. Simplified Scene Code**

```typescript
private createCard(x, y, iconIndex) {
  const card = new CardPrefab(this, x, y);
  card.setIcon(this.iconEmojis[iconIndex]);
  card.on('pointerdown', () => this.onCardClick(card));
  return card;
}
```

**Comparison:**
- Before: 195 lines of graphics code
- After: 5 lines to instantiate prefab
- Result: **97% code reduction!**

## 📐 Migration Checklist

### BuildBoatScene

- [ ] Create `BuildBoatEnvironment.scene` (background)
- [ ] Create boat part prefabs:
  - [ ] `HullPrefab.prefab`
  - [ ] `MastPrefab.prefab`
  - [ ] `SailPrefab.prefab`
  - [ ] (etc. for all 24 parts)
- [ ] Create `BuildBoatUI.scene` (buttons, text)
- [ ] Extend scenes in TypeScript with logic
- [ ] Test drag & drop still works
- [ ] Verify all 10 levels work

### MemoryScene

- [ ] Create `MemoryEnvironment.scene` (underwater background)
- [ ] Create `CardPrefab.prefab`
- [ ] Create `MemoryUI.scene` (score, moves display)
- [ ] Update scene to use prefabs
- [ ] Test flip animations
- [ ] Verify all difficulty levels

### DrawingScene

- [ ] Create `DrawingEnvironment.scene` (sky, water)
- [ ] Create `CanvasBorder.prefab`
- [ ] Create `ToolPalette.scene`
- [ ] Create template prefabs:
  - [ ] `SailboatTemplate.prefab`
  - [ ] `FishTemplate.prefab`
  - [ ] (etc.)
- [ ] Keep drawing logic in TypeScript

## 🎯 Migration Priority

Start with the **easiest wins**:

1. **High Priority** (do first):
   - ✅ Background/environment scenes
   - ✅ UI layouts
   - ✅ Static decorations

2. **Medium Priority** (do next):
   - Card prefabs
   - Boat part prefabs
   - Button prefabs

3. **Low Priority** (maybe later):
   - Complex animations
   - Particle effects
   - Dynamic tilemaps

## 🔧 Tips for Success

### 1. Start Small
Don't migrate everything. Try one scene first.

### 2. Keep Both Versions
Temporarily keep old code commented out:

```typescript
create() {
  super.create(); // New Phaser Editor version

  // Old version (remove after testing)
  // this.createEnvironment();

  this.setupGameLogic();
}
```

### 3. Test Frequently
After each migration step, test the scene works.

### 4. Use Version Control
Commit before major changes:

```bash
git checkout -b phaser-editor-migration
git commit -m "Migrate BuildBoatScene background to Phaser Editor"
```

### 5. Measure Results

Track your progress:
- Lines of code reduced
- Time to make layout changes
- Bugs introduced/fixed

## 🚨 Common Pitfalls

### Pitfall 1: Migrating Everything
❌ Don't: Convert all logic to visual scenes
✅ Do: Keep logic in TypeScript, visuals in editor

### Pitfall 2: Breaking Existing Code
❌ Don't: Delete old code immediately
✅ Do: Keep old code commented until tested

### Pitfall 3: Over-Using Prefabs
❌ Don't: Make a prefab for every single object
✅ Do: Prefabs for reusable elements only

### Pitfall 4: Ignoring TypeScript
❌ Don't: Try to do game logic in editor
✅ Do: Use editor for layout, code for behavior

## 📊 Success Metrics

You'll know migration is successful when:

1. **Faster Iteration**
   - Layout changes: seconds (not minutes)
   - No need to recompile for visual tweaks

2. **Less Code**
   - 50-70% reduction in scene setup code
   - Cleaner, more maintainable logic

3. **Better Collaboration**
   - Designers can tweak visuals
   - Developers focus on logic
   - Clear separation of concerns

4. **Improved Workflow**
   - Visual preview in editor
   - Instant feedback
   - Easy to duplicate/modify levels

## 🎓 Next Steps

1. **Read**: [PHASER_EDITOR_SETUP.md](PHASER_EDITOR_SETUP.md)
2. **Install**: Phaser Editor v5
3. **Generate**: Boat part images (use `scripts/generate-boat-images.html`)
4. **Create**: Your first scene visually
5. **Test**: Hybrid approach on one scene
6. **Expand**: Gradually migrate more scenes

---

**Remember**: Migration is a journey, not a destination. Take it one scene at a time!

Questions? Ask Claude Code using the Phaser Editor MCP server!
