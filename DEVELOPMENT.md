# 🛠️ Development Guide

Technical documentation for developers working on Little Skipper.

## Architecture Overview

### Technology Decisions

#### Why Ionic + React?
- **Cross-platform**: One codebase → PWA, iOS, Android
- **Native feel**: Ionic components look native on each platform
- **React**: Popular, maintainable, great ecosystem
- **Capacitor**: Modern native bridge (better than Cordova)

#### Why Phaser 3?
- **Mature**: Battle-tested game engine
- **Performant**: Canvas/WebGL rendering
- **Simple**: No 3D complexity needed
- **Touch-optimized**: Built-in pointer/touch handling
- **Lightweight**: Can disable physics for simpler games

#### Why Howler.js?
- **Cross-browser**: Handles audio quirks
- **Preloading**: All sounds ready instantly
- **Mobile-optimized**: HTML5 audio fallback
- **Volume control**: Independent music/SFX
- **Small**: Only ~10KB gzipped

#### Why localForage?
- **Better than localStorage**: No 5MB limit
- **IndexedDB wrapper**: Simple API, powerful storage
- **Promise-based**: Modern async/await
- **Fallback chain**: IndexedDB → WebSQL → localStorage
- **Offline-first**: Perfect for toddler apps

## Project Structure Deep Dive

```
src/
├── components/          # Reusable React components
│   ├── ParentalGate.tsx # Security component
│   └── ParentalGate.css
│
├── pages/              # Ionic page components
│   ├── Home.tsx        # Main menu (routes to games)
│   ├── Home.css
│   ├── GamePage.tsx    # Phaser game host
│   └── GamePage.css
│
├── game/               # Phaser game logic
│   ├── config.ts       # Game configurations
│   └── scenes/         # Game scenes
│       ├── BuildBoatScene.ts  # 10 boat building levels
│       ├── MemoryScene.ts     # Memory card matching
│       └── DrawingScene.ts    # Free-form drawing
│
├── services/           # Business logic
│   ├── audio.ts        # Sound effect management
│   └── progress.ts     # Game state persistence
│
├── theme/              # Global styles
│   ├── variables.css   # Ionic color tokens
│   └── global.css      # Custom global styles
│
├── App.tsx             # Root component, routing
└── main.tsx            # Entry point, Ionic setup
```

## Key Design Patterns

### 1. Service Pattern
Services are singletons that manage cross-cutting concerns:

```typescript
// services/audio.ts
class AudioService {
  private static instance: AudioService;
  // ... implementation
}
export const audioService = new AudioService();
```

**Why**: Ensures one audio context, shared across all components/scenes.

### 2. Scene Pattern (Phaser)
Each game is an isolated Phaser scene:

```typescript
export default class BuildBoatScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BuildBoatScene' });
  }

  preload() { /* Load assets */ }
  create() { /* Setup game */ }
  update() { /* Game loop */ }
}
```

**Why**: Encapsulation, memory management, easy to extend.

### 3. React Hooks for State
Components use hooks for local state:

```typescript
const [showGate, setShowGate] = useState(false);
useEffect(() => {
  // Side effects
}, [deps]);
```

**Why**: Functional components, cleaner than class components.

### 4. Route-based Navigation
Ionic Router for page transitions:

```typescript
<Route exact path="/game/:gameType">
  <GamePage />
</Route>
```

**Why**: Deep linking, browser back button, clean URLs.

## Toddler UX Principles

### 1. Touch Targets
```css
.menu-button {
  min-width: 280px;
  min-height: 100px; /* 72px+ recommended */
}
```

**Apple HIG**: 44pt (≈58px)
**Google Material**: 48dp (≈64px)
**Little Skipper**: 72px+ for toddlers

### 2. Visual Feedback
```typescript
sprite.on('dragstart', () => {
  audioService.play('whoosh');
  sprite.setScale(1.4);
  Haptics.impact({ style: ImpactStyle.Light });
});
```

**Every action gets 3 feedback types**:
- Visual (scale, color, animation)
- Audio (sound effect)
- Haptic (vibration on mobile)

### 3. Generous Collision
```typescript
const snapDistance = 100; // Pixels
if (distance < snapDistance) {
  // Snap to position
}
```

**Why**: Toddlers have poor fine motor control. Make success easy!

### 4. No Dead-Ends
Every screen has an obvious exit:
- Back button (top-left)
- "Again!" button (after completion)
- Home button (always accessible)

### 5. Instant Gratification
```typescript
this.time.delayedCall(0, () => {
  // Immediate feedback, no delay
});
```

**Attention span**: 2-5 minutes max
**Feedback delay**: <100ms ideal

## Game Implementation Details

### Build a Boat Scene

**Data Structure**:
```typescript
interface BoatPart {
  key: string;              // Sprite key
  x: number;                // Start position
  y: number;
  correctPosition: {x, y};  // Snap target
  snapped: boolean;         // Completion state
  sprite?: Sprite;          // Phaser sprite
}
```

**Flow**:
1. Load level configuration
2. Create draggable sprites
3. Listen for drag events
4. Check distance to correct position
5. Snap if close enough (100px)
6. Celebrate when all parts snapped

**Progressive Difficulty**:
- Level 1-3: 2 parts (kayak, canoe)
- Level 4-6: 3 parts (sailboat, yacht)
- Level 7-10: 3-4 parts (cargo, submarine)

### Memory Scene

**Difficulty Scaling**:
```typescript
const gridConfig = {
  easy: { cols: 3, rows: 4 },    // 6 pairs
  medium: { cols: 4, rows: 4 },   // 8 pairs
  hard: { cols: 4, rows: 6 }      // 12 pairs
};
```

**Unlocking**:
- Easy: Always available
- Medium: Unlocks at 5+ high score
- Hard: Unlocks at 10+ high score

**Scoring**:
```typescript
score = (totalPairs × 3) - moves
```
Fewer moves = higher score

**Flow**:
1. Create pairs of cards
2. Shuffle array
3. Preview (2s flip all)
4. Player flips 2 cards
5. Check match
6. If match → celebrate, keep flipped
7. If no match → flip back after 800ms
8. Repeat until all matched

### Drawing Scene

**Smooth Drawing**:
```typescript
drawingGraphics.lineStyle(size, color, 1);
drawingGraphics.beginPath();
drawingGraphics.moveTo(lastX, lastY);
drawingGraphics.lineTo(currentX, currentY);
drawingGraphics.strokePath();
```

**Templates**:
Generated procedurally using `Graphics` API:
- Boat: Hull + mast + sail shapes
- Fish: Ellipse body + triangle tail
- Anchor: Lines + circles
- Waves: Bezier curves

**Canvas Bounds**:
```typescript
private isInCanvas(x: number, y: number): boolean {
  const bounds = this.canvasArea.getBounds();
  return x >= bounds.x && x <= bounds.x + bounds.width &&
         y >= bounds.y && y <= bounds.y + bounds.height;
}
```

## Performance Optimization

### 1. Asset Preloading
```typescript
preload() {
  this.load.setPath('/assets/');
  this.load.image('hull', 'boats/hull.png');
  // ... all assets loaded before game starts
}
```

### 2. Object Pooling (Future)
For particles, reuse objects instead of create/destroy:
```typescript
const particlePool = [];
function getParticle() {
  return particlePool.pop() || createNewParticle();
}
```

### 3. Texture Atlas (Future)
Combine sprites into one image:
```bash
TexturePacker sprites/*.png --sheet boats.png --data boats.json
```

### 4. Audio Preloading
```typescript
new Howl({
  src: ['sound.mp3'],
  preload: true,  // Load immediately
  html5: true     // Better for mobile
});
```

## Testing Strategy

### Unit Tests (Future)
```typescript
// services/progress.test.ts
describe('ProgressService', () => {
  it('should unlock next level on completion', async () => {
    await progressService.completeBoatLevel(1, 3);
    const level2 = progressService.getBoatLevel(2);
    expect(level2.unlocked).toBe(true);
  });
});
```

### Integration Tests
```typescript
// Test with real browser
// npm run test
// Uses Vitest + Testing Library
```

### Manual Testing Checklist
- [ ] All buttons respond to tap
- [ ] Haptic feedback works (mobile)
- [ ] Audio plays after first interaction
- [ ] Progress saves between sessions
- [ ] Works offline
- [ ] Back button works everywhere
- [ ] No console errors
- [ ] Responsive on all screen sizes
- [ ] Works in portrait and landscape
- [ ] Parental gate blocks toddlers

## Debugging Tips

### Phaser Debugging
```typescript
physics: {
  arcade: {
    debug: true  // Shows collision boxes
  }
}
```

### React DevTools
Install extension:
- Chrome: React Developer Tools
- See component hierarchy
- Inspect props/state
- Profile performance

### Capacitor Debugging

**iOS**:
```bash
# Safari > Develop > Simulator > localhost
```

**Android**:
```bash
# Chrome > chrome://inspect
```

### Audio Debugging
```typescript
audioService.play('test');
// Check console for:
// - File loading errors
// - Autoplay policy blocks
// - Howler warnings
```

## Common Gotchas

### 1. Autoplay Policy
Browsers block audio until user interaction:
```typescript
// Solution: Play after first tap
document.addEventListener('click', () => {
  audioService.initialize();
}, { once: true });
```

### 2. Touch Events on Canvas
Prevent default browser gestures:
```css
canvas {
  touch-action: none;
}
```

### 3. Phaser + React Lifecycle
Don't recreate game on every render:
```typescript
useEffect(() => {
  const game = new Phaser.Game(config);
  return () => game.destroy(true);
}, []); // Empty deps = mount once
```

### 4. iOS Safe Area
Account for notch:
```css
padding-top: env(safe-area-inset-top);
padding-bottom: env(safe-area-inset-bottom);
```

### 5. Android Back Button
Handle in Capacitor:
```typescript
App.addListener('backButton', ({ canGoBack }) => {
  if (!canGoBack) {
    App.exitApp();
  } else {
    window.history.back();
  }
});
```

## Adding New Features

### New Game Type
1. Create scene: `src/game/scenes/NewGameScene.ts`
2. Extend `Phaser.Scene`
3. Implement `preload()`, `create()`, `update()`
4. Add to `config.ts`:
   ```typescript
   const sceneMap = {
     'new-game': NewGameScene
   };
   ```
5. Add route in `App.tsx`
6. Add button in `Home.tsx`

### New Boat Level
Edit `BuildBoatScene.ts`:
```typescript
private createNewBoatLevel(): BoatLevel {
  return {
    id: 11,
    name: 'New Boat',
    boatType: 'newboat',
    parts: [
      { key: 'part1', x: 100, y: 100, ... },
      { key: 'part2', x: 200, y: 100, ... }
    ]
  };
}
```

### New Sound Effect
1. Add audio file: `public/assets/audio/newsound.mp3`
2. Update type: `services/audio.ts`
   ```typescript
   type SoundEffect = 'tap' | 'newsound' | ...;
   ```
3. Load in `initialize()`:
   ```typescript
   soundDefinitions.newsound = '/assets/audio/newsound.mp3';
   ```
4. Play anywhere:
   ```typescript
   audioService.play('newsound');
   ```

## Deployment Checklist

### Pre-Deploy
- [ ] Update version in `package.json`
- [ ] Update version in `capacitor.config.ts`
- [ ] Run `npm run build` successfully
- [ ] Test production build locally
- [ ] Check bundle size (<5MB ideal)
- [ ] Verify all assets load
- [ ] Test on real devices
- [ ] Update CHANGELOG.md

### Web (PWA)
```bash
npm run build
# Upload dist/ to hosting
# Verify service worker registers
# Test offline functionality
```

### iOS
```bash
npm run build
npx cap sync ios
npx cap open ios

# In Xcode:
# 1. Update version/build number
# 2. Product > Archive
# 3. Validate archive
# 4. Distribute to App Store Connect
```

### Android
```bash
npm run build
npx cap sync android
npx cap open android

# In Android Studio:
# 1. Build > Generate Signed Bundle
# 2. Upload to Google Play Console
# 3. Submit for review
```

## Future Enhancements

### High Priority
- [ ] Sticker collection UI
- [ ] Parent dashboard (stats, settings)
- [ ] More boat types (houseboat, lifeboat, raft)
- [ ] Difficulty selector
- [ ] Multilingual support (Spanish, French, etc.)

### Medium Priority
- [ ] Achievement system
- [ ] Daily challenges
- [ ] Coloring book mode (vs free draw)
- [ ] Boat racing mini-game
- [ ] Weather effects (rain, storms)

### Low Priority
- [ ] Multiplayer (side-by-side)
- [ ] Print drawings feature
- [ ] Video tutorials
- [ ] AR mode (point camera at floor → boat appears)
- [ ] Voice narration

## Resources

### Learning
- [Ionic Docs](https://ionicframework.com/docs)
- [Phaser 3 Examples](https://phaser.io/examples)
- [React Docs](https://react.dev)
- [Capacitor Docs](https://capacitorjs.com/docs)

### Assets
- [Freepik](https://freepik.com) - Boat graphics
- [Flaticon](https://flaticon.com) - Icons
- [Freesound](https://freesound.org) - Sound effects
- [Google Fonts](https://fonts.google.com) - Typography

### Tools
- [Figma](https://figma.com) - UI design
- [Icon Kitchen](https://icon.kitchen) - Icon generation
- [TinyPNG](https://tinypng.com) - Image compression
- [Audacity](https://audacityteam.org) - Audio editing

### Inspiration
- Khan Academy Kids
- PBS Kids Games
- Endless Alphabet
- Sago Mini apps

---

**Questions? Open an issue or check the [README](./README.md)!**
