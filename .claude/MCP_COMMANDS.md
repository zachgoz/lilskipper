# Phaser Editor MCP Commands Reference

Quick reference for using the Phaser Editor MCP server with Claude Code.

## 🔍 Discovery Commands

### List All Scenes
```
Can you show me all scenes in this project?
```
Uses: `mcp__phaser-editor__ide-get-all-scenes-in-project`

### Get Active Scene
```
What scene is currently open in Phaser Editor?
```
Uses: `mcp__phaser-editor__ide-get-active-scene`

### List All Prefabs
```
Show me all available prefabs
```
Uses: `mcp__phaser-editor__ide-get-all-prefabs-in-project`

## 📊 Scene Analysis

### Get Scene Data
```
Show me the structure of BuildBoatScene
```
Uses: `mcp__phaser-editor__scene-get-scene-data`

### Get Scene Screenshot
```
Take a screenshot of the current scene
```
Uses: `mcp__phaser-editor__scene-get-screenshot`

### Get Scene Dimensions
```
What are the dimensions of this scene?
```
Uses: `mcp__phaser-editor__scene-get-scene-dimension`

## 🎨 Asset Management

### List Available Textures
```
What textures are available in the project?
```
Uses: `mcp__phaser-editor__assets-get-available-textures`

### Get Texture Size
```
What's the size of the hull texture?
```
Uses: `mcp__phaser-editor__assets-get-texture-size`

### List Asset Packs
```
Show me all asset packs
```
Uses: `mcp__phaser-editor__assets-get-available-asset-packs`

### List Animations
```
What sprite animations are available?
```
Uses: `mcp__phaser-editor__assets-get-available-animations`

## 🛠️ Scene Creation

### Create New Scene
```
Create a new scene called TestLevel
```
Uses: `mcp__phaser-editor__ide-create-new-scene`

### Create New Prefab
```
Create a prefab called SailboatPart
```
Uses: `mcp__phaser-editor__ide-create-new-prefab-scene`

### Open Scene
```
Open the BuildBoatScene in Phaser Editor
```
Uses: `mcp__phaser-editor__ide-open-scene`

### Save Scene
```
Save the current scene
```
Uses: `mcp__phaser-editor__ide-save-scene`

## 🎮 Game Object Operations

### Add Game Objects
```
Add a hull image at position (400, 500) to the scene
```
Uses: `mcp__phaser-editor__scene-add-game-objects`

Example:
```json
{
  "objects": [{
    "type": "Image",
    "properties": {
      "x": 400,
      "y": 500,
      "texture": {
        "key": "hull"
      },
      "label": "hullSprite"
    }
  }]
}
```

### Update Game Objects
```
Move the hull sprite to position (450, 520)
```
Uses: `mcp__phaser-editor__scene-update-game-objects`

### Delete Game Objects
```
Delete the mast sprite from the scene
```
Uses: `mcp__phaser-editor__scene-delete-game-objects`

## 🎯 Prefab Operations

### Get Nested Prefabs
```
Show me all nested prefabs in this boat prefab
```
Uses: `mcp__phaser-editor__scene-get-nested-prefabs-instances`

### Declare Prefab Property
```
Add a user property called 'speed' to the boat prefab
```
Uses: `mcp__phaser-editor__scene-declare-prefab-property`

### Delete Prefab Property
```
Remove the 'speed' property from the boat prefab
```
Uses: `mcp__phaser-editor__scene-delete-prefab-property`

## 🏗️ Tilemap Operations

### Get Available Tilemaps
```
What tilemaps are in the project?
```
Uses: `mcp__phaser-editor__assets-get-available-tilemaps`

### Add Editable Tilemap
```
Create a 10x10 tilemap with 32px tiles
```
Uses: `mcp__phaser-editor__scene-add-editable-tilemap`

## 🎨 Visual Effects

### Add Filters
```
Add a glow filter to the hull sprite
```
Uses: `mcp__phaser-editor__scene-add-game-object-filters`

Example:
```json
{
  "objects": [{
    "type": "Glow",
    "parentId": "hull_id",
    "properties": {
      "color": "#FFD93D",
      "outerStrength": 4,
      "innerStrength": 2
    }
  }]
}
```

## ⚡ Physics Operations

### Enable Arcade Physics
```
Add arcade physics to the boat hull
```
Uses: `mcp__phaser-editor__scene-enable-arcade-physics-body`

### Disable Physics
```
Remove physics from the boat hull
```
Uses: `mcp__phaser-editor__scene-disable-arcade-physics-body`

## 📋 Object Lists

### Create Object List
```
Create an object list for all boat parts
```
Uses: `mcp__phaser-editor__scene-add-object-list`

### Update Object List
```
Add the sail to the boatParts list
```
Uses: `mcp__phaser-editor__scene-update-object-list`

## 💡 Pro Tips

1. **Get System Instructions First**
   Before using complex tools, run:
   ```
   Get the Phaser Editor system instructions
   ```
   This tells Claude the exact structure needed for game objects.

2. **Chain Commands**
   ```
   Create a new scene called Level2, add a hull at (400,500),
   and add a glow filter to it
   ```

3. **Use Natural Language**
   The MCP server understands context:
   ```
   Add a boat hull in the center of the scene
   ```

4. **Preview Before Saving**
   ```
   Take a screenshot so I can see what it looks like
   ```

5. **Save Frequently**
   ```
   Save all changes to the scene
   ```

## 🚨 Common Errors

### Scene ID Not Found
Error: Scene with that ID doesn't exist
Solution: List all scenes first to get the correct ID

### Texture Not Found
Error: Texture key doesn't exist
Solution: Check available textures or update asset pack

### Invalid Property
Error: Property not recognized for this object type
Solution: Use `get-system-instructions` to see valid properties

## 📖 Examples

### Complete Workflow: Create a Boat Part Prefab

```
1. Create a new prefab called BoatHull
2. Add an image with the hull texture at position (0, 0)
3. Add a user property called 'durability' with type number and default value 100
4. Add a glow filter with color #4A90E2
5. Save the prefab
6. Take a screenshot
```

### Analyze Existing Scene

```
1. List all scenes
2. Open BuildBoatScene
3. Get the scene data
4. Show me all game objects with their positions
5. Take a screenshot of the full scene
```

---

**Remember**: The MCP server works best when Phaser Editor v5 is running!

For detailed documentation: [PHASER_EDITOR_SETUP.md](../PHASER_EDITOR_SETUP.md)
