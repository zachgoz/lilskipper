#!/usr/bin/env node

/**
 * Generate PNG images for boat parts and cards
 * This script uses node-canvas to create images from the graphics code
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

const { createCanvas } = Canvas;

// Output directories
const BOATS_DIR = path.join(__dirname, '../public/assets/boats');
const CARDS_DIR = path.join(__dirname, '../public/assets/cards');

// Ensure directories exist
if (!fs.existsSync(BOATS_DIR)) {
  fs.mkdirSync(BOATS_DIR, { recursive: true });
}
if (!fs.existsSync(CARDS_DIR)) {
  fs.mkdirSync(CARDS_DIR, { recursive: true });
}

// Helper to convert hex color to rgb
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 255, g: 255, b: 255 };
}

// Save canvas to PNG
function saveImage(canvas, filename, dir) {
  const filepath = path.join(dir, filename);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(filepath, buffer);
  console.log(`✓ Created ${filename}`);
}

// Generate Hull
function generateHull() {
  const canvas = createCanvas(165, 60);
  const ctx = canvas.getContext('2d');

  // Outer hull white
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(8, 28);
  ctx.lineTo(8, 50);
  ctx.lineTo(18, 58);
  ctx.lineTo(135, 58);
  ctx.lineTo(152, 40);
  ctx.lineTo(162, 22);
  ctx.lineTo(152, 15);
  ctx.lineTo(18, 15);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#E0E0E0';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Inner cockpit
  ctx.fillStyle = '#BDBDBD';
  ctx.beginPath();
  ctx.moveTo(18, 20);
  ctx.lineTo(18, 45);
  ctx.lineTo(135, 45);
  ctx.lineTo(145, 30);
  ctx.closePath();
  ctx.fill();

  // Blue stripe
  ctx.fillStyle = '#4A90E2';
  ctx.beginPath();
  ctx.moveTo(8, 38);
  ctx.lineTo(18, 48);
  ctx.lineTo(135, 48);
  ctx.lineTo(152, 32);
  ctx.lineTo(152, 28);
  ctx.lineTo(135, 38);
  ctx.lineTo(18, 38);
  ctx.closePath();
  ctx.fill();

  // Outline
  ctx.strokeStyle = '#2C3E50';
  ctx.lineWidth = 4;
  ctx.stroke();

  saveImage(canvas, 'hull.png', BOATS_DIR);
}

// Generate Mast
function generateMast() {
  const canvas = createCanvas(28, 100);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#A0522D';
  ctx.fillRect(8, 0, 12, 100);
  ctx.strokeStyle = '#654321';
  ctx.lineWidth = 3;
  ctx.strokeRect(8, 0, 12, 100);

  ctx.fillStyle = '#8B4513';
  ctx.fillRect(5, 15, 18, 6);

  saveImage(canvas, 'mast.png', BOATS_DIR);
}

// Generate Sail
function generateSail() {
  const canvas = createCanvas(45, 95);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(5, 0);
  ctx.lineTo(40, 45);
  ctx.lineTo(5, 90);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#CCCCCC';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Seams
  ctx.strokeStyle = '#DDDDDD';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(5, 20);
  ctx.lineTo(30, 38);
  ctx.stroke();

  saveImage(canvas, 'sail.png', BOATS_DIR);
}

// Generate Console
function generateConsole() {
  const canvas = createCanvas(60, 66);
  const ctx = canvas.getContext('2d');

  // Main body
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(0, 22, 60, 42, 6);
  ctx.fill();
  ctx.strokeStyle = '#BDBDBD';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Windshield
  ctx.fillStyle = 'rgba(74, 144, 226, 0.4)';
  ctx.beginPath();
  ctx.roundRect(5, 25, 50, 20, 4);
  ctx.fill();
  ctx.strokeStyle = '#2C3E50';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Dashboard
  ctx.fillStyle = '#2C3E50';
  ctx.fillRect(5, 48, 50, 12);

  // Steering wheel
  ctx.strokeStyle = '#E8E8E8';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(30, 54, 8, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(30, 54, 4, 0, Math.PI * 2);
  ctx.stroke();

  saveImage(canvas, 'console.png', BOATS_DIR);
}

// Generate Outboard Motor
function generateOutboard() {
  const canvas = createCanvas(50, 86);
  const ctx = canvas.getContext('2d');

  // Motor body
  ctx.fillStyle = '#2C3E50';
  ctx.beginPath();
  ctx.roundRect(5, 0, 40, 55, 6);
  ctx.fill();
  ctx.strokeStyle = '#1A252F';
  ctx.lineWidth = 3;
  ctx.stroke();

  // White accent
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(8, 8, 34, 12, 4);
  ctx.fill();

  // Red stripe
  ctx.fillStyle = '#E74C3C';
  ctx.beginPath();
  ctx.roundRect(8, 25, 34, 8, 3);
  ctx.fill();

  // Shaft
  ctx.fillStyle = '#7F8C8D';
  ctx.fillRect(18, 55, 14, 22);

  // Propeller
  ctx.fillStyle = '#7F8C8D';
  ctx.beginPath();
  ctx.moveTo(25, 70);
  ctx.lineTo(15, 77);
  ctx.lineTo(25, 84);
  ctx.lineTo(35, 77);
  ctx.closePath();
  ctx.fill();

  saveImage(canvas, 'outboard.png', BOATS_DIR);
}

// Generate Seat
function generateSeat() {
  const canvas = createCanvas(55, 50);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#E74C3C';
  ctx.beginPath();
  ctx.roundRect(0, 12, 55, 36, 8);
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(0, 0, 55, 14, 6);
  ctx.fill();

  ctx.strokeStyle = '#C0392B';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(0, 12, 55, 36, 8);
  ctx.stroke();
  ctx.beginPath();
  ctx.roundRect(0, 0, 55, 14, 6);
  ctx.stroke();

  saveImage(canvas, 'seat.png', BOATS_DIR);
}

// Generate Center Console Hull (modern profile)
function generateCenterConsoleHull() {
  const canvas = createCanvas(200, 70);
  const ctx = canvas.getContext('2d');

  // Main white hull with modern profile
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(10, 35);
  ctx.lineTo(10, 55);
  ctx.lineTo(20, 65);
  ctx.lineTo(170, 65);
  ctx.lineTo(190, 45);
  ctx.lineTo(195, 25);
  ctx.lineTo(185, 18);
  ctx.lineTo(20, 18);
  ctx.closePath();
  ctx.fill();

  // Blue racing stripe
  ctx.fillStyle = '#4A90E2';
  ctx.beginPath();
  ctx.moveTo(20, 42);
  ctx.lineTo(170, 42);
  ctx.lineTo(185, 32);
  ctx.lineTo(185, 28);
  ctx.lineTo(170, 36);
  ctx.lineTo(20, 36);
  ctx.closePath();
  ctx.fill();

  // Deck area
  ctx.fillStyle = '#E8E8E8';
  ctx.beginPath();
  ctx.moveTo(20, 22);
  ctx.lineTo(20, 50);
  ctx.lineTo(170, 50);
  ctx.lineTo(180, 35);
  ctx.closePath();
  ctx.fill();

  // Outline
  ctx.strokeStyle = '#2C3E50';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(10, 35);
  ctx.lineTo(10, 55);
  ctx.lineTo(20, 65);
  ctx.lineTo(170, 65);
  ctx.lineTo(190, 45);
  ctx.lineTo(195, 25);
  ctx.lineTo(185, 18);
  ctx.lineTo(20, 18);
  ctx.closePath();
  ctx.stroke();

  saveImage(canvas, 'hull-center-console.png', BOATS_DIR);
}

// Generate Large Center Console (taller with windshield)
function generateLargeCenterConsole() {
  const canvas = createCanvas(80, 75);
  const ctx = canvas.getContext('2d');

  // Main console body
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(5, 25, 70, 50, 8);
  ctx.fill();
  ctx.strokeStyle = '#BDBDBD';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Tall windshield
  ctx.fillStyle = 'rgba(74, 144, 226, 0.35)';
  ctx.beginPath();
  ctx.moveTo(10, 25);
  ctx.lineTo(10, 5);
  ctx.lineTo(70, 5);
  ctx.lineTo(70, 25);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#2C3E50';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Dashboard
  ctx.fillStyle = '#2C3E50';
  ctx.fillRect(10, 55, 60, 15);

  // Multiple screens/gauges
  ctx.fillStyle = '#1A1A1A';
  ctx.fillRect(15, 58, 20, 9);
  ctx.fillRect(42, 58, 20, 9);

  // Steering wheel
  ctx.strokeStyle = '#E8E8E8';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(40, 63, 10, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(40, 63, 5, 0, Math.PI * 2);
  ctx.stroke();

  saveImage(canvas, 'console-large.png', BOATS_DIR);
}

// Generate Modern T-Top
function generateModernTTop() {
  const canvas = createCanvas(110, 65);
  const ctx = canvas.getContext('2d');

  // Support posts
  ctx.fillStyle = '#95A5A6';
  ctx.fillRect(8, 15, 8, 50);
  ctx.fillRect(94, 15, 8, 50);

  // Top canopy
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(0, 0, 110, 18, 4);
  ctx.fill();
  ctx.strokeStyle = '#7F8C8D';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Support bars
  ctx.strokeStyle = '#7F8C8D';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(12, 18);
  ctx.lineTo(12, 60);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(98, 18);
  ctx.lineTo(98, 60);
  ctx.stroke();

  // Cross brace
  ctx.beginPath();
  ctx.moveTo(12, 8);
  ctx.lineTo(98, 8);
  ctx.stroke();

  saveImage(canvas, 'ttop-modern.png', BOATS_DIR);
}

// Generate Leaning Post
function generateLeaningPost() {
  const canvas = createCanvas(70, 60);
  const ctx = canvas.getContext('2d');

  // Main post
  ctx.fillStyle = '#7F8C8D';
  ctx.fillRect(5, 0, 60, 8);
  ctx.fillRect(5, 0, 8, 60);
  ctx.fillRect(57, 0, 8, 60);

  // Padded backrest
  ctx.fillStyle = '#E74C3C';
  ctx.beginPath();
  ctx.roundRect(10, 10, 50, 35, 6);
  ctx.fill();
  ctx.strokeStyle = '#C0392B';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Cushion seams
  ctx.strokeStyle = '#C0392B';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(35, 10);
  ctx.lineTo(35, 45);
  ctx.stroke();

  // Footrest bar
  ctx.fillStyle = '#95A5A6';
  ctx.fillRect(5, 50, 60, 6);

  saveImage(canvas, 'leaning-post.png', BOATS_DIR);
}

// Generate Bow Seating
function generateBowSeating() {
  const canvas = createCanvas(75, 35);
  const ctx = canvas.getContext('2d');

  // Left cushion
  ctx.fillStyle = '#E74C3C';
  ctx.beginPath();
  ctx.roundRect(2, 5, 32, 28, 6);
  ctx.fill();
  ctx.strokeStyle = '#C0392B';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Right cushion
  ctx.beginPath();
  ctx.roundRect(41, 5, 32, 28, 6);
  ctx.fill();
  ctx.stroke();

  // Center storage
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(34, 8, 7, 22, 3);
  ctx.fill();
  ctx.strokeStyle = '#BDBDBD';
  ctx.lineWidth = 1;
  ctx.stroke();

  saveImage(canvas, 'bow-seat.png', BOATS_DIR);
}

// Generate Card Front
function generateCardFront() {
  const canvas = createCanvas(120, 140);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(0, 0, 120, 140, 12);
  ctx.fill();

  ctx.strokeStyle = '#4A90E2';
  ctx.lineWidth = 4;
  ctx.stroke();

  saveImage(canvas, 'card-front.png', CARDS_DIR);
}

// Generate Card Back
function generateCardBack() {
  const canvas = createCanvas(120, 140);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#4A90E2';
  ctx.beginPath();
  ctx.roundRect(0, 0, 120, 140, 12);
  ctx.fill();

  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Wave pattern
  ctx.fillStyle = 'rgba(112, 183, 255, 0.45)';
  for (let y = 20; y < 130; y += 28) {
    ctx.beginPath();
    ctx.roundRect(12, y, 96, 16, 8);
    ctx.fill();
  }

  saveImage(canvas, 'card-back.png', CARDS_DIR);
}

// Main execution
console.log('🚤 Generating boat part and card images...\n');

console.log('Creating basic boat parts:');
generateHull();
generateMast();
generateSail();
generateConsole();
generateOutboard();
generateSeat();

console.log('\nCreating center console boat parts:');
generateCenterConsoleHull();
generateLargeCenterConsole();
generateModernTTop();
generateLeaningPost();
generateBowSeating();

console.log('\nCreating card images:');
generateCardFront();
generateCardBack();

console.log('\n✅ All images generated successfully!');
console.log(`\nBoat parts saved to: ${BOATS_DIR}`);
console.log(`Card images saved to: ${CARDS_DIR}`);
console.log('\nGenerated images:');
console.log('  Basic parts: hull, mast, sail, console, outboard, seat');
console.log('  Center console: hull-center-console, console-large, ttop-modern, leaning-post, bow-seat');
console.log('  Cards: card-front, card-back');
