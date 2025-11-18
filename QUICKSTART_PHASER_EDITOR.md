# 🚀 Phaser Editor Quick Start

Get up and running with Phaser Editor in 15 minutes!

## ✅ Verification

First, verify your setup:

```bash
./scripts/verify-phaser-setup.sh
```

Expected output: 14 passed checks ✓

## 📝 3-Step Quick Start

### Step 1: Generate Images (5 minutes)

1. Open the image generator:
   ```bash
   open scripts/generate-boat-images.html
   ```

2. In your browser, click each download link:
   - hull.png
   - mast.png
   - sail.png
   - console.png
   - outboard.png
   - seat.png
   - card-front.png
   - card-back.png

3. Save all files to:
   ```
   public/assets/boats/  (boat parts)
   public/assets/cards/  (card images)
   ```

### Step 2: Install Phaser Editor (5 minutes)

1. Download: https://phasereditor2d.com/downloads
2. Choose **macOS** version
3. Install to Applications folder
4. Launch **Phaser Editor 2D**

### Step 3: Open Your Project (5 minutes)

1. In Phaser Editor: **File → Open Project**
2. Navigate to: `/Users/zgosling/sourcecode/lilskipper`
3. Click **Open**

Phaser Editor will:
- Detect your asset pack
- Show your project structure
- Be ready to create scenes!

## 🎨 Create Your First Scene

### Quick Tutorial: Background Scene

1. **Create Scene File**
   - Right-click: `src/game/scenes/editor/`
   - Select: **New → Scene File**
   - Name: `TestBackground.scene`
   - Template: **Scene**

2. **Configure Scene**
   - Inspector Panel (right side)
   - Scene Key: `'TestBackground'`
   - Class Name: `TestBackground`
   - Width: 800
   - Height: 600

3. **Add Background**
   - Drag from **Blocks** panel:
     - Rectangle (full screen)
   - Set properties:
     - Fill Color: `#4A90E2` (ocean blue)
     - Width: 800
     - Height: 600
     - Origin X: 0
     - Origin Y: 0

4. **Add Sun**
   - Drag: Circle
   - Properties:
     - X: 700
     - Y: 100
     - Radius: 60
     - Fill Color: `#FFE082` (yellow)

5. **Save Scene**
   - File → Save (Cmd+S)

6. **View Generated Code**
   - Check: `src/game/scenes/editor/TestBackground.ts`

### Test Your Scene

Add to your game config:

```typescript
// src/game/config.ts
import TestBackground from './scenes/editor/TestBackground';

const sceneMap = {
  'build-boat': BuildBoatScene,
  'memory': MemoryScene,
  'drawing': DrawingScene,
  'test': TestBackground  // ← Add this
};
```

Run your game and select the test scene!

## 🎯 Next Steps

### Beginner Tasks

1. **Add More Objects**
   - Drag images from Asset Pack
   - Position with mouse
   - See changes instantly!

2. **Create a Boat Part Prefab**
   - New → Prefab Scene
   - Add hull image
   - Save as `HullPrefab.prefab`
   - Drag into other scenes

3. **Use MCP Commands**
   Ask Claude Code:
   ```
   "Show me all scenes in my project"
   "Take a screenshot of TestBackground scene"
   "What textures are available?"
   ```

### Intermediate Tasks

4. **Migrate BuildBoatScene Background**
   - Create `BuildBoatEnvironment.scene`
   - Add sky, water, sun, clouds
   - Replace 144 lines of code with visual scene!

5. **Create Card Prefab**
   - Make reusable memory card
   - Add flip animation
   - Use across all difficulty levels

6. **Build Complete Level**
   - Layout all boat parts
   - Add snap zones
   - Visual level editor!

## 💡 Pro Tips

### Keyboard Shortcuts

- **Cmd+S**: Save scene
- **Cmd+Z**: Undo
- **Cmd+C/V**: Copy/paste objects
- **Delete**: Remove selected object
- **Arrows**: Nudge position
- **Shift+Arrows**: Nudge 10px

### Inspector Panel

Every object has properties:
- **Transform**: x, y, scale, angle
- **Visual**: tint, alpha, blend mode
- **Interactive**: enable clicking
- **Physics**: add Arcade body (if needed)

### Asset Pack Panel

- Shows all loaded assets
- Drag into scene to use
- Preview textures
- Manage animations

### Prefab Benefits

- Reusable across scenes
- Update once, changes everywhere
- Add custom properties
- Create variants

## 🐛 Common Issues

### Images Not Showing

**Problem**: Dragged image but nothing appears

**Solution**:
1. Check Asset Pack panel shows the texture
2. Verify file exists in `public/assets/`
3. Refresh asset pack (right-click → Refresh)

### Scene Won't Save

**Problem**: Error when saving scene

**Solution**:
1. Check `src/game/scenes/editor/` exists
2. Verify file permissions
3. Check for TypeScript errors

### MCP Commands Not Working

**Problem**: Claude Code can't query scenes

**Solution**:
1. Verify Phaser Editor is running
2. Check: `claude mcp list` shows "Connected"
3. Restart Phaser Editor if needed

### TypeScript Errors

**Problem**: Generated code has compilation errors

**Solution**:
1. Make sure Phaser is installed: `npm list phaser`
2. Check `tsconfig.json` includes `src/**/*`
3. Re-save scene to regenerate code

## 📚 Learning Resources

### Official Docs

- **Phaser Editor Manual**: https://phasereditor2d.com/docs/
- **Video Tutorials**: https://www.youtube.com/@PhaserEditor2D
- **Phaser 3 Examples**: https://phaser.io/examples

### Your Project Docs

- [PHASER_EDITOR_SETUP.md](PHASER_EDITOR_SETUP.md) - Complete guide
- [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) - Migration strategy
- [.claude/MCP_COMMANDS.md](.claude/MCP_COMMANDS.md) - MCP reference

### Community

- **Discord**: https://discord.gg/phaser
- **Forum**: https://phaser.discourse.group/

## 🎉 Success Checklist

You're ready when you can:

- [ ] Generate boat part PNG images
- [ ] Install and launch Phaser Editor
- [ ] Open your project in the editor
- [ ] Create a new .scene file
- [ ] Add objects to the scene visually
- [ ] See generated TypeScript code
- [ ] Run the scene in your game
- [ ] Use MCP commands via Claude Code

## 🚀 You're Ready!

You now have:
- ✅ Working MCP server connection
- ✅ Asset pack configured
- ✅ Directory structure ready
- ✅ Comprehensive documentation
- ✅ Image generation tool
- ✅ Verification script

**Time to build!**

### Immediate Actions

```bash
# 1. Generate images
open scripts/generate-boat-images.html

# 2. Verify setup
./scripts/verify-phaser-setup.sh

# 3. Install Phaser Editor
open https://phasereditor2d.com/downloads
```

### First Project

Create your first visual scene:
1. Open Phaser Editor
2. Load your project
3. Create `TestBackground.scene`
4. Add sky, sun, water
5. Save and test!

---

**Questions?** Ask Claude Code using the MCP server!

Example: `"Claude, help me create a boat prefab in Phaser Editor"`
