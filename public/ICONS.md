# App Icons

## Required Icons

### PWA Icons
Create the following files in this directory (`public/`):

- `icon-192.png` - 192×192px PNG
- `icon-512.png` - 512×512px PNG

### How to Create Icons

#### Option 1: Icon Kitchen (Recommended)
1. Go to [icon.kitchen](https://icon.kitchen)
2. Upload the `boat-icon.svg` file
3. Customize colors if desired
4. Download iOS, Android, and Web icons
5. Place files as instructed below

#### Option 2: Manual Creation
Use any graphics editor (Figma, Photoshop, GIMP, etc.):
1. Design a 512×512px icon
2. Use the boat/sailing theme
3. Make it colorful and simple (toddler-friendly)
4. Export as PNG
5. Create 192×192px version

### Design Guidelines

**Colors**: Use bright, high-contrast colors
- Primary: Ocean blue (#4A90E2)
- Accent: Sunny yellow (#FFD93D)
- Background: White or light blue

**Elements**: Keep it simple
- ✅ Sailboat, anchor, or ship
- ✅ Bold outlines
- ✅ Minimal details
- ❌ No text
- ❌ No small details (will be lost at small sizes)

**Style**: Toddler-friendly
- Rounded edges
- Friendly, approachable
- Not realistic - cartoonish is good

## iOS Icons

After generating with Icon Kitchen, place in:
```
ios/App/App/Assets.xcassets/AppIcon.appiconset/
```

Required sizes:
- 20pt (@1x, @2x, @3x)
- 29pt (@1x, @2x, @3x)
- 40pt (@1x, @2x, @3x)
- 60pt (@2x, @3x)
- 76pt (@1x, @2x)
- 83.5pt (@2x)
- 1024pt (@1x) - App Store

Icon Kitchen generates all of these automatically!

## Android Icons

After generating with Icon Kitchen, place in:
```
android/app/src/main/res/
├── mipmap-hdpi/
├── mipmap-mdpi/
├── mipmap-xhdpi/
├── mipmap-xxhdpi/
└── mipmap-xxxhdpi/
```

Required files in each:
- `ic_launcher.png` (standard icon)
- `ic_launcher_round.png` (round icon)
- `ic_launcher_foreground.png` (adaptive foreground)
- `ic_launcher_background.png` (adaptive background)

Icon Kitchen generates all of these automatically!

## Splash Screen

### iOS
Place in: `ios/App/App/Assets.xcassets/Splash.imageset/`
- `splash.png` - 2732×2732px (centered content in middle 1200×1200px)
- Use ocean blue background (#4A90E2)
- Center the boat icon and app name

### Android
Place in: `android/app/src/main/res/drawable/`
- `splash.png` - 1920×1920px
- Use ocean blue background (#4A90E2)
- Center the boat icon and app name

## Current Status

Currently using:
- ✅ `boat-icon.svg` - Placeholder SVG (works in browser)
- ⏳ `icon-192.png` - TODO: Generate
- ⏳ `icon-512.png` - TODO: Generate

## Quick Setup

```bash
# 1. Generate icons at icon.kitchen
open https://icon.kitchen

# 2. Upload boat-icon.svg
# 3. Download all platforms

# 4. Extract and copy files:
# - Web icons → public/
# - iOS icons → ios/App/App/Assets.xcassets/AppIcon.appiconset/
# - Android icons → android/app/src/main/res/

# 5. Rebuild
npm run build
npx cap sync
```

## Testing Icons

### PWA
1. Build: `npm run build`
2. Serve: `npm run preview`
3. Open DevTools → Application → Manifest
4. See icons listed

### iOS
1. Build in Xcode
2. Check on device home screen
3. Verify all sizes render correctly

### Android
1. Build in Android Studio
2. Install on device
3. Check app drawer and home screen

---

**Don't forget to update icons before publishing to app stores!**
