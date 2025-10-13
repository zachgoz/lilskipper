# 🎯 Centering Fix for Memory & Drawing Games

## The Problem

Memory and Drawing games were not centered - content was barely visible or off-screen.

**Symptoms:**
- Cards/canvas appearing off viewport
- Games not properly centered
- Content pushed to edges

## Root Causes

1. **Scale mode**: `RESIZE` mode was causing viewport issues
2. **Fixed offsets**: Hard-coded Y positions weren't accounting for viewport properly
3. **Poor margin calculations**: Space for UI elements not properly calculated

## Solutions Applied ✅

### 1. Fixed Game Scale Mode
**File:** `src/game/config.ts`

Changed from:
```typescript
scale: {
  mode: Phaser.Scale.RESIZE,  // ❌ Causes viewport issues
  width: '100%',
  height: '100%'
}
```

To:
```typescript
scale: {
  mode: Phaser.Scale.FIT,  // ✅ Better centering
  autoCenter: Phaser.Scale.CENTER_BOTH,
  width: window.innerWidth,
  height: window.innerHeight
}
```

**Why better:**
- FIT mode maintains aspect ratio
- Centers content properly
- Works consistently across devices

### 2. Fixed Memory Game Layout
**File:** `src/game/scenes/MemoryScene.ts`

**Before:**
```typescript
const startY = (height - gridHeight) / 2 + cardHeight / 2 + 50;
// ❌ Fixed +50 offset pushed content down
```

**After:**
```typescript
const uiTopSpace = 200; // Space for title and stats
const availableHeight = height - uiTopSpace;
const startY = uiTopSpace + (availableHeight - gridHeight) / 2 + cardHeight / 2;
// ✅ Properly centers within available space
```

**What changed:**
- Calculates available space after UI
- Centers grid in remaining area
- Accounts for title and stats properly

### 3. Fixed Drawing Canvas Layout
**File:** `src/game/scenes/DrawingScene.ts`

**Before:**
```typescript
const canvasWidth = width - 40;
const canvasHeight = height - 300;  // ❌ Fixed offset
const canvasY = 130;
```

**After:**
```typescript
const topMargin = 120;    // Title space
const bottomMargin = 180; // Palette + buttons
const sideMargin = 20;

const canvasWidth = width - (sideMargin * 2);
const canvasHeight = height - topMargin - bottomMargin;
const canvasY = topMargin;
// ✅ Dynamic margins based on UI elements
```

**What changed:**
- Explicit margins for each UI area
- Canvas fills available space
- Properly accounts for palette and buttons

## What You Should See Now

### Memory Game
✅ **Title** centered at top
✅ **Stats** (Moves/Matches) visible below title
✅ **Card grid** centered in remaining space
✅ **Cards fully visible** and clickable
✅ **Even spacing** around all elements

### Drawing Game
✅ **Title** centered at top
✅ **Canvas** fills middle area (white rectangle)
✅ **Color palette** at bottom (9 circles)
✅ **Action buttons** (Clear, Template, Done) below palette
✅ **All elements visible** in viewport

## Testing

### Memory Game Test:
1. Click "Memory Game" from home
2. **Should see:**
   - Title at top
   - Grid of cards in center
   - Stats visible
   - All cards clickable
   - No scrolling needed

### Drawing Game Test:
1. Click "Draw & Color" from home
2. **Should see:**
   - Title at top
   - Large white canvas in middle
   - Color palette at bottom
   - Three buttons below
   - Can draw on entire canvas

## Refresh Required

**Hard refresh** to load fixes:
- **Mac**: Cmd + Shift + R
- **Windows/Linux**: Ctrl + Shift + R

## All Fixes Summary

Now applied:
1. ✅ Canvas renderer (not WebGL)
2. ✅ Level loading fixed
3. ✅ Audio silenced
4. ✅ Particle API updated
5. ✅ **Game scaling fixed (FIT mode)**
6. ✅ **Memory game centered**
7. ✅ **Drawing canvas centered**

## Expected Layout

```
┌──────────────────────────┐
│    🐠 Memory Match 🐠    │ ← Title
│   Moves: 0  Matches: 0   │ ← Stats
│                          │
│   ┌──┐ ┌──┐ ┌──┐       │
│   │  │ │  │ │  │       │
│   └──┘ └──┘ └──┘       │ ← Cards
│   ┌──┐ ┌──┐ ┌──┐       │   centered
│   │  │ │  │ │  │       │
│   └──┘ └──┘ └──┘       │
│                          │
└──────────────────────────┘
```

```
┌──────────────────────────┐
│    🎨 Draw & Color 🎨    │ ← Title
│                          │
│   ┌────────────────┐    │
│   │                │    │
│   │  White Canvas  │    │ ← Drawing
│   │                │    │   area
│   │                │    │
│   └────────────────┘    │
│                          │
│   🔴 🔵 🟢 🟡 🟠 🟣    │ ← Colors
│   Clear Template Done    │ ← Buttons
└──────────────────────────┘
```

## Troubleshooting

### Still Off-Center?

1. **Clear browser cache completely**
   ```bash
   rm -rf node_modules/.vite
   npm run dev
   ```

2. **Check browser zoom** - Should be 100%

3. **Try different browser** - Chrome recommended

4. **Check console** - Should be no errors

### Canvas Too Small?

The canvas now dynamically sizes based on viewport:
- Fills available space
- Leaves room for UI
- Scales with window

If still small, your browser window might be small. Try maximizing it.

---

**🎨 Refresh your browser and the games will be properly centered! 🎉**
