#!/bin/bash

# Phaser Editor Setup Verification Script
# This script checks that everything is configured correctly

echo "🚤 Little Skipper - Phaser Editor Setup Verification"
echo "=================================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check counters
PASSED=0
FAILED=0
WARNINGS=0

# Check function
check() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $1"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $1"
        ((FAILED++))
    fi
}

warn() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARNINGS++))
}

# 1. Check if we're in the right directory
echo "Checking project structure..."
if [ -f "package.json" ] && [ -f "vite.config.ts" ]; then
    check "Project root directory found"
else
    echo -e "${RED}✗${NC} Not in project root directory"
    echo "Please run this script from: /Users/zgosling/sourcecode/lilskipper"
    exit 1
fi

# 2. Check MCP configuration
echo ""
echo "Checking MCP server configuration..."
if [ -f "$HOME/.claude.json" ]; then
    if grep -q "phaser-editor" "$HOME/.claude.json"; then
        check "MCP server configured in ~/.claude.json"
    else
        warn "phaser-editor not found in ~/.claude.json"
    fi
else
    warn "~/.claude.json not found"
fi

# 3. Check directory structure
echo ""
echo "Checking directory structure..."
[ -d "public/assets/boats" ] && check "public/assets/boats/ directory exists" || warn "public/assets/boats/ directory missing"
[ -d "public/assets/cards" ] && check "public/assets/cards/ directory exists" || warn "public/assets/cards/ directory missing"
[ -d "public/assets/audio" ] && check "public/assets/audio/ directory exists" || warn "public/assets/audio/ directory missing"
[ -d "src/game/scenes/editor" ] && check "src/game/scenes/editor/ directory exists" || warn "src/game/scenes/editor/ directory missing"

# 4. Check configuration files
echo ""
echo "Checking configuration files..."
[ -f "public/assets/asset-pack.json" ] && check "asset-pack.json exists" || warn "asset-pack.json missing"
[ -f "PHASER_EDITOR_SETUP.md" ] && check "PHASER_EDITOR_SETUP.md exists" || warn "Setup guide missing"
[ -f "MIGRATION_GUIDE.md" ] && check "MIGRATION_GUIDE.md exists" || warn "Migration guide missing"
[ -f ".claude/MCP_COMMANDS.md" ] && check "MCP commands reference exists" || warn "MCP reference missing"

# 5. Check for boat part images
echo ""
echo "Checking for boat part images..."
BOAT_IMAGES=$(find public/assets/boats -name "*.png" 2>/dev/null | wc -l | tr -d ' ')
if [ "$BOAT_IMAGES" -gt 0 ]; then
    check "Found $BOAT_IMAGES boat part images"
else
    warn "No boat part images found - need to generate them"
    echo "   → Run: open scripts/generate-boat-images.html"
fi

# 6. Check for card images
CARD_IMAGES=$(find public/assets/cards -name "*.png" 2>/dev/null | wc -l | tr -d ' ')
if [ "$CARD_IMAGES" -gt 0 ]; then
    check "Found $CARD_IMAGES card images"
else
    warn "No card images found - need to generate them"
fi

# 7. Check scene files
echo ""
echo "Checking scene files..."
SCENE_FILES=$(find src/game/scenes/editor -name "*.scene" 2>/dev/null | wc -l | tr -d ' ')
if [ "$SCENE_FILES" -gt 0 ]; then
    check "Found $SCENE_FILES Phaser Editor scene files"
    find src/game/scenes/editor -name "*.scene" -exec basename {} \; | sed 's/^/   - /'
else
    warn "No .scene files yet - will create in Phaser Editor"
fi

# 8. Check TypeScript scenes
echo ""
echo "Checking TypeScript scene files..."
[ -f "src/game/scenes/BuildBoatScene.ts" ] && check "BuildBoatScene.ts exists" || warn "BuildBoatScene.ts missing"
[ -f "src/game/scenes/MemoryScene.ts" ] && check "MemoryScene.ts exists" || warn "MemoryScene.ts missing"
[ -f "src/game/scenes/DrawingScene.ts" ] && check "DrawingScene.ts exists" || warn "DrawingScene.ts missing"

# 9. Test MCP connection (if Claude CLI is available)
echo ""
echo "Testing MCP server connection..."
if command -v claude &> /dev/null; then
    if claude mcp list 2>&1 | grep -q "phaser-editor.*Connected"; then
        check "MCP server is connected"
    else
        warn "MCP server not connected - restart Phaser Editor"
    fi
else
    warn "Claude CLI not found - can't test MCP connection"
fi

# 10. Check Phaser Editor installation (common locations)
echo ""
echo "Checking for Phaser Editor installation..."
PHASER_EDITOR_FOUND=false

if [ -d "/Applications/Phaser Editor 2D.app" ]; then
    check "Phaser Editor installed at /Applications/"
    PHASER_EDITOR_FOUND=true
elif [ -d "$HOME/Applications/Phaser Editor 2D.app" ]; then
    check "Phaser Editor installed at ~/Applications/"
    PHASER_EDITOR_FOUND=true
fi

if [ "$PHASER_EDITOR_FOUND" = false ]; then
    warn "Phaser Editor not found - install from https://phasereditor2d.com/downloads"
fi

# Summary
echo ""
echo "=================================================="
echo "Summary:"
echo -e "${GREEN}✓ Passed: $PASSED${NC}"
if [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠ Warnings: $WARNINGS${NC}"
fi
if [ $FAILED -gt 0 ]; then
    echo -e "${RED}✗ Failed: $FAILED${NC}"
fi
echo ""

# Recommendations
if [ $WARNINGS -gt 0 ] || [ $FAILED -gt 0 ]; then
    echo "📋 Recommended Actions:"
    echo ""

    if [ "$BOAT_IMAGES" -eq 0 ]; then
        echo "1. Generate boat part images:"
        echo "   open scripts/generate-boat-images.html"
        echo ""
    fi

    if [ "$PHASER_EDITOR_FOUND" = false ]; then
        echo "2. Install Phaser Editor v5:"
        echo "   https://phasereditor2d.com/downloads"
        echo ""
    fi

    if ! command -v claude &> /dev/null || ! claude mcp list 2>&1 | grep -q "phaser-editor.*Connected"; then
        echo "3. Verify MCP server connection:"
        echo "   claude mcp list"
        echo "   (Should show: phaser-editor: ✓ Connected)"
        echo ""
    fi

    echo "4. Read the setup guide:"
    echo "   cat PHASER_EDITOR_SETUP.md"
    echo ""
else
    echo "🎉 Everything looks good!"
    echo ""
    echo "Next steps:"
    echo "1. Launch Phaser Editor"
    echo "2. Open this project"
    echo "3. Create your first .scene file"
    echo ""
    echo "Need help? Read: PHASER_EDITOR_SETUP.md"
fi

exit 0
