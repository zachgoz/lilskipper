#!/usr/bin/env node

/**
 * Slice the Solace 32 CS boat image into puzzle pieces
 * This creates realistic boat part images from an actual photo
 */

const fs = require('fs');
const path = require('path');

// Check if canvas is installed
let Canvas;
try {
  Canvas = require('canvas');
} catch (err) {
  console.error('❌ canvas package not installed');
  console.error('Please install it with: npm install canvas');
  process.exit(1);
}

const { createCanvas, loadImage } = Canvas;

// Directories
const BOATS_DIR = path.join(__dirname, '../public/assets/boats');
const SOURCE_IMAGE = path.join(BOATS_DIR, 'solace-32cs-reference.png');

// Helper to save canvas to PNG
function saveImage(canvas, filename) {
  const filepath = path.join(BOATS_DIR, filename);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(filepath, buffer);
  console.log(`✓ Created ${filename}`);
}

async function sliceBoatImage() {
  console.log('🚤 Slicing Solace 32 CS boat image into puzzle pieces...\n');

  // Load the source image
  const sourceImage = await loadImage(SOURCE_IMAGE);
  console.log(`Source image size: ${sourceImage.width}x${sourceImage.height}\n`);

  // Scale the image to a reasonable game size (approximate 400px wide)
  const targetWidth = 400;
  const scale = targetWidth / sourceImage.width;
  const scaledHeight = Math.floor(sourceImage.height * scale);

  console.log(`Scaled size: ${targetWidth}x${scaledHeight}\n`);

  // Create scaled version
  const scaledCanvas = createCanvas(targetWidth, scaledHeight);
  const scaledCtx = scaledCanvas.getContext('2d');
  scaledCtx.drawImage(sourceImage, 0, 0, targetWidth, scaledHeight);

  // Define puzzle piece regions (x, y, width, height) from the scaled image
  // These are approximate regions based on the boat's visual sections
  const pieces = [
    // Hull (bottom section)
    {
      name: 'level2-hull',
      x: 0,
      y: Math.floor(scaledHeight * 0.55),
      width: targetWidth,
      height: Math.floor(scaledHeight * 0.45)
    },
    // Bow/Front section (left third, middle height)
    {
      name: 'level2-bow',
      x: 0,
      y: Math.floor(scaledHeight * 0.3),
      width: Math.floor(targetWidth * 0.35),
      height: Math.floor(scaledHeight * 0.35)
    },
    // Center Console (middle section)
    {
      name: 'level2-console',
      x: Math.floor(targetWidth * 0.35),
      y: Math.floor(scaledHeight * 0.25),
      width: Math.floor(targetWidth * 0.25),
      height: Math.floor(scaledHeight * 0.4)
    },
    // T-Top (top middle section)
    {
      name: 'level2-ttop',
      x: Math.floor(targetWidth * 0.25),
      y: 0,
      width: Math.floor(targetWidth * 0.45),
      height: Math.floor(scaledHeight * 0.35)
    },
    // Stern/Back section with motors (right third)
    {
      name: 'level2-stern',
      x: Math.floor(targetWidth * 0.65),
      y: Math.floor(scaledHeight * 0.35),
      width: Math.floor(targetWidth * 0.35),
      height: Math.floor(scaledHeight * 0.45)
    }
  ];

  console.log('Creating puzzle pieces:\n');

  // Extract each piece
  for (const piece of pieces) {
    const pieceCanvas = createCanvas(piece.width, piece.height);
    const pieceCtx = pieceCanvas.getContext('2d');

    // Draw the portion of the scaled image
    pieceCtx.drawImage(
      scaledCanvas,
      piece.x, piece.y, piece.width, piece.height,  // Source region
      0, 0, piece.width, piece.height               // Destination
    );

    // Save the piece
    saveImage(pieceCanvas, `${piece.name}.png`);
  }

  console.log('\n✅ All puzzle pieces created successfully!');
  console.log('\nPieces created:');
  pieces.forEach(p => console.log(`  - ${p.name}.png (${p.width}x${p.height})`));
}

// Run the slicer
sliceBoatImage().catch(err => {
  console.error('Error slicing image:', err);
  process.exit(1);
});
