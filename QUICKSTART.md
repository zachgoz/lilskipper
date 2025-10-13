# 🚀 Quick Start Guide

Get Little Skipper running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

This installs:
- Ionic V8 + React
- Phaser 3 (game engine)
- Howler.js (audio)
- localForage (storage)
- Capacitor (mobile)

## Step 2: Run Development Server

```bash
npm run dev
```

Open your browser to [http://localhost:3000](http://localhost:3000)

You should see:
- 🌊 Ocean-themed home screen
- ⛵ "Build a Boat" button
- 🐠 "Memory Game" button
- 🎨 "Draw & Color" button

## Step 3: Test the Games

### Build a Boat
1. Click "Build a Boat"
2. Drag the boat parts to the water
3. Watch the sparkles and hear sounds when you snap them in place!
4. Complete the boat to celebrate 🎉

### Memory Game
1. Click "Memory Game"
2. Watch the preview (cards flip to show all icons)
3. Tap cards to find matching pairs
4. Try to complete it in as few moves as possible!

### Draw & Color
1. Click "Draw & Color"
2. Tap color buttons at the bottom
3. Draw with your finger/mouse
4. Try the templates (sailboat, fish, anchor, waves)
5. Click "Done" to save!

## Step 4: Add Audio Files (Optional)

For full experience, add sound files to `public/assets/audio/`:

**Free sound resources:**
- [Freesound.org](https://freesound.org) - Search for:
  - "button click" → `tap.mp3`
  - "success chime" → `success.mp3`, `ding.mp3`
  - "ocean waves" → `wave.mp3`, `background-ocean.mp3`
  - "boat horn" → `horn.mp3`
  - "whoosh" → `whoosh.mp3`
  - "kids cheer" → `cheer.mp3`
  - "snap" → `snap.mp3`
  - "water splash" → `splash.mp3`

**Quick tip:** The app works without audio files - they're just warnings in the console.

## Step 5: Build for Mobile (Optional)

### iOS

```bash
# Build web assets
npm run build

# Add iOS platform
npx cap add ios

# Sync files
npx cap sync ios

# Open in Xcode
npx cap open ios
```

In Xcode:
1. Select your development team (Signing & Capabilities)
2. Choose a device or simulator
3. Click Run ▶️

### Android

```bash
# Build web assets
npm run build

# Add Android platform
npx cap add android

# Sync files
npx cap sync android

# Open in Android Studio
npx cap open android
```

In Android Studio:
1. Select a device or emulator
2. Click Run ▶️

## 🎯 Key Features to Test

### Toddler-Friendly UX
- ✨ Large buttons (easy to tap)
- 🎨 High contrast colors
- 🔊 Sound effects (if audio added)
- 📳 Haptic feedback (on mobile)
- 🚫 No text input needed

### Parental Gate
1. Click the ⚙️ settings icon (top right on home)
2. Try the parental gate:
   - **Option 1**: Tap the correct shape
   - **Option 2**: Hold button for 3 seconds

### Progress Tracking
- Complete boat levels → unlocks next level
- Play memory game → tracks high score
- Save drawings → counts milestones
- All saved in browser (no login needed!)

## 🐛 Common Issues

### Port already in use
```bash
# Kill process on port 3000
npx kill-port 3000
# Or use different port
npm run dev -- --port 3001
```

### Phaser not loading
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Touch not working in browser
- Use Chrome DevTools mobile emulation
- Or test on actual mobile device
- Desktop mouse works too!

### Audio not playing
- Normal! Browser autoplay policies require user interaction first
- Click anywhere on the page, then sounds will work
- Or add actual audio files (see Step 4)

## 📱 Mobile Testing Tips

### iOS Simulator
```bash
# List simulators
xcrun simctl list devices

# Boot a simulator
open -a Simulator

# Then run from Xcode
```

### Android Emulator
```bash
# List emulators
emulator -list-avds

# Start emulator
emulator -avd Pixel_5_API_33

# Then run from Android Studio
```

### Physical Device
- **iOS**: Connect device, trust computer, select in Xcode
- **Android**: Enable USB debugging, connect device, select in Android Studio

## 🎨 Customization Ideas

### Change Colors
Edit `src/theme/variables.css`:
```css
--ion-color-primary: #YOUR_COLOR;
```

### Add More Boats
Edit `src/game/scenes/BuildBoatScene.ts`:
- Add new level methods
- Define boat parts
- Add to levels object

### Adjust Difficulty
- **Build a Boat**: Change `snapDistance` (line ~200)
- **Memory**: Change grid sizes (line ~50)
- **Drawing**: Change brush `size` (line ~15)

## 🚀 Next Steps

1. **Add more content**: Create additional boat types
2. **Add audio**: Record custom sounds
3. **Create icons**: Design app icon at [Icon Kitchen](https://icon.kitchen)
4. **Test with toddlers**: Get real user feedback!
5. **Publish**: Submit to App Store / Google Play

## 📚 Learn More

- Full documentation: See [README.md](./README.md)
- Ionic docs: [ionicframework.com/docs](https://ionicframework.com/docs)
- Phaser docs: [phaser.io/docs](https://phaser.io/docs)
- Capacitor docs: [capacitorjs.com/docs](https://capacitorjs.com/docs)

## 💡 Pro Tips

1. **Development**:
   - Hot reload works in browser
   - Use React DevTools for debugging
   - Check browser console for errors

2. **Performance**:
   - Keep images optimized (<200KB each)
   - Preload audio files
   - Test on lower-end devices

3. **Toddler Testing**:
   - Observe without helping
   - Watch where they struggle
   - Note which sounds/animations they like
   - 5-minute sessions are enough!

---

**Happy Building! 🛠️ If you get stuck, check the [README.md](./README.md) or open an issue.**
