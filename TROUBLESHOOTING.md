# 🔧 Troubleshooting Guide

## Issue: White Screen When Starting Games

### Symptoms
- Home page loads fine
- Clicking a game button shows white screen
- Console error: "Framebuffer status: Incomplete Attachment"
- Error mentions WebGL/Phaser

### Cause
Phaser 3.90.0 has WebGL framebuffer initialization issues on some systems.

### Solution ✅ FIXED
Changed Phaser renderer from WebGL to Canvas in `src/game/config.ts`:

```typescript
type: Phaser.CANVAS  // Instead of Phaser.AUTO
```

**Why this is better:**
- More compatible across browsers
- Simpler rendering (no WebGL complexity)
- Perfect for 2D toddler games
- No 3D features needed anyway

### Test the Fix
1. Refresh the browser (Ctrl+R or Cmd+R)
2. Click "Build a Boat"
3. You should see:
   - Ocean blue background
   - Sky at top
   - Waves at bottom
   - Draggable boat parts

---

## Issue: Manifest Icon Warnings

### Symptoms
```
Error while trying to use icon from Manifest: /icon-192.png
(Download error or resource isn't a valid image)
```

### Solution ✅ FIXED
Updated `public/manifest.json` to use the existing SVG icon:

```json
"icons": [{
  "src": "/boat-icon.svg",
  "sizes": "any",
  "type": "image/svg+xml"
}]
```

**This warning is cosmetic and doesn't affect functionality.**

---

## Common Issues

### 1. Audio Warnings

**Symptom:**
```
Failed to load sound: tap.mp3
Failed to load sound: success.mp3
```

**Solution:**
This is **expected and normal**! The app works without audio files.

To add audio (optional):
1. Download from Freesound.org
2. Place in `public/assets/audio/`
3. See QUICKSTART.md for details

---

### 2. Port Already in Use

**Symptom:**
```
Error: Port 3000 is already in use
```

**Solution:**
```bash
# Option 1: Kill the process
npx kill-port 3000

# Option 2: Use different port
npm run dev -- --port 3001
```

---

### 3. React Router TypeScript Errors

**Symptom:**
IDE shows red squiggles on `useParams` or `useHistory`

**Solution:**
Restart your IDE:
- VSCode: Cmd+Shift+P → "Reload Window"
- Or close and reopen

The types are correct (React Router 5), just need IDE refresh.

---

### 4. Game Parts Not Dragging

**Symptom:**
Can't drag boat parts in Build a Boat game

**Possible causes:**

**A) Canvas input not working:**
Check browser console for Phaser errors

**B) Touch events blocked:**
Make sure you're clicking directly on the parts, not the background

**C) Game not initialized:**
Refresh the page

**Debug:**
Open browser console (F12) and look for:
- Red errors
- Phaser initialization messages
- Should see: "Phaser v3.90.0 (Canvas | Web Audio)"

---

### 5. Styles Not Loading

**Symptom:**
App looks unstyled, no colors

**Solution:**
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Restart dev server
npm run dev
```

---

### 6. Capacitor Warnings in Browser

**Symptom:**
```
Capacitor plugin not available
StatusBar not available
Haptics not available
```

**Solution:**
This is **normal in the browser**! Capacitor plugins only work on real devices.

These warnings disappear when you:
- Build for iOS (`npx cap open ios`)
- Build for Android (`npx cap open android`)

---

### 7. TypeScript Build Errors

**Symptom:**
```
npm run build fails with TS errors
```

**Solution:**
```bash
# Check for errors
npx tsc --noEmit

# Fix if needed
npm install --save-dev typescript@latest
```

---

### 8. Phaser Game Doesn't Fit Screen

**Symptom:**
Game is too small/large or cut off

**Solution:**
Already configured with responsive scaling:
```typescript
scale: {
  mode: Phaser.Scale.RESIZE,
  autoCenter: Phaser.Scale.CENTER_BOTH
}
```

If still an issue:
- Refresh browser
- Check browser zoom is 100%
- Try different browser

---

## Testing Checklist

When games load correctly, you should see:

### Build a Boat Game
✅ Ocean blue background with sky
✅ Waves at bottom
✅ Level name at top ("Little Kayak")
✅ Instruction text
✅ Draggable boat parts (2-3 pieces)
✅ Back button (top-left)

### Memory Game
✅ Blue background
✅ Game title with fish emoji
✅ Grid of cards (face down)
✅ 2-second preview (cards flip)
✅ Stats (Moves, Matches)
✅ Cards clickable

### Draw & Color
✅ White canvas in center
✅ Color palette at bottom (9 circles)
✅ Action buttons (Clear, Template, Done)
✅ Can draw with mouse/touch
✅ Template button cycles through designs

---

## Still Having Issues?

### Quick Fixes to Try

1. **Hard refresh:**
   - Chrome/Edge: Ctrl+Shift+R (Cmd+Shift+R on Mac)
   - Firefox: Ctrl+F5 (Cmd+Shift+R on Mac)

2. **Clear everything:**
   ```bash
   rm -rf node_modules/.vite dist
   npm run dev
   ```

3. **Reinstall:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run dev
   ```

4. **Check browser console:**
   - Press F12
   - Look at Console tab
   - Copy any red errors
   - Check this guide for solution

### Browser Compatibility

**Recommended:**
- Chrome 90+
- Edge 90+
- Safari 14+
- Firefox 88+

**Known issues:**
- IE 11: Not supported (use Edge)
- Very old browsers: May not support Canvas API

---

## Debug Mode

Enable Phaser debug to see collision boxes:

Edit `src/game/config.ts`:
```typescript
physics: {
  arcade: {
    debug: true  // Enable debug rendering
  }
}
```

This shows:
- Collision boundaries
- Sprite positions
- Physics bodies

---

## Getting Help

1. Check browser console (F12) for errors
2. Search this guide for the error message
3. Check README.md for general info
4. Check DEVELOPMENT.md for technical details

---

## Quick Status Check

Run this in browser console (F12):

```javascript
// Check Phaser loaded
console.log('Phaser:', typeof Phaser !== 'undefined' ? 'Loaded ✓' : 'Not loaded ✗');

// Check game canvas
console.log('Canvas:', document.querySelector('canvas') ? 'Found ✓' : 'Not found ✗');

// Check Ionic
console.log('Ionic:', document.querySelector('ion-app') ? 'Loaded ✓' : 'Not loaded ✗');
```

Expected output:
```
Phaser: Loaded ✓
Canvas: Found ✓  (when in a game)
Ionic: Loaded ✓
```

---

**Most issues are fixed by refreshing the browser after the Canvas renderer fix!**
