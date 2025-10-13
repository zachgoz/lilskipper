import Phaser from 'phaser';
import { audioService } from '../../services/audio';
import { progressService } from '../../services/progress';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

interface DrawingTool {
  name: string;
  color: number;
  size: number;
  icon: string;
}

/**
 * Freeform drawing bay with gentle guides, animated scenery, and voice-like
 * prompts that encourage toddlers to experiment with color and tracing.
 */
export default class DrawingScene extends Phaser.Scene {
  private drawingGraphics?: Phaser.GameObjects.Graphics;
  private isDrawing = false;
  private currentTool: DrawingTool;
  private tools: DrawingTool[] = [];
  private lastPoint?: { x: number; y: number };
  private canvasArea?: Phaser.GameObjects.Rectangle;
  private template?: Phaser.GameObjects.Graphics;
  private currentTemplate = 0;
  private helperText?: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'DrawingScene' });

    // Initialize tools
    this.currentTool = {
      name: 'Blue',
      color: 0x4A90E2,
      size: 8,
      icon: '🖌️'
    };
  }

  preload() {
    // Nothing to preload for drawing
  }

  create() {
    const { width, height } = this.cameras.main;

    this.createBackground(width, height);

    // Title
    this.add.text(width / 2, 50, '🎨 Draw & Color 🎨', {
      fontSize: '42px',
      color: '#263238',
      fontStyle: 'bold',
      stroke: '#FFFFFF',
      strokeThickness: 4
    }).setOrigin(0.5);

    this.helperText = this.add.text(width / 2, 110, 'Pick a color and start drawing!', {
      fontSize: '26px',
      color: '#263238',
      fontStyle: 'bold',
      backgroundColor: '#FFFFFF',
      padding: { x: 16, y: 8 }
    }).setOrigin(0.5);

    this.createFriendlyGuide();

    // Create tools
    this.setupTools();

    // Create canvas area
    this.createCanvas();

    // Create tool palette
    this.createToolPalette();

    // Create action buttons
    this.createActionButtons();

    // Show initial template
    this.showTemplate(this.currentTemplate);
    this.showHelperMessage('Pick a color and start drawing!');
  }

  /**
   * Builds the sunny shoreline backdrop and subtle motion that frames the
   * drawing canvas.
   */
  private createBackground(width: number, height: number) {
    this.add.rectangle(0, 0, width, height, 0xB3E5FC).setOrigin(0);
    this.add.rectangle(0, height * 0.55, width, height * 0.45, 0x81D4FA).setOrigin(0);

    const sun = this.add.circle(width - 90, 90, 60, 0xFFE082);
    this.tweens.add({
      targets: sun,
      scale: { from: 1, to: 1.08 },
      duration: 2600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    for (let i = 0; i < 3; i++) {
      const cloud = this.add.graphics({ x: 120 + i * 220, y: 120 });
      cloud.fillStyle(0xFFFFFF, 0.9);
      cloud.fillEllipse(0, 0, 120, 50);
      cloud.fillEllipse(-50, 10, 80, 40);
      cloud.fillEllipse(60, 12, 70, 36);
      this.tweens.add({
        targets: cloud,
        x: '+=50',
        duration: 5000 + i * 600,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }

    const water = this.add.graphics();
    water.lineStyle(3, 0x4A90E2, 0.5);
    for (let x = 0; x < width; x += 80) {
      const path = new Phaser.Curves.Path(x, height * 0.62);
      path.quadraticBezierTo(x + 40, height * 0.66, x + 80, height * 0.62);
      path.draw(water);
    }
  }

  /**
   * Adds a cheerful mascot near the helper text to personify the guidance.
   */
  private createFriendlyGuide() {
    const buddyX = 110;
    const buddyY = 110;

    const body = this.add.ellipse(buddyX, buddyY, 70, 60, 0xFFE0B2).setDepth(5);
    const wing = this.add.ellipse(buddyX - 30, buddyY + 10, 40, 22, 0xFFE0B2).setDepth(4).setRotation(-0.4);
    const beak = this.add.triangle(buddyX + 30, buddyY - 6, buddyX + 46, buddyY, buddyX + 30, buddyY + 8, buddyX + 30, buddyY - 8, 0xFFB74D).setDepth(6);
    const eye = this.add.circle(buddyX + 12, buddyY - 10, 5, 0x263238).setDepth(6);

    this.tweens.add({
      targets: [body, wing, beak, eye],
      y: buddyY + 6,
      duration: 1800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  /**
   * Refreshes the helper caption with a small bounce so instructions stay
   * playful.
   */
  private showHelperMessage(message: string) {
    if (!this.helperText) return;

    this.helperText.setText(message);
    this.tweens.add({
      targets: this.helperText,
      scale: { from: 1, to: 1.05 },
      duration: 220,
      yoyo: true,
      ease: 'Sine.easeOut'
    });
  }

  private setupTools() {
    this.tools = [
      { name: 'Red', color: 0xFF5252, size: 10, icon: '🔴' },
      { name: 'Blue', color: 0x4A90E2, size: 10, icon: '🔵' },
      { name: 'Green', color: 0x4CAF50, size: 10, icon: '🟢' },
      { name: 'Yellow', color: 0xFFEB3B, size: 10, icon: '🟡' },
      { name: 'Orange', color: 0xFF9800, size: 10, icon: '🟠' },
      { name: 'Purple', color: 0x9C27B0, size: 10, icon: '🟣' },
      { name: 'Brown', color: 0x795548, size: 10, icon: '🟤' },
      { name: 'Black', color: 0x000000, size: 12, icon: '⚫' },
      { name: 'Eraser', color: 0xFFFFFF, size: 24, icon: '🧽' }
    ];
  }

  private createCanvas() {
    const { width, height } = this.cameras.main;

    // Canvas dimensions - leave room for title, palette, and buttons
    const topMargin = 120; // Title space
    const bottomMargin = 180; // Palette + buttons
    const sideMargin = 20;

    const canvasWidth = width - (sideMargin * 2);
    const canvasHeight = height - topMargin - bottomMargin;
    const canvasX = sideMargin;
    const canvasY = topMargin;

    // Canvas background (white)
    this.canvasArea = this.add.rectangle(
      canvasX,
      canvasY,
      canvasWidth,
      canvasHeight,
      0xFFFFFF
    ).setOrigin(0);

    // Border
    const border = this.add.rectangle(
      canvasX,
      canvasY,
      canvasWidth,
      canvasHeight
    ).setOrigin(0);
    border.setStrokeStyle(6, 0x4A90E2);

    const guidelines = this.add.graphics();
    guidelines.lineStyle(1, 0xE0F7FA, 0.6);
    for (let y = canvasY + 60; y < canvasY + canvasHeight; y += 80) {
      guidelines.beginPath();
      guidelines.moveTo(canvasX + 20, y);
      guidelines.lineTo(canvasX + canvasWidth - 20, y);
      guidelines.strokePath();
    }
    for (let x = canvasX + 80; x < canvasX + canvasWidth; x += 120) {
      guidelines.beginPath();
      guidelines.moveTo(x, canvasY + 20);
      guidelines.lineTo(x, canvasY + canvasHeight - 20);
      guidelines.strokePath();
    }
    guidelines.setDepth(4);

    // Drawing graphics layer
    this.drawingGraphics = this.add.graphics();
    this.drawingGraphics.setDepth(10);

    // Template graphics layer (underneath drawing)
    this.template = this.add.graphics();
    this.template.setDepth(5);

    // Setup input
    this.input.on('pointerdown', this.startDrawing, this);
    this.input.on('pointermove', this.continueDrawing, this);
    this.input.on('pointerup', this.stopDrawing, this);
  }

  private startDrawing(pointer: Phaser.Input.Pointer) {
    if (!this.isInCanvas(pointer.x, pointer.y)) return;

    this.isDrawing = true;
    this.lastPoint = { x: pointer.x, y: pointer.y };

    audioService.play('tap');
    Haptics.impact({ style: ImpactStyle.Light });
    this.showHelperMessage('Great strokes! Keep your finger moving.');
  }

  private continueDrawing(pointer: Phaser.Input.Pointer) {
    if (!this.isDrawing || !this.lastPoint) return;
    if (!this.isInCanvas(pointer.x, pointer.y)) return;

    // Draw smooth line
    if (this.drawingGraphics) {
      this.drawingGraphics.lineStyle(
        this.currentTool.size,
        this.currentTool.color,
        1
      );
      this.drawingGraphics.beginPath();
      this.drawingGraphics.moveTo(this.lastPoint.x, this.lastPoint.y);
      this.drawingGraphics.lineTo(pointer.x, pointer.y);
      this.drawingGraphics.strokePath();
    }

    this.lastPoint = { x: pointer.x, y: pointer.y };

    // Light haptic feedback while drawing
    if (Math.random() > 0.8) {
      Haptics.impact({ style: ImpactStyle.Light });
    }
  }

  private stopDrawing() {
    if (this.isDrawing) {
      audioService.play('whoosh');
      Haptics.impact({ style: ImpactStyle.Light });
    }

    this.isDrawing = false;
    this.lastPoint = undefined;
    this.showHelperMessage('Nice lines! Add more colors or shapes.');
  }

  private isInCanvas(x: number, y: number): boolean {
    if (!this.canvasArea) return false;

    const bounds = this.canvasArea.getBounds();
    return (
      x >= bounds.x &&
      x <= bounds.x + bounds.width &&
      y >= bounds.y &&
      y <= bounds.y + bounds.height
    );
  }

  private createToolPalette() {
    const { width, height } = this.cameras.main;

    const paletteY = height - 140;
    const startX = 40;
    const buttonSize = 60;
    const gap = 10;

    // Calculate spacing to fit all tools
    const totalWidth = width - 80;
    const availableSpace = totalWidth / this.tools.length;
    const actualGap = Math.min(gap, (availableSpace - buttonSize) / 2);

    this.tools.forEach((tool, index) => {
      const x = startX + index * (buttonSize + actualGap);

      // Tool button background
      const button = this.add.circle(x, paletteY, buttonSize / 2, tool.color);
      button.setStrokeStyle(4, 0x263238);
      button.setInteractive({ useHandCursor: true });

      // Tool icon
      const icon = this.add.text(x, paletteY, tool.icon, {
        fontSize: '32px'
      }).setOrigin(0.5);

      // Selection indicator
      const indicator = this.add.circle(x, paletteY, (buttonSize / 2) + 6);
      indicator.setStrokeStyle(6, 0xFFD93D);
      indicator.setVisible(tool === this.currentTool);

      // Click handler
      button.on('pointerdown', () => {
        this.selectTool(tool);
        audioService.play('tap');
        Haptics.impact({ style: ImpactStyle.Medium });

        // Update indicators
        this.children.list.forEach((child) => {
          if (child.getData && child.getData('toolIndicator')) {
            const visibleChild = child as Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Visible;
            visibleChild.setVisible(false);
          }
        });
        indicator.setVisible(true);

        // Bounce animation
        this.tweens.add({
          targets: [button, icon],
          scale: { from: 1, to: 1.2 },
          duration: 200,
          yoyo: true,
          ease: 'Power2'
        });
      });

      indicator.setData('toolIndicator', true);
    });
  }

  private selectTool(tool: DrawingTool) {
    this.currentTool = tool;
  }

  private createActionButtons() {
    const { width, height } = this.cameras.main;

    const buttonY = height - 60;

    // Clear button
    const clearButton = this.add.rectangle(
      width / 2 - 140,
      buttonY,
      120,
      50,
      0xFF5252
    ).setInteractive({ useHandCursor: true });

    const clearText = this.add.text(
      width / 2 - 140,
      buttonY,
      '🧼 Clean',
      {
        fontSize: '20px',
        color: '#FFFFFF',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5);

    this.tweens.add({
      targets: clearText,
      scale: { from: 0.95, to: 1.05 },
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    clearButton.on('pointerdown', () => {
      this.clearCanvas();
      audioService.play('whoosh');
      Haptics.impact({ style: ImpactStyle.Heavy });
    });

    // Template button
    const templateButton = this.add.rectangle(
      width / 2,
      buttonY,
      160,
      50,
      0x4A90E2
    ).setInteractive({ useHandCursor: true });

    const templateText = this.add.text(
      width / 2,
      buttonY,
      '🚤 Trace',
      {
        fontSize: '20px',
        color: '#FFFFFF',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5);

    this.tweens.add({
      targets: templateText,
      scale: { from: 0.95, to: 1.05 },
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      delay: 120
    });

    templateButton.on('pointerdown', () => {
      this.currentTemplate = (this.currentTemplate + 1) % 5;
      this.showTemplate(this.currentTemplate);
      audioService.play('tap');
      Haptics.impact({ style: ImpactStyle.Medium });
      this.showHelperMessage('Trace the dotted lines to make a boat!');
    });

    // Save/Done button
    const doneButton = this.add.rectangle(
      width / 2 + 140,
      buttonY,
      120,
      50,
      0x4CAF50
    ).setInteractive({ useHandCursor: true });

    const doneText = this.add.text(
      width / 2 + 140,
      buttonY,
      '✓ Done',
      {
        fontSize: '20px',
        color: '#FFFFFF',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5);

    this.tweens.add({
      targets: doneText,
      scale: { from: 0.95, to: 1.05 },
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      delay: 240
    });

    doneButton.on('pointerdown', () => {
      this.saveDrawing();
      audioService.play('success');
      Haptics.impact({ style: ImpactStyle.Heavy });
      this.showHelperMessage('Beautiful art! Ready for another drawing?');
    });
  }

  private clearCanvas() {
    if (this.drawingGraphics) {
      this.drawingGraphics.clear();
    }
    this.showHelperMessage('Fresh canvas! Try tracing a boat or draw your own.');
  }

  private showTemplate(templateIndex: number) {
    if (!this.template || !this.canvasArea) return;

    this.template.clear();

    const bounds = this.canvasArea.getBounds();
    const centerX = bounds.x + bounds.width / 2;
    const centerY = bounds.y + bounds.height / 2;

    this.template.lineStyle(3, 0xCCCCCC, 0.5);

    switch (templateIndex) {
      case 0:
        // No template
        break;

      case 1:
        // Simple sailboat
        this.drawSailboatTemplate(centerX, centerY);
        break;

      case 2:
        // Fish
        this.drawFishTemplate(centerX, centerY);
        break;

      case 3:
        // Anchor
        this.drawAnchorTemplate(centerX, centerY);
        break;

      case 4:
        // Waves
        this.drawWavesTemplate(centerX, centerY);
        break;
    }
  }

  private drawSailboatTemplate(cx: number, cy: number) {
    if (!this.template) return;

    // Hull
    this.template.beginPath();
    this.template.moveTo(cx - 80, cy);
    this.template.lineTo(cx + 80, cy);
    this.template.lineTo(cx + 60, cy + 40);
    this.template.lineTo(cx - 60, cy + 40);
    this.template.closePath();
    this.template.strokePath();

    // Mast
    this.template.beginPath();
    this.template.moveTo(cx, cy);
    this.template.lineTo(cx, cy - 100);
    this.template.strokePath();

    // Sail
    this.template.beginPath();
    this.template.moveTo(cx, cy - 100);
    this.template.lineTo(cx + 60, cy - 50);
    this.template.lineTo(cx, cy);
    this.template.closePath();
    this.template.strokePath();
  }

  private drawFishTemplate(cx: number, cy: number) {
    if (!this.template) return;

    // Body (ellipse)
    this.template.strokeEllipse(cx, cy, 160, 100);

    // Tail
    this.template.beginPath();
    this.template.moveTo(cx - 80, cy);
    this.template.lineTo(cx - 120, cy - 30);
    this.template.lineTo(cx - 120, cy + 30);
    this.template.closePath();
    this.template.strokePath();

    // Eye
    this.template.strokeCircle(cx + 30, cy - 15, 10);
  }

  private drawAnchorTemplate(cx: number, cy: number) {
    if (!this.template) return;

    // Vertical line
    this.template.beginPath();
    this.template.moveTo(cx, cy - 60);
    this.template.lineTo(cx, cy + 40);
    this.template.strokePath();

    // Ring on top
    this.template.strokeCircle(cx, cy - 60, 15);

    // Arms
    this.template.beginPath();
    this.template.moveTo(cx - 50, cy + 20);
    this.template.lineTo(cx, cy + 40);
    this.template.lineTo(cx + 50, cy + 20);
    this.template.strokePath();

    // Hooks
    this.template.strokeCircle(cx - 50, cy + 20, 15);
    this.template.strokeCircle(cx + 50, cy + 20, 15);
  }

  private drawWavesTemplate(cx: number, cy: number) {
    if (!this.template) return;

    for (let i = 0; i < 3; i++) {
      const y = cy - 40 + i * 40;
      const path = new Phaser.Curves.Path(cx - 120, y);

      for (let x = -120; x < 120; x += 40) {
        path.cubicBezierTo(
          cx + x + 10, y - 15,
          cx + x + 30, y - 15,
          cx + x + 40, y
        );
      }

      path.draw(this.template);
    }
  }

  private saveDrawing() {
    // Increment drawing count
    progressService.incrementDrawingCount();

    // Show success message
    const { width, height } = this.cameras.main;

    const messageBg = this.add.rectangle(
      width / 2,
      height / 2,
      350,
      200,
      0xFFFFFF,
      0.95
    ).setDepth(100);

    const messageText = this.add.text(
      width / 2,
      height / 2 - 30,
      '🎨 Great Art! 🎨',
      {
        fontSize: '40px',
        color: '#4CAF50',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5).setDepth(100);

    const subText = this.add.text(
      width / 2,
      height / 2 + 20,
      'Keep creating!',
      {
        fontSize: '24px',
        color: '#263238'
      }
    ).setOrigin(0.5).setDepth(100);

    // Animate
    this.tweens.add({
      targets: [messageBg, messageText, subText],
      scale: { from: 0, to: 1 },
      duration: 400,
      ease: 'Back.easeOut'
    });

    // Auto-dismiss
    this.time.delayedCall(2000, () => {
      this.tweens.add({
        targets: [messageBg, messageText, subText],
        alpha: 0,
        scale: 0.8,
        duration: 300,
        onComplete: () => {
          messageBg.destroy();
          messageText.destroy();
          subText.destroy();

          // Clear canvas for next drawing
          this.clearCanvas();
        }
      });
    });
  }
}
