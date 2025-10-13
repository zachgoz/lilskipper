# 🚤 Little Skipper - STEM Learning App for Toddlers

An engaging Ionic V8 React + Phaser 3 PWA/iOS/Android app that teaches toddlers (ages 2-5) about boats and sailing through interactive games and activities.

## ✨ Features

### 🛠️ Build a Boat Game
- **10 Progressive Levels**: From simple kayaks to complex submarines
- **Drag-and-Drop Mechanics**: Large, toddler-friendly parts with generous snap zones
- **Visual Feedback**: Sparkles, animations, and sound effects for every success
- **Star Ratings**: Track progress and unlock new levels
- **Boat Types**: Kayak, Sailboat, Canoe, Speedboat, Yacht, Tugboat, Ferry, Trawler, Cargo Ship, Submarine
- **Animated Boatyard**: Swaying sun, clouds, and dolphin companion make the scene feel alive
- **Helpful Prompts**: Friendly hints pulse the next target so little builders never get stuck

### 🐠 Memory Match Game
- **Progressive Difficulty**: Starts with 2×3 grid, expands based on skill
- **Ocean-Themed Cards**: Boats, fish, anchors, and sea creatures
- **Match Tracking**: Moves counter and scoring system
- **Preview Mode**: Shows all cards briefly at the start
- **High Score System**: Tracks best performances
- **Guided Play**: Animated turtle buddy narrates the next step with upbeat messages
- **Undersea Atmosphere**: Light rays and bubbles keep the play area calm and immersive

### 🎨 Draw & Color Game
- **Drawing Canvas**: Free-form drawing with smooth touch support
- **9 Color Tools**: Bright, high-contrast colors perfect for toddlers
- **Templates**: 5 boat-themed templates (sailboat, fish, anchor, waves)
- **Large Brush**: Easy for small fingers to use
- **Eraser Tool**: Fix mistakes easily
- **Save Progress**: Tracks drawing milestones
- **Sunny Studio**: Animated shoreline backdrop and seagull buddy cheer on creativity
- **Playful Prompts**: Helper messages celebrate strokes, wipes, and tracing

## 🎯 Toddler-Specific UX Features

- ✅ **Large tap targets** (≥64px) for easy touching
- ✅ **High contrast colors** for visibility
- ✅ **Haptic feedback** on all interactions
- ✅ **No text input required** - icon-based navigation
- ✅ **Offline-first** - works without internet
- ✅ **Quick boot** (<2s startup time)
- ✅ **3-5 minute play sessions** - perfect attention spans
- ✅ **Obvious "Again!" buttons** - easy replay
- ✅ **Parental Gate** - protects settings with shape recognition or 3-second hold

## 🏗️ Architecture

### Tech Stack
- **Framework**: Ionic V8 + React 18
- **Game Engine**: Phaser 3.80+
- **Audio**: Howler.js
- **Storage**: IndexedDB via localForage
- **Mobile**: Capacitor 6
- **Build Tool**: Vite 5
- **Language**: TypeScript

### Project Structure

```
lilskipper/
├── src/
│   ├── components/
│   │   └── ParentalGate.tsx        # Settings protection
│   ├── pages/
│   │   ├── Home.tsx                # Main menu
│   │   └── GamePage.tsx            # Game container
│   ├── game/
│   │   ├── config.ts               # Phaser configuration
│   │   └── scenes/
│   │       ├── BuildBoatScene.ts   # Boat building game
│   │       ├── MemoryScene.ts      # Memory match game
│   │       └── DrawingScene.ts     # Drawing game
│   ├── services/
│   │   ├── audio.ts                # Sound management
│   │   └── progress.ts             # Game progress tracking
│   └── theme/
│       ├── variables.css           # Toddler-friendly colors
│       └── global.css              # Global styles
├── public/
│   ├── assets/
│   │   └── audio/                  # Sound effects (to be added)
│   └── manifest.json               # PWA manifest
├── capacitor.config.ts
├── package.json
└── vite.config.ts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- iOS: Xcode 14+ (for iOS builds)
- Android: Android Studio (for Android builds)

### Installation

1. **Clone and install dependencies**:
```bash
cd lilskipper
npm install
```

2. **Run in browser (PWA mode)**:
```bash
npm run dev
```
Then open [http://localhost:3000](http://localhost:3000)

### Building for Mobile

#### iOS

1. **Add iOS platform**:
```bash
npm run build
npx cap add ios
npx cap sync ios
```

2. **Open in Xcode**:
```bash
npx cap open ios
```

3. **Configure in Xcode**:
   - Set your Team in Signing & Capabilities
   - Update Bundle Identifier
   - Add app icons (see Assets section below)

4. **Run on device**: Select device and click Run ▶️

#### Android

1. **Add Android platform**:
```bash
npm run build
npx cap add android
npx cap sync android
```

2. **Open in Android Studio**:
```bash
npx cap open android
```

3. **Configure**:
   - Update `applicationId` in `app/build.gradle`
   - Add app icons (see Assets section below)

4. **Run on device**: Select device and click Run ▶️

## 🎨 Adding Assets

### Audio Files
Place sound effect files in `public/assets/audio/`:
- `tap.mp3` - Button taps
- `success.mp3` - Success celebrations
- `wave.mp3` - Water sounds
- `horn.mp3` - Boat horn
- `ding.mp3` - Correct actions
- `whoosh.mp3` - Drag sounds
- `cheer.mp3` - Level complete
- `snap.mp3` - Pieces snapping
- `splash.mp3` - Water splashes
- `background-ocean.mp3` - Background music

**Recommended**: Use royalty-free sounds from:
- [Freesound.org](https://freesound.org)
- [Zapsplat.com](https://zapsplat.com)
- [Mixkit.co](https://mixkit.co)

### App Icons

1. **Generate icons** using a service like [Icon Kitchen](https://icon.kitchen):
   - Upload a boat-themed icon (SVG recommended)
   - Generate iOS and Android icons
   - Generate PWA icons (192x192, 512x512)

2. **Add to project**:
   - iOS: Replace icons in `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
   - Android: Replace icons in `android/app/src/main/res/mipmap-*/`
   - PWA: Add `icon-192.png` and `icon-512.png` to `public/`

### Boat Part Images (Optional)

To replace the placeholder graphics with real images:

1. Create/download boat part images (hull, mast, sail, etc.)
2. Place in `public/assets/boats/`
3. Update `BuildBoatScene.ts`:
   - Replace `createPlaceholderGraphics()` with:
   ```typescript
   this.load.image('hull', 'assets/boats/hull.png');
   this.load.image('mast', 'assets/boats/mast.png');
   // etc.
   ```

## 🎮 Game Features in Detail

### Build a Boat
- **Generous Snap Distance**: 100px radius for easy placement
- **Visual Guides**: Translucent target zones show where parts go
- **Part Scaling**: Parts grow on pickup, shrink on drop
- **Celebration**: Confetti particles + sound effects on completion
- **Progressive Unlocking**: Complete one level to unlock the next

### Memory Game
- **Adaptive Difficulty**:
  - Easy: 2×3 grid (6 pairs)
  - Medium: 4×4 grid (8 pairs) - unlocks at 5+ score
  - Hard: 4×6 grid (12 pairs) - unlocks at 10+ score
- **Preview System**: 2-second preview of all cards
- **Smooth Animations**: Card flip with 3D perspective effect
- **Score Calculation**: `(pairs × 3) - moves`

### Drawing Game
- **Smooth Drawing**: Interpolated lines for fluid strokes
- **9 Colors + Eraser**: Large, emoji-labeled buttons
- **Templates**:
  - Blank canvas
  - Sailboat outline
  - Fish shape
  - Anchor
  - Ocean waves
- **Auto-Save**: Tracks drawing count for achievements

## 🔒 Parental Gate

Protects settings/purchases with two methods:
1. **Shape Recognition**: Tap the correct shape (circle/square/triangle)
2. **3-Second Hold**: Press and hold button for 3 seconds

Prevents accidental exits or purchases by toddlers.

## 💾 Data Storage

All data stored locally using IndexedDB (via localForage):
- Game progress and stars
- Unlocked levels
- High scores
- Sticker collections
- Drawing count

No server required - fully offline!

## 🎵 Sound Design

### Audio Service Features
- Preloaded sound effects for instant playback
- Background ocean sounds (loops)
- Volume controls (music/SFX separate)
- Mobile-optimized (HTML5 audio)
- Graceful degradation if sounds unavailable

### Haptic Feedback
Uses Capacitor Haptics:
- Light: Taps, selections
- Medium: Tool changes, matches
- Heavy: Success, level complete

## 🧪 Testing

### Browser Testing
```bash
npm run dev
```
- Test on desktop browser
- Use Chrome DevTools mobile emulation
- Check responsive layouts

### Device Testing
- **iOS**: Use Xcode Simulator or physical device
- **Android**: Use Android Emulator or physical device
- Test touch interactions
- Verify haptic feedback
- Check audio playback

## 📱 PWA Features

- **Installable**: Add to home screen
- **Offline-first**: Service worker caching
- **Splash screen**: Branded loading screen
- **Status bar**: Themed status bar on mobile
- **Portrait orientation**: Locked to portrait mode

## 🎨 Customization

### Colors
Edit `src/theme/variables.css`:
```css
--ion-color-primary: #4A90E2;  /* Ocean blue */
--ion-color-secondary: #FFD93D; /* Sunny yellow */
--ion-color-success: #4CAF50;   /* Success green */
```

### Fonts
Edit `src/theme/global.css`:
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', ...
```

### Game Difficulty
Edit game scenes to adjust:
- Snap distance (BuildBoatScene)
- Grid size (MemoryScene)
- Brush size (DrawingScene)

## 🐛 Troubleshooting

### Audio Not Playing
- Check browser autoplay policy
- Ensure audio files exist in `public/assets/audio/`
- Try interacting with page first (browser requirement)

### Game Not Loading
- Check browser console for errors
- Verify Phaser is installed: `npm list phaser`
- Clear browser cache

### Touch Not Working
- Verify `touch-action: none` is set
- Check Phaser input configuration
- Test on actual device (not just emulator)

### iOS Build Fails
- Update Xcode to latest version
- Clean build folder: `Product > Clean Build Folder`
- Reset Capacitor: `npx cap sync ios`

## 📦 Production Build

```bash
# Build web assets
npm run build

# Preview production build
npm run preview

# Sync to native platforms
npx cap sync

# Build iOS (in Xcode)
npx cap open ios
# Then: Product > Archive

# Build Android (in Android Studio)
npx cap open android
# Then: Build > Generate Signed Bundle/APK
```

## 🚀 Deployment

### Web (PWA)
Deploy `dist/` folder to:
- Netlify
- Vercel
- Firebase Hosting
- GitHub Pages

### App Stores
- **iOS**: Submit via App Store Connect
- **Android**: Submit via Google Play Console

## 📝 License

This project is provided as-is for educational and commercial use.

## 🙏 Credits

- Built with [Ionic Framework](https://ionicframework.com)
- Game engine: [Phaser 3](https://phaser.io)
- Audio: [Howler.js](https://howlerjs.com)
- Storage: [localForage](https://localforage.github.io/localForage/)

## 🤝 Contributing

Contributions welcome! Ideas for improvement:
- Add more boat types
- Create additional mini-games
- Improve graphics/animations
- Add multilingual support
- Create sticker reward system UI
- Add parent dashboard

## 📧 Support

For questions or issues, please open an issue on the repository.

---

**Made with ❤️ for little sailors everywhere! ⛵**
