import Phaser from 'phaser';
import { audioService } from '../../services/audio';
import { progressService } from '../../services/progress';

interface BoatPart {
  key: string;
  x: number;
  y: number;
  sprite?: Phaser.GameObjects.Sprite;
  guide?: Phaser.GameObjects.Sprite;
  snapZone?: { x: number; y: number; width: number; height: number };
  snapped: boolean;
  correctPosition?: { x: number; y: number };
  floatTween?: Phaser.Tweens.Tween;
  friendlyName?: string;
}

interface BoatLevel {
  id: number;
  name: string;
  boatType: string;
  parts: BoatPart[];
  background: string;
}

/**
 * Drag-and-drop playground where toddlers assemble boats while the ocean
 * backdrop animates. Friendly prompts and generous snapping help keep the
 * activity frustration free.
 */
export default class BuildBoatScene extends Phaser.Scene {
  private currentLevel = 1;
  private boatParts: BoatPart[] = [];
  private completedParts = 0;
  private levelData!: BoatLevel;
  private instructionText?: Phaser.GameObjects.Text;
  private progressText?: Phaser.GameObjects.Text;
  private celebrationEmitter?: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor() {
    super({ key: 'BuildBoatScene' });
  }

  preload() {
    // Load assets
    this.load.setPath('/assets/');

    // For this demo, we'll create placeholder graphics
    // In production, replace with actual boat part images
    this.createPlaceholderGraphics();
  }

  create() {
    const { width, height } = this.cameras.main;

    this.createEnvironment(width, height);

    // Create UI first (before loading level)
    // This ensures instructionText exists before showNextHint() is called
    this.createUIStructure();

    // Load level
    this.loadLevel(this.currentLevel);

    // Update UI with level data
    this.updateUIWithLevelData();

    // Setup confetti system (hidden initially)
    this.setupConfetti();
  }

  /**
   * Paints the layered ocean background, sun, clouds, and companion dolphin
   * that make the boatyard feel lively and inviting.
   */
  private createEnvironment(width: number, height: number) {
    // Layered background to make the scene feel more alive
    this.add.rectangle(0, 0, width, height, 0x74C0F4).setOrigin(0); // Distant sky
    this.add.rectangle(0, 0, width, height * 0.65, 0x9FD6FF).setOrigin(0); // Mid sky
    this.add.rectangle(0, height * 0.65, width, height * 0.35, 0x4A90E2).setOrigin(0); // Water

    // Sun with gentle pulse
    const sun = this.add.circle(width - 120, 120, 70, 0xFFE082);
    this.tweens.add({
      targets: sun,
      scale: { from: 1, to: 1.05 },
      alpha: { from: 1, to: 0.9 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Floating clouds
    for (let i = 0; i < 3; i++) {
      const cloud = this.add.graphics();
      cloud.fillStyle(0xFFFFFF, 0.85);
      const baseX = 100 + i * 220;
      cloud.fillEllipse(baseX, 120 + i * 10, 160, 70);
      cloud.fillEllipse(baseX - 70, 130 + i * 10, 80, 60);
      cloud.fillEllipse(baseX + 70, 130 + i * 10, 90, 50);

      this.tweens.add({
        targets: cloud,
        x: '+=80',
        duration: 7000 + i * 800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        delay: i * 400
      });
    }

    // Gentle distant hills/islands
    const island = this.add.graphics({ x: width * 0.15, y: height * 0.6 });
    island.fillStyle(0x87A96B, 1);
    island.fillEllipse(0, 0, 260, 80);
    island.fillStyle(0x6D8A56, 1);
    island.fillEllipse(60, -10, 160, 60);

    // Friendly dolphin for toddlers
    const dolphin = this.add.graphics({ x: width * 0.2, y: height * 0.62 });
    dolphin.fillStyle(0xFFFFFF, 0.5);
    dolphin.fillEllipse(0, 0, 90, 30);
    dolphin.fillStyle(0x4FC3F7, 1);
    dolphin.fillEllipse(0, 0, 80, 24);
    dolphin.fillStyle(0x4FC3F7, 1);
    dolphin.fillTriangle(-40, 10, -60, 0, -40, -10);
    dolphin.fillStyle(0xFFFFFF, 1);
    dolphin.fillCircle(20, -5, 4);

    this.tweens.add({
      targets: dolphin,
      y: height * 0.62 + 12,
      rotation: 0.08,
      duration: 2200,
      ease: 'Sine.easeInOut',
      repeat: -1,
      yoyo: true
    });

    // Add waves on top of water
    this.createWaves();
  }

  private createPlaceholderGraphics() {
    // Create realistic boat parts with proper shapes
    const graphics = this.add.graphics({ x: 0, y: 0 });
    graphics.setVisible(false);

    // Hull - open boat with visible cockpit interior
    // Outer hull white
    graphics.fillStyle(0xFFFFFF, 1);
    graphics.beginPath();
    graphics.moveTo(8, 28); // Left stern top
    graphics.lineTo(8, 50); // Left stern bottom
    graphics.lineTo(18, 58); // Bottom curve start
    graphics.lineTo(135, 58); // Bottom
    graphics.lineTo(152, 40); // Bow bottom
    graphics.lineTo(162, 22); // Bow point
    graphics.lineTo(152, 15); // Bow top
    graphics.lineTo(18, 15); // Deck line
    graphics.closePath();
    graphics.fillPath();
    graphics.lineStyle(4, 0xE0E0E0, 1);
    graphics.strokePath();

    // Inner cockpit (gray floor visible inside boat)
    graphics.fillStyle(0xBDBDBD, 1);
    graphics.beginPath();
    graphics.moveTo(18, 20); // Interior left
    graphics.lineTo(18, 45); // Interior left bottom
    graphics.lineTo(135, 45); // Interior right bottom
    graphics.lineTo(145, 30); // Interior right
    graphics.lineTo(18, 20);
    graphics.closePath();
    graphics.fillPath();

    // Side gunwales (raised edges)
    graphics.fillStyle(0xF5F5F5, 1);
    // Left gunwale
    graphics.fillRect(8, 20, 12, 8);
    // Right gunwale
    graphics.fillRect(135, 30, 12, 8);

    // Blue hull stripe
    graphics.fillStyle(0x4A90E2, 1);
    graphics.beginPath();
    graphics.moveTo(8, 38);
    graphics.lineTo(18, 48);
    graphics.lineTo(135, 48);
    graphics.lineTo(152, 32);
    graphics.lineTo(152, 28);
    graphics.lineTo(135, 38);
    graphics.lineTo(18, 38);
    graphics.closePath();
    graphics.fillPath();

    // Strong outline
    graphics.lineStyle(4, 0x2C3E50, 1);
    graphics.strokePath();

    // Transom (back) for motor mount - visible notch
    graphics.fillStyle(0xE8E8E8, 1);
    graphics.fillRect(0, 32, 12, 16);
    graphics.lineStyle(3, 0x2C3E50, 1);
    graphics.strokeRect(0, 32, 12, 16);

    graphics.generateTexture('hull', 165, 60);
    graphics.clear();

    // Catamaran hull (narrower, sleeker)
    graphics.fillStyle(0x8B4513, 1);
    graphics.beginPath();
    graphics.moveTo(0, 20);
    graphics.lineTo(5, 35);
    graphics.lineTo(70, 35);
    graphics.lineTo(80, 15);
    graphics.lineTo(75, 8);
    graphics.lineTo(5, 8);
    graphics.closePath();
    graphics.fillPath();
    graphics.lineStyle(2, 0x654321, 1);
    graphics.strokePath();
    graphics.generateTexture('hull-cat', 80, 40);
    graphics.clear();

    // Large ship hull - more realistic cargo/cruise ship shape
    graphics.fillStyle(0x2C3E50, 1);
    graphics.beginPath();
    graphics.moveTo(0, 40);
    graphics.lineTo(10, 70);
    graphics.lineTo(200, 70);
    graphics.lineTo(220, 30);
    graphics.lineTo(210, 15);
    graphics.lineTo(20, 15);
    graphics.closePath();
    graphics.fillPath();
    graphics.lineStyle(4, 0x1A252F, 1);
    graphics.strokePath();
    // Add portholes
    graphics.fillStyle(0x3498DB, 0.8);
    for (let i = 30; i < 190; i += 30) {
      graphics.fillCircle(i, 40, 6);
    }
    // Waterline
    graphics.lineStyle(3, 0xE74C3C, 1);
    graphics.lineTo(15, 50);
    graphics.lineTo(205, 48);
    graphics.strokePath();
    graphics.generateTexture('hull-large', 220, 75);
    graphics.clear();

    // Mast - realistic wooden pole with rigging point
    graphics.fillStyle(0xA0522D, 1);
    graphics.fillRect(8, 0, 12, 100);
    graphics.lineStyle(3, 0x654321, 1);
    graphics.strokeRect(8, 0, 12, 100);
    // Cross beam
    graphics.fillStyle(0x8B4513, 1);
    graphics.fillRect(5, 15, 18, 6);
    graphics.generateTexture('mast', 28, 100);
    graphics.clear();

    // Sail - realistic billowing sail shape
    graphics.fillStyle(0xFFFFFF, 1);
    graphics.fillTriangle(5, 0, 40, 45, 5, 90);
    graphics.lineStyle(2, 0xCCCCCC, 1);
    graphics.strokeTriangle(5, 0, 40, 45, 5, 90);
    // Add sail seams
    graphics.lineStyle(1, 0xDDDDDD, 0.5);
    graphics.lineBetween(5, 20, 30, 38);
    graphics.lineBetween(5, 40, 35, 45);
    graphics.lineBetween(5, 60, 30, 52);
    graphics.generateTexture('sail', 45, 95);
    graphics.clear();

    // Small sail (for catamaran)
    graphics.fillStyle(0xFFFFFF, 1);
    graphics.fillTriangle(3, 0, 25, 30, 3, 60);
    graphics.lineStyle(2, 0xCCCCCC, 1);
    graphics.strokeTriangle(3, 0, 25, 30, 3, 60);
    graphics.generateTexture('sail-small', 30, 65);
    graphics.clear();

    // Cabin - detailed structure with windows and door
    graphics.fillStyle(0xDEB887, 1);
    graphics.fillRoundedRect(0, 15, 70, 45, 6);
    graphics.lineStyle(2, 0xA0826D, 1);
    graphics.strokeRoundedRect(0, 15, 70, 45, 6);
    // Roof
    graphics.fillStyle(0x8B7355, 1);
    graphics.fillRoundedRect(-2, 10, 74, 8, 4);
    // Windows
    graphics.fillStyle(0x87CEEB, 0.8);
    graphics.fillRoundedRect(8, 22, 15, 15, 3);
    graphics.fillRoundedRect(28, 22, 15, 15, 3);
    graphics.fillRoundedRect(48, 22, 15, 15, 3);
    // Door
    graphics.fillStyle(0x654321, 1);
    graphics.fillRoundedRect(25, 40, 20, 18, 2);
    graphics.fillCircle(42, 49, 2);
    graphics.generateTexture('cabin', 75, 65);
    graphics.clear();

    // Console - realistic center console with windshield (larger)
    graphics.fillStyle(0xFFFFFF, 1);
    graphics.fillRoundedRect(0, 22, 60, 42, 6);
    graphics.lineStyle(3, 0xBDBDBD, 1);
    graphics.strokeRoundedRect(0, 22, 60, 42, 6);
    // Windshield frame
    graphics.fillStyle(0xE8E8E8, 1);
    graphics.fillRoundedRect(2, 22, 56, 25, 5);
    // Windshield (tinted glass)
    graphics.fillStyle(0x4A90E2, 0.4);
    graphics.fillRoundedRect(5, 25, 50, 20, 4);
    graphics.lineStyle(2, 0x2C3E50, 1);
    graphics.strokeRoundedRect(5, 25, 50, 20, 4);
    // Dashboard
    graphics.fillStyle(0x2C3E50, 1);
    graphics.fillRect(5, 48, 50, 12);
    // Steering wheel
    graphics.lineStyle(3, 0xE8E8E8, 1);
    graphics.strokeCircle(30, 54, 8);
    graphics.strokeCircle(30, 54, 4);
    graphics.lineBetween(30, 46, 30, 54);
    graphics.generateTexture('console', 60, 66);
    graphics.clear();

    // Outboard motor - detailed motor shape (larger and more realistic)
    graphics.fillStyle(0x2C3E50, 1);
    graphics.fillRoundedRect(5, 0, 40, 55, 6);
    graphics.lineStyle(3, 0x1A252F, 1);
    graphics.strokeRoundedRect(5, 0, 40, 55, 6);
    // Motor cowling details (white accent)
    graphics.fillStyle(0xFFFFFF, 1);
    graphics.fillRoundedRect(8, 8, 34, 12, 4);
    graphics.fillStyle(0xE74C3C, 1);
    graphics.fillRoundedRect(8, 25, 34, 8, 3);
    // Motor brand stripe
    graphics.fillStyle(0x95A5A6, 1);
    graphics.fillRect(10, 38, 30, 3);
    // Propeller shaft
    graphics.fillStyle(0x7F8C8D, 1);
    graphics.fillRect(18, 55, 14, 22);
    // Mounting bracket
    graphics.fillStyle(0x95A5A6, 1);
    graphics.fillRect(12, 52, 26, 6);
    // Propeller
    graphics.fillStyle(0x7F8C8D, 1);
    graphics.beginPath();
    graphics.moveTo(25, 70);
    graphics.lineTo(15, 77);
    graphics.lineTo(25, 84);
    graphics.lineTo(35, 77);
    graphics.closePath();
    graphics.fillPath();
    graphics.generateTexture('outboard', 50, 86);
    graphics.clear();

    // Seat - cushioned boat seat (larger for visibility)
    graphics.fillStyle(0xE74C3C, 1);
    graphics.fillRoundedRect(0, 12, 55, 36, 8);
    // Seat back
    graphics.fillRoundedRect(0, 0, 55, 14, 6);
    graphics.lineStyle(3, 0xC0392B, 1);
    graphics.strokeRoundedRect(0, 12, 55, 36, 8);
    graphics.strokeRoundedRect(0, 0, 55, 14, 6);
    // Stitching lines
    graphics.lineStyle(2, 0xC0392B, 0.5);
    graphics.lineBetween(27, 12, 27, 48);
    graphics.generateTexture('seat', 55, 50);
    graphics.clear();

    // T-top - realistic fishing boat canopy (improved design)
    graphics.fillStyle(0xFFFFFF, 1);
    // Top canvas - rounded for better look
    graphics.fillRoundedRect(0, 0, 95, 10, 6);
    graphics.lineStyle(3, 0xBDC3C7, 1);
    graphics.strokeRoundedRect(0, 0, 95, 10, 6);
    // Support posts - aluminum look
    graphics.fillStyle(0xBDC3C7, 1);
    graphics.fillRect(8, 10, 10, 48);
    graphics.fillRect(77, 10, 10, 48);
    graphics.lineStyle(2, 0x95A5A6, 1);
    graphics.strokeRect(8, 10, 10, 48);
    graphics.strokeRect(77, 10, 10, 48);
    // Cross bar for strength
    graphics.fillStyle(0xBDC3C7, 1);
    graphics.fillRect(8, 30, 79, 8);
    graphics.lineStyle(2, 0x95A5A6, 1);
    graphics.strokeRect(8, 30, 79, 8);
    graphics.generateTexture('ttop', 95, 60);
    graphics.clear();

    // Cooler - detailed cooler box (larger for visibility)
    graphics.fillStyle(0x3498DB, 1);
    graphics.fillRoundedRect(0, 8, 50, 36, 6);
    graphics.lineStyle(3, 0x2980B9, 1);
    graphics.strokeRoundedRect(0, 8, 50, 36, 6);
    // Lid
    graphics.fillStyle(0x5DADE2, 1);
    graphics.fillRoundedRect(0, 0, 50, 10, 6);
    graphics.lineStyle(3, 0x3498DB, 1);
    graphics.strokeRoundedRect(0, 0, 50, 10, 6);
    // Handle
    graphics.fillStyle(0xFFFFFF, 1);
    graphics.fillRect(16, 0, 18, 6);
    // Drain plug
    graphics.fillCircle(43, 38, 3);
    graphics.generateTexture('cooler', 50, 46);
    graphics.clear();

    // Bridge - deck connector with railings
    graphics.fillStyle(0xA0522D, 1);
    graphics.fillRect(0, 5, 100, 12);
    graphics.lineStyle(2, 0x654321, 1);
    graphics.strokeRect(0, 5, 100, 12);
    // Railings
    graphics.lineStyle(2, 0xFFFFFF, 1);
    graphics.strokeRect(0, 0, 100, 5);
    for (let i = 10; i < 100; i += 15) {
      graphics.lineBetween(i, 0, i, 5);
    }
    graphics.generateTexture('bridge', 100, 18);
    graphics.clear();

    // Smokestack - detailed ship stack
    graphics.fillStyle(0xE74C3C, 1);
    graphics.fillRect(5, 8, 28, 62);
    graphics.lineStyle(3, 0xC0392B, 1);
    graphics.strokeRect(5, 8, 28, 62);
    // Top rim (black)
    graphics.fillStyle(0x2C3E50, 1);
    graphics.fillRect(0, 0, 38, 10);
    graphics.strokeRect(0, 0, 38, 10);
    // White stripe
    graphics.fillStyle(0xFFFFFF, 1);
    graphics.fillRect(5, 35, 28, 8);
    graphics.generateTexture('smokestack', 38, 72);
    graphics.clear();

    // Deck - wooden deck with planks
    graphics.fillStyle(0xA0522D, 1);
    graphics.fillRect(0, 0, 150, 12);
    graphics.lineStyle(1, 0x654321, 1);
    graphics.strokeRect(0, 0, 150, 12);
    // Plank lines
    for (let i = 15; i < 150; i += 15) {
      graphics.lineBetween(i, 0, i, 12);
    }
    graphics.generateTexture('deck', 150, 12);
    graphics.clear();

    // Large deck (for cruise ship)
    graphics.fillStyle(0xECF0F1, 1);
    graphics.fillRect(0, 0, 180, 15);
    graphics.lineStyle(2, 0xBDC3C7, 1);
    graphics.strokeRect(0, 0, 180, 15);
    // Deck sections
    for (let i = 20; i < 180; i += 20) {
      graphics.lineBetween(i, 0, i, 15);
    }
    // Railings
    graphics.lineStyle(2, 0x95A5A6, 1);
    graphics.strokeRect(0, 0, 180, 6);
    graphics.generateTexture('deck-large', 180, 15);
    graphics.clear();

    // Bumper - tugboat tire bumper
    graphics.fillStyle(0x2C3E50, 1);
    graphics.fillCircle(18, 18, 18);
    graphics.lineStyle(3, 0x1A252F, 1);
    graphics.strokeCircle(18, 18, 18);
    // Inner circle
    graphics.fillStyle(0x34495E, 1);
    graphics.fillCircle(18, 18, 8);
    graphics.generateTexture('bumper', 38, 38);
    graphics.clear();

    // Flag - waving flag (larger for visibility)
    graphics.fillStyle(0xFF0000, 1);
    graphics.beginPath();
    graphics.moveTo(0, 0);
    graphics.lineTo(42, 7);
    graphics.lineTo(50, 11);
    graphics.lineTo(50, 28);
    graphics.lineTo(42, 32);
    graphics.lineTo(0, 38);
    graphics.closePath();
    graphics.fillPath();
    graphics.lineStyle(3, 0xC0392B, 1);
    graphics.strokePath();
    graphics.generateTexture('flag', 52, 40);
    graphics.clear();

    // Antenna - communication antenna with details (larger for visibility)
    graphics.fillStyle(0x95A5A6, 1);
    graphics.fillRect(8, 12, 8, 60);
    graphics.lineStyle(3, 0x7F8C8D, 1);
    graphics.strokeRect(8, 12, 8, 60);
    // Top element
    graphics.fillStyle(0xE74C3C, 1);
    graphics.fillCircle(12, 8, 8);
    // Signal lines
    graphics.lineStyle(2, 0x95A5A6, 0.5);
    graphics.lineBetween(0, 22, 24, 22);
    graphics.lineBetween(0, 36, 24, 36);
    graphics.lineBetween(0, 50, 24, 50);
    graphics.generateTexture('antenna', 25, 75);
    graphics.clear();

    // Cargo container - realistic shipping container
    graphics.fillStyle(0xE67E22, 1);
    graphics.fillRect(0, 0, 65, 45);
    graphics.lineStyle(3, 0xD35400, 1);
    graphics.strokeRect(0, 0, 65, 45);
    // Vertical ribs
    graphics.lineStyle(2, 0xD35400, 1);
    for (let i = 8; i < 65; i += 8) {
      graphics.lineBetween(i, 0, i, 45);
    }
    // Doors
    graphics.fillStyle(0xD35400, 1);
    graphics.fillRect(26, 8, 2, 32);
    graphics.fillRect(37, 8, 2, 32);
    // Door handles
    graphics.fillStyle(0x95A5A6, 1);
    graphics.fillRect(30, 20, 5, 3);
    graphics.generateTexture('cargo', 65, 45);
    graphics.clear();

    // Crane - detailed cargo crane
    graphics.fillStyle(0xF39C12, 1);
    // Base
    graphics.fillRect(0, 55, 18, 20);
    // Vertical tower
    graphics.fillRect(4, 10, 10, 50);
    // Boom (horizontal arm)
    graphics.fillRect(10, 10, 45, 8);
    graphics.lineStyle(2, 0xD68910, 1);
    graphics.strokeRect(0, 55, 18, 20);
    graphics.strokeRect(4, 10, 10, 50);
    graphics.strokeRect(10, 10, 45, 8);
    // Hook cable
    graphics.lineStyle(2, 0x2C3E50, 1);
    graphics.lineBetween(50, 18, 50, 35);
    // Hook
    graphics.fillStyle(0x95A5A6, 1);
    graphics.fillCircle(50, 38, 4);
    graphics.generateTexture('crane', 58, 78);
    graphics.clear();

    // Ship bridge - detailed command center
    graphics.fillStyle(0xECF0F1, 1);
    graphics.fillRoundedRect(0, 12, 90, 58, 6);
    graphics.lineStyle(3, 0xBDC3C7, 1);
    graphics.strokeRoundedRect(0, 12, 90, 58, 6);
    // Roof
    graphics.fillStyle(0xBDC3C7, 1);
    graphics.fillRoundedRect(-3, 8, 96, 8, 4);
    // Windows (front)
    graphics.fillStyle(0x3498DB, 0.7);
    graphics.fillRoundedRect(5, 20, 20, 25, 3);
    graphics.fillRoundedRect(28, 20, 20, 25, 3);
    graphics.fillRoundedRect(51, 20, 20, 25, 3);
    // Door
    graphics.fillStyle(0x2C3E50, 1);
    graphics.fillRoundedRect(35, 48, 20, 20, 3);
    graphics.generateTexture('ship-bridge', 95, 72);
    graphics.clear();

    // Funnel - cruise ship funnel with company colors
    graphics.fillStyle(0xE74C3C, 1);
    graphics.fillRect(8, 10, 34, 52);
    graphics.lineStyle(3, 0xC0392B, 1);
    graphics.strokeRect(8, 10, 34, 52);
    // Top rim
    graphics.fillStyle(0x2C3E50, 1);
    graphics.fillRect(5, 0, 40, 12);
    graphics.strokeRect(5, 0, 40, 12);
    // Company stripe
    graphics.fillStyle(0xFFFFFF, 1);
    graphics.fillRect(8, 28, 34, 10);
    graphics.fillStyle(0x3498DB, 1);
    graphics.fillRect(8, 33, 34, 5);
    graphics.generateTexture('funnel', 52, 65);
    graphics.clear();

    // Lifeboat - realistic rescue boat
    graphics.fillStyle(0xFF9800, 1);
    graphics.beginPath();
    graphics.moveTo(5, 10);
    graphics.lineTo(2, 18);
    graphics.lineTo(42, 18);
    graphics.lineTo(45, 10);
    graphics.lineTo(42, 5);
    graphics.lineTo(5, 5);
    graphics.closePath();
    graphics.fillPath();
    graphics.lineStyle(2, 0xF57C00, 1);
    graphics.strokePath();
    // Cover
    graphics.fillStyle(0xFF9800, 0.6);
    graphics.fillRoundedRect(5, 0, 37, 8, 4);
    graphics.generateTexture('lifeboat', 48, 20);
    graphics.clear();

    graphics.destroy();
  }

  private createWaves() {
    const { height } = this.cameras.main;
    const waveY = height * 0.6;

    // Simple wave animation
    const wave1 = this.add.ellipse(0, waveY, 200, 40, 0x5BA3D0, 0.5);
    const wave2 = this.add.ellipse(100, waveY + 10, 200, 40, 0x5BA3D0, 0.5);
    const wave3 = this.add.ellipse(200, waveY, 200, 40, 0x5BA3D0, 0.5);

    this.tweens.add({
      targets: [wave1, wave2, wave3],
      x: '+=400',
      duration: 5000,
      repeat: -1,
      yoyo: false
    });
  }

  private loadLevel(levelId: number) {
    // Define boat configurations
    const levels: Record<number, BoatLevel> = {
      1: this.createKayakLevel(),
      2: this.createSailboatLevel(),
      3: this.createCanoeLevel(),
      4: this.createSpeedboatLevel(),
      5: this.createYachtLevel(),
      6: this.createTugboatLevel(),
      7: this.createFerryLevel(),
      8: this.createTrawlerLevel(),
      9: this.createCargoLevel(),
      10: this.createSubmarineLevel()
    };

    this.levelData = levels[levelId];

    if (!this.levelData) {
      console.error('Level not found:', levelId);
      // Default to level 1 if not found
      this.levelData = levels[1];
    }

    this.createBoatParts();
  }

  private createKayakLevel(): BoatLevel {
    // Level 1: Small Sailboat - 3 parts
    const { width, height } = this.cameras.main;
    const centerX = width / 2;
    const waterY = height * 0.65;

    return {
      id: 1,
      name: 'Small Sailboat',
      boatType: 'sailboat',
      background: 'lake',
      parts: [
        {
          key: 'hull',
          x: 100,
          y: height - 150,
          correctPosition: { x: centerX, y: waterY },
          snapped: false,
          friendlyName: 'boat body'
        },
        {
          key: 'mast',
          x: width - 150,
          y: 180,
          correctPosition: { x: centerX - 10, y: waterY - 70 },
          snapped: false,
          friendlyName: 'tall mast'
        },
        {
          key: 'sail',
          x: 150,
          y: 220,
          correctPosition: { x: centerX + 12, y: waterY - 60 },
          snapped: false,
          friendlyName: 'windy sail'
        }
      ]
    };
  }

  private createSailboatLevel(): BoatLevel {
    // Level 2: Dual Console Outboard Boat - 4 parts positioned to look integrated
    const { width, height } = this.cameras.main;
    const centerX = width / 2;
    const waterY = height * 0.65;

    return {
      id: 2,
      name: 'Outboard Boat',
      boatType: 'outboard',
      background: 'ocean',
      parts: [
        {
          key: 'hull',
          x: 100,
          y: height - 150,
          correctPosition: { x: centerX, y: waterY + 2 },
          snapped: false,
          friendlyName: 'boat body'
        },
        {
          key: 'console',
          x: width - 180,
          y: 220,
          correctPosition: { x: centerX + 8, y: waterY - 20 },
          snapped: false,
          friendlyName: 'steering wheel'
        },
        {
          key: 'seat',
          x: width - 130,
          y: height - 200,
          correctPosition: { x: centerX - 30, y: waterY - 10 },
          snapped: false,
          friendlyName: 'comfy seat'
        },
        {
          key: 'outboard',
          x: 120,
          y: height - 250,
          correctPosition: { x: centerX - 80, y: waterY + 12 },
          snapped: false,
          friendlyName: 'motor'
        }
      ]
    };
  }

  private createCanoeLevel(): BoatLevel {
    // Level 3: Center Console Fishing Boat with T-Top - 5 parts positioned to look integrated
    const { width, height } = this.cameras.main;
    const centerX = width / 2;
    const waterY = height * 0.65;

    return {
      id: 3,
      name: 'Fishing Boat',
      boatType: 'fishing',
      background: 'ocean',
      parts: [
        {
          key: 'hull',
          x: 100,
          y: height - 150,
          correctPosition: { x: centerX, y: waterY + 2 },
          snapped: false,
          friendlyName: 'boat body'
        },
        {
          key: 'console',
          x: width - 180,
          y: 250,
          correctPosition: { x: centerX + 5, y: waterY - 20 },
          snapped: false,
          friendlyName: 'steering wheel'
        },
        {
          key: 'ttop',
          x: width - 130,
          y: 170,
          correctPosition: { x: centerX + 5, y: waterY - 50 },
          snapped: false,
          friendlyName: 'sun shade'
        },
        {
          key: 'cooler',
          x: 150,
          y: height - 200,
          correctPosition: { x: centerX - 40, y: waterY - 8 },
          snapped: false,
          friendlyName: 'cooler box'
        },
        {
          key: 'outboard',
          x: 120,
          y: height - 250,
          correctPosition: { x: centerX - 80, y: waterY + 12 },
          snapped: false,
          friendlyName: 'motor'
        }
      ]
    };
  }

  private createSpeedboatLevel(): BoatLevel {
    // Level 4: Catamaran Sailboat - 6 parts
    const { width, height } = this.cameras.main;
    const centerX = width / 2;
    const waterY = height * 0.65;

    return {
      id: 4,
      name: 'Catamaran',
      boatType: 'catamaran',
      background: 'ocean',
      parts: [
        {
          key: 'hull-cat',
          x: 100,
          y: height - 150,
          correctPosition: { x: centerX - 50, y: waterY + 5 },
          snapped: false,
          friendlyName: 'left hull'
        },
        {
          key: 'hull-cat',
          x: width - 150,
          y: height - 150,
          correctPosition: { x: centerX + 50, y: waterY + 5 },
          snapped: false,
          friendlyName: 'right hull'
        },
        {
          key: 'bridge',
          x: 150,
          y: height - 250,
          correctPosition: { x: centerX, y: waterY - 12 },
          snapped: false,
          friendlyName: 'deck bridge'
        },
        {
          key: 'mast',
          x: width - 180,
          y: 180,
          correctPosition: { x: centerX, y: waterY - 70 },
          snapped: false,
          friendlyName: 'tall mast'
        },
        {
          key: 'sail-small',
          x: 100,
          y: 200,
          correctPosition: { x: centerX + 10, y: waterY - 60 },
          snapped: false,
          friendlyName: 'left sail'
        },
        {
          key: 'sail-small',
          x: width - 120,
          y: 200,
          correctPosition: { x: centerX + 25, y: waterY - 45 },
          snapped: false,
          friendlyName: 'right sail'
        }
      ]
    };
  }

  private createYachtLevel(): BoatLevel {
    // Level 5: Tugboat - 6 parts
    const { width, height } = this.cameras.main;
    const centerX = width / 2;
    const waterY = height * 0.65;

    return {
      id: 5,
      name: 'Tugboat',
      boatType: 'tugboat',
      background: 'ocean',
      parts: [
        {
          key: 'hull',
          x: 100,
          y: height - 150,
          correctPosition: { x: centerX, y: waterY },
          snapped: false,
          friendlyName: 'boat body'
        },
        {
          key: 'deck',
          x: width - 180,
          y: height - 200,
          correctPosition: { x: centerX, y: waterY - 22 },
          snapped: false,
          friendlyName: 'boat deck'
        },
        {
          key: 'cabin',
          x: 150,
          y: 250,
          correctPosition: { x: centerX, y: waterY - 52 },
          snapped: false,
          friendlyName: 'cozy cabin'
        },
        {
          key: 'smokestack',
          x: width - 130,
          y: 180,
          correctPosition: { x: centerX + 12, y: waterY - 96 },
          snapped: false,
          friendlyName: 'smoke pipe'
        },
        {
          key: 'bumper',
          x: 120,
          y: height - 250,
          correctPosition: { x: centerX - 65, y: waterY - 5 },
          snapped: false,
          friendlyName: 'bumper'
        },
        {
          key: 'flag',
          x: width - 100,
          y: 150,
          correctPosition: { x: centerX + 20, y: waterY - 125 },
          snapped: false,
          friendlyName: 'flutter flag'
        }
      ]
    };
  }

  private createTugboatLevel(): BoatLevel {
    // Level 6: Yacht - 7 parts
    const { width, height } = this.cameras.main;
    const centerX = width / 2;
    const waterY = height * 0.65;

    return {
      id: 6,
      name: 'Fancy Yacht',
      boatType: 'yacht',
      background: 'ocean',
      parts: [
        {
          key: 'hull',
          x: 100,
          y: height - 150,
          correctPosition: { x: centerX, y: waterY },
          snapped: false,
          friendlyName: 'boat body'
        },
        {
          key: 'deck',
          x: width - 180,
          y: height - 250,
          correctPosition: { x: centerX, y: waterY - 22 },
          snapped: false,
          friendlyName: 'boat deck'
        },
        {
          key: 'cabin',
          x: 150,
          y: 250,
          correctPosition: { x: centerX + 8, y: waterY - 52 },
          snapped: false,
          friendlyName: 'cozy cabin'
        },
        {
          key: 'mast',
          x: width - 130,
          y: 180,
          correctPosition: { x: centerX - 32, y: waterY - 72 },
          snapped: false,
          friendlyName: 'tall mast'
        },
        {
          key: 'sail',
          x: 120,
          y: 200,
          correctPosition: { x: centerX - 15, y: waterY - 62 },
          snapped: false,
          friendlyName: 'windy sail'
        },
        {
          key: 'antenna',
          x: width - 100,
          y: height - 200,
          correctPosition: { x: centerX + 28, y: waterY - 86 },
          snapped: false,
          friendlyName: 'antenna'
        },
        {
          key: 'flag',
          x: 180,
          y: 150,
          correctPosition: { x: centerX - 40, y: waterY - 110 },
          snapped: false,
          friendlyName: 'flutter flag'
        }
      ]
    };
  }

  private createFerryLevel(): BoatLevel {
    // Level 7: Cargo Ship - 8 parts
    const { width, height } = this.cameras.main;
    const centerX = width / 2;
    const waterY = height * 0.65;

    return {
      id: 7,
      name: 'Cargo Ship',
      boatType: 'cargo',
      background: 'ocean',
      parts: [
        {
          key: 'hull-large',
          x: 100,
          y: height - 150,
          correctPosition: { x: centerX, y: waterY },
          snapped: false,
          friendlyName: 'big boat body'
        },
        {
          key: 'deck',
          x: width - 180,
          y: height - 280,
          correctPosition: { x: centerX - 15, y: waterY - 32 },
          snapped: false,
          friendlyName: 'boat deck'
        },
        {
          key: 'cargo',
          x: 120,
          y: height - 250,
          correctPosition: { x: centerX - 58, y: waterY - 54 },
          snapped: false,
          friendlyName: 'cargo box 1'
        },
        {
          key: 'cargo',
          x: width - 130,
          y: height - 200,
          correctPosition: { x: centerX + 10, y: waterY - 54 },
          snapped: false,
          friendlyName: 'cargo box 2'
        },
        {
          key: 'cargo',
          x: 150,
          y: 200,
          correctPosition: { x: centerX - 58, y: waterY - 99 },
          snapped: false,
          friendlyName: 'cargo box 3'
        },
        {
          key: 'crane',
          x: width - 100,
          y: 180,
          correctPosition: { x: centerX + 15, y: waterY - 97 },
          snapped: false,
          friendlyName: 'big crane'
        },
        {
          key: 'ship-bridge',
          x: 180,
          y: 250,
          correctPosition: { x: centerX + 62, y: waterY - 68 },
          snapped: false,
          friendlyName: 'captain bridge'
        },
        {
          key: 'smokestack',
          x: width - 150,
          y: 150,
          correctPosition: { x: centerX + 70, y: waterY - 108 },
          snapped: false,
          friendlyName: 'smoke pipe'
        }
      ]
    };
  }

  private createTrawlerLevel(): BoatLevel {
    // Level 8: Cruise Ship - 9 parts
    const { width, height } = this.cameras.main;
    const centerX = width / 2;
    const waterY = height * 0.65;

    return {
      id: 8,
      name: 'Cruise Ship',
      boatType: 'cruise',
      background: 'ocean',
      parts: [
        {
          key: 'hull-large',
          x: 100,
          y: height - 150,
          correctPosition: { x: centerX, y: waterY },
          snapped: false,
          friendlyName: 'big boat body'
        },
        {
          key: 'deck-large',
          x: width - 180,
          y: 300,
          correctPosition: { x: centerX, y: waterY - 30 },
          snapped: false,
          friendlyName: 'deck 1'
        },
        {
          key: 'deck-large',
          x: 120,
          y: height - 300,
          correctPosition: { x: centerX, y: waterY - 45 },
          snapped: false,
          friendlyName: 'deck 2'
        },
        {
          key: 'deck-large',
          x: width - 130,
          y: height - 250,
          correctPosition: { x: centerX, y: waterY - 60 },
          snapped: false,
          friendlyName: 'deck 3'
        },
        {
          key: 'lifeboat',
          x: 150,
          y: height - 200,
          correctPosition: { x: centerX - 65, y: waterY - 50 },
          snapped: false,
          friendlyName: 'rescue boat'
        },
        {
          key: 'ship-bridge',
          x: width - 150,
          y: 220,
          correctPosition: { x: centerX + 45, y: waterY - 88 },
          snapped: false,
          friendlyName: 'captain bridge'
        },
        {
          key: 'funnel',
          x: width - 100,
          y: 180,
          correctPosition: { x: centerX + 38, y: waterY - 120 },
          snapped: false,
          friendlyName: 'big chimney 1'
        },
        {
          key: 'funnel',
          x: 180,
          y: 150,
          correctPosition: { x: centerX + 62, y: waterY - 120 },
          snapped: false,
          friendlyName: 'big chimney 2'
        },
        {
          key: 'antenna',
          x: 110,
          y: height - 180,
          correctPosition: { x: centerX + 50, y: waterY - 114 },
          snapped: false,
          friendlyName: 'antenna'
        }
      ]
    };
  }

  private createCargoLevel(): BoatLevel {
    // Level 9: Reserved for future expansion
    return this.createFerryLevel();
  }

  private createSubmarineLevel(): BoatLevel {
    // Level 10: Reserved for future expansion
    return this.createTrawlerLevel();
  }

  /**
   * Spawns draggable boat pieces, their gentle float tweens, and faint
   * placement guides so little players know where each part belongs.
   */
  private createBoatParts() {
    this.boatParts = [];
    this.completedParts = 0;

    this.levelData.parts.forEach((partData, index) => {
      this.ensureTextureExists(partData.key);

      partData.friendlyName = partData.friendlyName ?? this.getFriendlyPartName(partData.key);
      if (partData.correctPosition) {
        partData.guide = this.createPartGuide(partData);
      }

      const sprite = this.add.sprite(partData.x, partData.y, partData.key);
      sprite.setScale(1.2); // Larger for toddlers
      sprite.setInteractive();
      this.input.setDraggable(sprite);

      // Add glow effect
      sprite.setTint(0xFFFFFF);

      // Set initial depth for draggable state
      sprite.setDepth(10 + index);

      partData.sprite = sprite;
      this.startFloatTween(partData);

      // Drag events
      sprite.on('dragstart', () => {
        audioService.play('whoosh');
        sprite.setScale(1.4);
        sprite.setDepth(100);

        if (partData.floatTween) {
          partData.floatTween.stop();
          partData.floatTween = undefined;
        }
      });

      sprite.on('drag', (_pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
        sprite.setPosition(dragX, dragY);
      });

      sprite.on('dragend', () => {
        this.checkPartPlacement(partData, sprite);
      });

      this.boatParts.push(partData);
    });

    this.showNextHint();
  }

  private checkPartPlacement(part: BoatPart, sprite: Phaser.GameObjects.Sprite) {
    if (!part.correctPosition || !sprite) return;

    const distance = Phaser.Math.Distance.Between(
      sprite.x,
      sprite.y,
      part.correctPosition.x,
      part.correctPosition.y
    );

    const snapDistance = 100; // Generous snap distance for toddlers

    if (distance < snapDistance && !part.snapped) {
      // Snap to correct position
      this.tweens.add({
        targets: sprite,
        x: part.correctPosition.x,
        y: part.correctPosition.y,
        scale: 1.2,
        duration: 300,
        ease: 'Back.easeOut',
        onComplete: () => {
          part.snapped = true;
          this.completedParts++;
          audioService.play('snap');
          audioService.play('ding');

          part.floatTween?.stop();
          part.floatTween = undefined;

          // Set proper depth based on part type for proper layering
          const depth = this.getPartDepth(part.key);
          sprite.setDepth(depth);

          // Disable further dragging
          sprite.disableInteractive();

          // Add sparkle effect
          this.createSparkle(sprite.x, sprite.y);

          if (part.guide) {
            this.tweens.add({
              targets: part.guide,
              alpha: 0,
              duration: 400,
              onComplete: () => {
                part.guide?.destroy();
                part.guide = undefined;
              }
            });
          }

          // Check if level complete
          if (this.completedParts === this.levelData.parts.length) {
            this.completeLevel();
          } else {
            this.updateProgress();
            this.showNextHint();
          }
        }
      });
    } else {
      // Return to original scale
      sprite.setScale(1.2);
      sprite.setDepth(1);
      if (!part.floatTween) {
        this.startFloatTween(part);
      }
    }
  }

  /**
   * Places a translucent silhouette for a part at its correct location to act
   * as a visual hint before the toddler snaps the real piece into place.
   */
  private createPartGuide(part: BoatPart) {
    if (!part.correctPosition) return undefined;

    this.ensureTextureExists(part.key);
    const guide = this.add.sprite(part.correctPosition.x, part.correctPosition.y, part.key);
    guide.setScale(1.28);
    guide.setAlpha(0.18);
    guide.setDepth(0.5);
    guide.setTint(0xFFFFFF);

    return guide;
  }

  private ensureTextureExists(textureKey: string) {
    if (this.textures.exists(textureKey)) {
      const texture = this.textures.get(textureKey);
      if (texture?.source[0]?.image || texture?.source[0]?.canvas) {
        return;
      }
    }
    this.createPlaceholderGraphics();
  }

  private startFloatTween(part: BoatPart) {
    if (!part.sprite) return;

    part.floatTween = this.tweens.add({
      targets: part.sprite,
      rotation: { from: -0.02, to: 0.02 },
      y: part.sprite.y - 6,
      duration: 1600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  private getFriendlyPartName(key: string): string {
    const names: Record<string, string> = {
      hull: 'boat body',
      'hull-cat': 'boat body',
      'hull-large': 'big boat body',
      mast: 'tall mast',
      sail: 'windy sail',
      'sail-small': 'small sail',
      cabin: 'cozy cabin',
      console: 'steering wheel',
      outboard: 'motor',
      seat: 'comfy seat',
      ttop: 'sun shade',
      cooler: 'cooler box',
      bridge: 'deck bridge',
      smokestack: 'smoke pipe',
      deck: 'boat deck',
      'deck-large': 'big deck',
      bumper: 'bumper',
      flag: 'flutter flag',
      antenna: 'antenna',
      cargo: 'cargo box',
      crane: 'big crane',
      'ship-bridge': 'captain bridge',
      funnel: 'big chimney',
      lifeboat: 'rescue boat'
    };

    return names[key] || 'piece';
  }

  /**
   * Returns proper depth value for a part to ensure correct layering.
   * Lower parts (hulls) have lower depth, higher parts (flags, antennas) have higher depth.
   */
  private getPartDepth(key: string): number {
    const depthMap: Record<string, number> = {
      // Base layer - hulls
      'hull': 1,
      'hull-cat': 1,
      'hull-large': 1,
      // Water level layer
      'bumper': 2,
      'outboard': 2,
      // Deck level
      'deck': 3,
      'deck-large': 3,
      'bridge': 3,
      'lifeboat': 3,
      // Floor items
      'seat': 4,
      'cooler': 4,
      'cargo': 4,
      // Mid-level structures
      'console': 5,
      'cabin': 6,
      'ship-bridge': 6,
      // Tall structures
      'mast': 7,
      'crane': 7,
      'ttop': 7,
      'smokestack': 8,
      'funnel': 8,
      // High elements - sails and flags
      'sail': 9,
      'sail-small': 9,
      'antenna': 10,
      'flag': 10
    };

    return depthMap[key] || 5; // Default to middle depth
  }

  /**
   * Updates the helper text and briefly pulses the next guide silhouette so
   * toddlers always know which piece to look for next.
   */
  private showNextHint() {
    if (!this.instructionText) return;

    const nextPart = this.boatParts.find((part) => !part.snapped);

    if (!nextPart) {
      this.instructionText.setText('All aboard! Your boat is ready.');
      return;
    }

    const friendly = nextPart.friendlyName || 'piece';
    this.instructionText.setText(`Can you place the ${friendly}?`);

    if (nextPart.guide && nextPart.guide.active) {
      nextPart.guide.setAlpha(0.28);
      this.tweens.add({
        targets: nextPart.guide,
        alpha: { from: 0.28, to: 0.12 },
        duration: 600,
        yoyo: true,
        repeat: 2
      });
    } else if (nextPart.correctPosition) {
      nextPart.guide = this.createPartGuide(nextPart);
      nextPart.guide?.setAlpha(0.28);
      if (nextPart.guide) {
        this.tweens.add({
          targets: nextPart.guide,
          alpha: { from: 0.28, to: 0.12 },
          duration: 600,
          yoyo: true,
          repeat: 2
        });
      }
    }
  }

  private createSparkle(x: number, y: number) {
    const sparkle = this.add.circle(x, y, 30, 0xFFD93D, 1);
    this.tweens.add({
      targets: sparkle,
      scale: 2,
      alpha: 0,
      duration: 500,
      ease: 'Power2',
      onComplete: () => sparkle.destroy()
    });
  }

  /**
   * Creates the UI structure (text objects and helper character).
   * Called before level data is loaded to ensure text objects exist.
   */
  private createUIStructure() {
    const { width } = this.cameras.main;

    // Instruction - create with placeholder text
    this.instructionText = this.add.text(
      width / 2,
      120,
      'Loading...',
      {
        fontSize: '28px',
        color: '#FFFFFF',
        fontStyle: 'bold',
        stroke: '#263238',
        strokeThickness: 3
      }
    ).setOrigin(0.5);

    // Progress - create with placeholder text
    this.progressText = this.add.text(
      width / 2,
      170,
      '0 / 0 parts',
      {
        fontSize: '24px',
        color: '#FFD93D',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5);

    // Friendly helper character
    const buddyX = width / 2 - 240;
    const buddyY = 115;
    const buddyBody = this.add.ellipse(buddyX, buddyY, 70, 70, 0xFFCC80).setStrokeStyle(4, 0xE2955D).setDepth(5);
    const buddyFin = this.add.ellipse(buddyX + 30, buddyY + 10, 28, 18, 0xFFB74D).setDepth(5);
    const buddyEye = this.add.circle(buddyX - 12, buddyY - 10, 6, 0x263238).setDepth(6);
    const buddySmile = this.add.graphics().setDepth(6);
    buddySmile.lineStyle(3, 0x263238, 1);
    buddySmile.beginPath();
    buddySmile.arc(buddyX - 6, buddyY + 6, 14, Phaser.Math.DegToRad(20), Phaser.Math.DegToRad(160));
    buddySmile.strokePath();

    this.tweens.add({
      targets: [buddyBody, buddyFin, buddyEye],
      y: buddyY + 6,
      duration: 1800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  /**
   * Updates UI with level-specific data after level is loaded.
   */
  private updateUIWithLevelData() {
    const { width } = this.cameras.main;

    // Title
    this.add.text(width / 2, 50, this.levelData.name, {
      fontSize: '40px',
      color: '#FFFFFF',
      fontStyle: 'bold',
      stroke: '#263238',
      strokeThickness: 4
    }).setOrigin(0.5);

    // Update instruction text
    if (this.instructionText) {
      this.instructionText.setText('Drag the parts to build your boat!');
    }

    // Update progress
    this.updateProgress();
  }

  private updateProgress() {
    if (this.progressText) {
      this.progressText.setText(
        `${this.completedParts} / ${this.levelData.parts.length} parts`
      );
    }
  }

  private setupConfetti() {
    // Particle system for celebration
    // Using Phaser 3.90+ API
    this.celebrationEmitter = this.add.particles(0, 0, 'sail', {
      x: { min: 0, max: this.cameras.main.width },
      y: -50,
      speed: { min: 200, max: 400 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.3, end: 0 },
      lifespan: 2000,
      gravityY: 300,
      quantity: 3,
      frequency: 100,
      emitting: false
    });
  }

  private completeLevel() {
    audioService.play('cheer');
    audioService.play('horn');

    if (this.instructionText) {
      this.instructionText.setText('Ship shape! Tap next to keep sailing.');
    }

    // Show confetti
    if (this.celebrationEmitter) {
      this.celebrationEmitter.start();
      this.time.delayedCall(3000, () => {
        this.celebrationEmitter?.stop();
      });
    }

    // Calculate stars (3 stars for completion in this demo)
    const stars = 3;

    // Save progress
    progressService.completeBoatLevel(this.currentLevel, stars);

    // Show completion message
    const { width, height } = this.cameras.main;
    const successText = this.add.text(
      width / 2,
      height / 2,
      '🎉 Great Job! 🎉',
      {
        fontSize: '60px',
        color: '#FFD93D',
        fontStyle: 'bold',
        stroke: '#263238',
        strokeThickness: 6
      }
    ).setOrigin(0.5).setDepth(200);

    // Animate
    this.tweens.add({
      targets: successText,
      scale: { from: 0, to: 1.2 },
      duration: 500,
      ease: 'Back.easeOut'
    });

    // Show next level button after delay
    this.time.delayedCall(2000, () => {
      this.showLevelCompleteButtons();
    });
  }

  private showLevelCompleteButtons() {
    const { width, height } = this.cameras.main;

    // "Play Again" button
    const againButton = this.add.rectangle(
      width / 2 - 100,
      height - 100,
      180,
      80,
      0x4A90E2
    ).setInteractive().setDepth(200);

    const againText = this.add.text(
      width / 2 - 100,
      height - 100,
      'Again!',
      {
        fontSize: '32px',
        color: '#FFFFFF',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5).setDepth(200);

    this.tweens.add({
      targets: againText,
      scale: { from: 0.95, to: 1.05 },
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    againButton.on('pointerdown', () => {
      audioService.play('tap');
      this.scene.restart();
    });

    // "Next Level" button (if available)
    if (this.currentLevel < 10) {
      const nextButton = this.add.rectangle(
        width / 2 + 100,
        height - 100,
        180,
        80,
        0x4CAF50
      ).setInteractive().setDepth(200);

      const nextText = this.add.text(
        width / 2 + 100,
        height - 100,
        'Next!',
        {
          fontSize: '32px',
          color: '#FFFFFF',
          fontStyle: 'bold'
        }
      ).setOrigin(0.5).setDepth(200);

      this.tweens.add({
        targets: nextText,
        scale: { from: 0.95, to: 1.05 },
        duration: 900,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        delay: 150
      });

      nextButton.on('pointerdown', () => {
        audioService.play('tap');
        this.currentLevel++;
        this.scene.restart();
      });
    }
  }

  update() {
    // Optional: Add floating animation to unsnapped parts
  }
}
