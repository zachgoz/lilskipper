# 📜 NPM Scripts Reference

Quick reference for all available npm scripts.

## 🚀 Development

### Start Development Server
```bash
npm run dev
```
- Starts Vite dev server
- Hot reload enabled
- Opens at http://localhost:3000
- Use for development

### Start Ionic Dev Server
```bash
npm run ionic:serve
```
- Alternative to `npm run dev`
- Same as above (Ionic alias)

## 🏗️ Building

### Build for Production
```bash
npm run build
```
- Compiles TypeScript
- Bundles with Vite
- Outputs to `dist/`
- Optimized for production

### Preview Production Build
```bash
npm run preview
```
- Serves production build locally
- Test before deploying
- Opens at http://localhost:4173

### Ionic Build
```bash
npm run ionic:build
```
- Same as `npm run build`
- Ionic alias

## 🧪 Testing

### Run Tests
```bash
npm run test
```
- Runs Vitest
- Watch mode by default
- Unit tests

### Run Linter
```bash
npm run lint
```
- Checks code style
- ESLint rules
- TypeScript checks

## 📱 Mobile Development

### Sync to Native Platforms
```bash
npx cap sync
```
- Copies web assets to native projects
- Updates native dependencies
- Run after `npm run build`

### Sync iOS
```bash
npx cap sync ios
```
- Sync only iOS platform

### Sync Android
```bash
npx cap sync android
```
- Sync only Android platform

### Open in Xcode (iOS)
```bash
npx cap open ios
```
- Opens iOS project in Xcode
- Build and run from Xcode

### Open in Android Studio (Android)
```bash
npx cap open android
```
- Opens Android project in Android Studio
- Build and run from Android Studio

### Add iOS Platform
```bash
npx cap add ios
```
- First-time setup only
- Creates ios/ directory
- Run after `npm run build`

### Add Android Platform
```bash
npx cap add android
```
- First-time setup only
- Creates android/ directory
- Run after `npm run build`

## 🔄 Common Workflows

### First Time Setup
```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev
```

### Build and Test Production
```bash
# 1. Build
npm run build

# 2. Preview
npm run preview
```

### Build for iOS
```bash
# 1. Build web assets
npm run build

# 2. Sync to iOS
npx cap sync ios

# 3. Open in Xcode
npx cap open ios

# 4. In Xcode: Select device and click Run
```

### Build for Android
```bash
# 1. Build web assets
npm run build

# 2. Sync to Android
npx cap sync android

# 3. Open in Android Studio
npx cap open android

# 4. In Android Studio: Select device and click Run
```

### Update Dependencies
```bash
# Check for updates
npm outdated

# Update all (careful!)
npm update

# Update specific package
npm update @ionic/react

# Update to latest (breaking changes possible)
npm install @ionic/react@latest
```

### Clean and Reinstall
```bash
# Remove node_modules
rm -rf node_modules package-lock.json

# Clear cache
npm cache clean --force

# Reinstall
npm install
```

## 🐛 Debugging Scripts

### Check TypeScript
```bash
npx tsc --noEmit
```
- Type-check without building
- Find TypeScript errors

### Check Bundle Size
```bash
npm run build
# Check dist/ folder size
du -sh dist/
```

### Analyze Bundle
```bash
npm run build -- --mode analyze
```
- Shows what's in your bundle
- Identify large dependencies

### Check Capacitor
```bash
npx cap doctor
```
- Checks Capacitor installation
- Verifies native dependencies
- Troubleshooting tool

## 📦 Package Management

### Install Package
```bash
npm install package-name
```

### Install Dev Package
```bash
npm install -D package-name
```

### Remove Package
```bash
npm uninstall package-name
```

### List Installed Packages
```bash
npm list --depth=0
```

### Check for Security Issues
```bash
npm audit
```

### Fix Security Issues
```bash
npm audit fix
```

## 🔧 Useful Commands

### Kill Port (if already in use)
```bash
npx kill-port 3000
```

### Use Different Port
```bash
npm run dev -- --port 3001
```

### Clear Vite Cache
```bash
rm -rf node_modules/.vite
```

### Clear Capacitor Build
```bash
rm -rf .capacitor
npx cap sync
```

## 🎯 Quick Reference

| Task | Command |
|------|---------|
| Start dev server | `npm run dev` |
| Build production | `npm run build` |
| Preview build | `npm run preview` |
| Run tests | `npm run test` |
| Lint code | `npm run lint` |
| Sync native | `npx cap sync` |
| Open iOS | `npx cap open ios` |
| Open Android | `npx cap open android` |
| Type check | `npx tsc --noEmit` |
| Check Capacitor | `npx cap doctor` |

## 🆘 Troubleshooting

### Port Already in Use
```bash
npx kill-port 3000
# or
lsof -ti:3000 | xargs kill -9
```

### Vite Not Starting
```bash
rm -rf node_modules/.vite
npm run dev
```

### Build Fails
```bash
rm -rf dist node_modules
npm install
npm run build
```

### Native Sync Issues
```bash
rm -rf ios android .capacitor
npm run build
npx cap add ios
npx cap add android
```

### TypeScript Errors
```bash
# Check for errors
npx tsc --noEmit

# Update TypeScript
npm update typescript
```

## 📚 Learn More

- npm docs: https://docs.npmjs.com
- Vite docs: https://vitejs.dev
- Capacitor CLI: https://capacitorjs.com/docs/cli

---

**💡 Pro Tip**: Create aliases in your shell config:
```bash
# Add to ~/.zshrc or ~/.bashrc
alias dev="npm run dev"
alias build="npm run build"
alias preview="npm run preview"
alias ios="npm run build && npx cap sync ios && npx cap open ios"
alias android="npm run build && npx cap sync android && npx cap open android"
```

Then just run:
```bash
dev      # Start dev server
ios      # Build and open iOS
android  # Build and open Android
```

---

**🚀 Bookmark this file for quick script reference!**
