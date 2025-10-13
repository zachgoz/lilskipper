# Changelog

All notable changes to Little Skipper will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-10-12

### Added
- 🚤 **Build a Boat Game** with 10 progressive levels
  - Kayak, Sailboat, Canoe, Speedboat, Yacht, Tugboat, Ferry, Trawler, Cargo Ship, Submarine
  - Drag-and-drop boat part assembly
  - Generous snap zones for toddler-friendly gameplay
  - Star rating system (3 stars per level)
  - Progressive level unlocking

- 🐠 **Memory Match Game** with adaptive difficulty
  - 2×3 grid (easy), 4×4 (medium), 4×6 (hard)
  - Ocean-themed cards with boats and sea creatures
  - Card preview system at game start
  - High score tracking
  - Smooth flip animations

- 🎨 **Draw & Color Game** with free-form creativity
  - Drawing canvas with smooth brush strokes
  - 9 vibrant colors + eraser tool
  - 5 boat-themed templates (sailboat, fish, anchor, waves, blank)
  - Canvas clearing and undo capabilities
  - Drawing milestone tracking

- 🏠 **Home Menu** with ocean theme
  - Large, accessible game selection buttons
  - Star count display
  - Settings access via parental gate
  - Animated wave decorations
  - Responsive layout

- 🔒 **Parental Gate** for settings protection
  - Shape recognition challenge
  - 3-second hold alternative
  - Prevents accidental exits or changes

- 🔊 **Audio System** powered by Howler.js
  - Sound effect support for all interactions
  - Background music (ocean waves)
  - Independent volume controls for music/SFX
  - Mobile-optimized HTML5 audio

- 💾 **Progress Tracking** using IndexedDB
  - Level completion and star ratings
  - High scores for memory game
  - Drawing count milestones
  - Sticker unlock system (foundation)
  - All data stored locally (offline-first)

- 📱 **Mobile Features** via Capacitor
  - Haptic feedback on all interactions
  - iOS and Android platform support
  - PWA capabilities (installable)
  - Splash screen and status bar theming
  - Touch-optimized interface

- 🎨 **Toddler-Optimized UX**
  - Large tap targets (72px+)
  - High contrast colors
  - No text input required
  - Icon-based navigation
  - Instant visual feedback
  - 3-5 minute play sessions
  - Obvious "Again!" buttons

- 📚 **Documentation**
  - Comprehensive README with setup instructions
  - QUICKSTART guide for 5-minute setup
  - DEVELOPMENT guide with technical details
  - Code comments and inline documentation

### Technical Details
- Built with Ionic V8 + React 18
- Phaser 3.80+ for game engine
- TypeScript for type safety
- Vite 5 for fast builds
- Capacitor 6 for native features
- localForage for data persistence

### Browser Support
- Chrome 90+
- Safari 14+
- Firefox 88+
- Edge 90+

### Mobile Support
- iOS 13+
- Android 8+

---

## Future Releases

### [1.1.0] - Planned
- Sticker collection UI
- Parent dashboard
- Additional boat types
- Sound on/off toggle in settings
- Tutorial mode for first-time users

### [1.2.0] - Planned
- Multilingual support (Spanish, French)
- Achievement system
- Daily challenges
- More memory card themes

### [2.0.0] - Ideas
- Boat racing mini-game
- Coloring book mode
- Weather effects
- AR features (experimental)

---

## Version History

### How to Update Version

1. **Update package.json**:
   ```json
   "version": "1.0.0"
   ```

2. **Update capacitor.config.ts** (for mobile):
   ```typescript
   version: '1.0.0'
   ```

3. **Update this CHANGELOG**:
   - Add new section with date
   - List changes under Added/Changed/Fixed/Removed

4. **Tag in git** (if using):
   ```bash
   git tag -a v1.0.0 -m "Release version 1.0.0"
   git push origin v1.0.0
   ```

### Versioning Rules

- **MAJOR** (1.0.0 → 2.0.0): Breaking changes, major redesigns
- **MINOR** (1.0.0 → 1.1.0): New features, backwards compatible
- **PATCH** (1.0.0 → 1.0.1): Bug fixes, small improvements

---

**Keep this file updated with every release!**
