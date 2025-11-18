import Phaser from 'phaser';
import { audioService } from '../../services/audio';
import { progressService } from '../../services/progress';

interface Card {
  sprite: Phaser.GameObjects.Sprite;
  iconText: Phaser.GameObjects.Text;
  cardBack: Phaser.GameObjects.Sprite;
  icon: string;
  flipped: boolean;
  matched: boolean;
  gridX: number;
  gridY: number;
}

/**
 * Undersea themed memory match with animated sea life, gentle pacing, and
 * guiding narration that celebrates every successful pair toddlers uncover.
 */
export default class MemoryScene extends Phaser.Scene {
  private cards: Card[] = [];
  private flippedCards: Card[] = [];
  private canFlip = true;
  private matches = 0;
  private moves = 0;
  private totalPairs = 6;
  private difficulty: 'easy' | 'medium' | 'hard' = 'easy';
  private movesText?: Phaser.GameObjects.Text;
  private matchesText?: Phaser.GameObjects.Text;
  private helperText?: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'MemoryScene' });
  }

  preload() {
    // Create card graphics
    this.createCardGraphics();
  }

  /**
   * Layers light rays, bubbles, and a friendly turtle guide to make the
   * underwater play space feel warm and alive.
   */
  private createEnvironment(width: number, height: number) {
    // Layered gradient background for ocean scene
    this.add.rectangle(0, 0, width, height, 0x1E3D59).setOrigin(0);
    this.add.rectangle(0, 0, width, height * 0.55, 0x3F7CAC, 0.6).setOrigin(0);
    this.add.rectangle(0, height * 0.55, width, height * 0.45, 0x1B6CA8).setOrigin(0);

    // Light rays
    for (let i = 0; i < 4; i++) {
      const light = this.add.graphics({ x: width * (0.2 + i * 0.2), y: -50 });
      light.fillStyle(0xFFFFFF, 0.08);
      light.fillRect(-60, 0, 120, height);
      this.tweens.add({
        targets: light,
        alpha: { from: 0.05, to: 0.15 },
        duration: 2500 + i * 400,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }

    // Floating bubbles
    for (let i = 0; i < 12; i++) {
      const bubble = this.add.circle(
        Phaser.Math.Between(40, width - 40),
        height + Phaser.Math.Between(0, 200),
        Phaser.Math.Between(6, 12),
        0xFFFFFF,
        0.4
      );

      this.tweens.add({
        targets: bubble,
        y: -20,
        alpha: { from: 0.6, to: 0 },
        duration: Phaser.Math.Between(4000, 6000),
        repeat: -1,
        delay: i * 200,
        onRepeat: () => {
          bubble.x = Phaser.Math.Between(40, width - 40);
          bubble.y = height + Phaser.Math.Between(0, 200);
        }
      });
    }

    // Friendly turtle guide
    const turtleX = 110;
    const turtleY = height * 0.65;
    const turtleShell = this.add.ellipse(turtleX, turtleY, 140, 100, 0x8BC34A).setDepth(5);
    const shellPattern = this.add.graphics().setDepth(6);
    shellPattern.lineStyle(4, 0x558B2F, 1);
    shellPattern.strokeEllipse(turtleX, turtleY, 120, 84);
    shellPattern.strokeEllipse(turtleX, turtleY, 90, 60);
    const turtleHead = this.add.circle(turtleX + 80, turtleY - 10, 32, 0xA5D6A7).setDepth(6);
    const turtleEye = this.add.circle(turtleX + 92, turtleY - 18, 6, 0x263238).setDepth(7);
    const turtleFin = this.add.ellipse(turtleX - 50, turtleY + 18, 60, 26, 0xA5D6A7).setRotation(0.6).setDepth(5);

    this.tweens.add({
      targets: [turtleShell, shellPattern, turtleHead, turtleEye, turtleFin],
      y: turtleY + 12,
      duration: 2600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  create() {
    const { width, height } = this.cameras.main;

    this.createEnvironment(width, height);

    this.add.text(width / 2, 70, '🐠 Memory Match 🐠', {
      fontSize: '48px',
      color: '#FFFFFF',
      fontStyle: 'bold',
      stroke: '#1F3B4D',
      strokeThickness: 6,
      shadow: {
        offsetX: 0,
        offsetY: 6,
        blur: 12,
        color: '#1F3B4D',
        fill: true
      }
    }).setOrigin(0.5);

    // Create UI
    this.createUI();

    // Setup difficulty based on previous high score
    const progress = progressService.getProgress();
    if (progress && progress.memoryHighScore > 5) {
      this.difficulty = 'medium';
      this.totalPairs = 8;
    }
    if (progress && progress.memoryHighScore > 10) {
      this.difficulty = 'hard';
      this.totalPairs = 12;
    }

    // Create game board
    this.createCards();
  }

  private createCardGraphics() {
    const graphics = this.add.graphics({ x: 0, y: 0 });
    graphics.setVisible(false);

    // Card back (ocean blue with wave pattern)
    graphics.fillStyle(0x4A90E2, 1);
    graphics.fillRoundedRect(0, 0, 120, 140, 12);
    graphics.lineStyle(4, 0xFFFFFF, 0.8);
    graphics.strokeRoundedRect(0, 0, 120, 140, 12);
    graphics.fillStyle(0x70B7FF, 0.45);
    for (let y = 20; y < 130; y += 28) {
      graphics.fillRoundedRect(12, y, 96, 16, 8);
    }
    graphics.lineStyle(2, 0xFFFFFF, 0.6);
    for (let y = 30; y < 120; y += 28) {
      const wavePath = new Phaser.Curves.Path(18, y);
      wavePath.quadraticBezierTo(60, y + 10, 102, y);
      wavePath.draw(graphics);
    }
    graphics.generateTexture('card-back', 120, 140);
    graphics.clear();

    // Card front (white)
    graphics.fillStyle(0xFFFFFF, 1);
    graphics.fillRoundedRect(0, 0, 120, 140, 12);
    graphics.lineStyle(4, 0x4A90E2, 1);
    graphics.strokeRoundedRect(0, 0, 120, 140, 12);
    graphics.fillStyle(0xE0F7FA, 0.6);
    graphics.fillRoundedRect(8, 12, 104, 60, 10);
    graphics.fillStyle(0xB3E5FC, 0.3);
    graphics.fillRoundedRect(20, 86, 80, 32, 12);
    graphics.generateTexture('card-front', 120, 140);
    graphics.clear();

    // Create icon textures (using emojis/text)
    const icons = ['⛵', '🚤', '🛥️', '⚓', '🐟', '🐠', '🦈', '🐙', '🦀', '🐚', '⭐', '🌊'];

    icons.forEach((_emoji, index) => {
      graphics.fillStyle(0xFFFFFF, 1);
      graphics.fillRect(0, 0, 80, 80);
      graphics.generateTexture(`icon-${index}`, 80, 80);
      graphics.clear();
    });

    graphics.destroy();
  }

  private createUI() {
    const { width } = this.cameras.main;

    // Stats display
    const statsY = 140;

    this.movesText = this.add.text(
      width / 2 - 120,
      statsY,
      'Moves: 0',
      {
        fontSize: '28px',
        color: '#263238',
        fontStyle: 'bold',
        backgroundColor: '#FFFFFF',
        padding: { x: 16, y: 8 }
      }
    );

    this.matchesText = this.add.text(
      width / 2 + 120,
      statsY,
      `Matches: 0/${this.totalPairs}`,
      {
        fontSize: '28px',
        color: '#263238',
        fontStyle: 'bold',
        backgroundColor: '#FFFFFF',
        padding: { x: 16, y: 8 }
      }
    ).setOrigin(1, 0);

    this.helperText = this.add.text(
      width / 2,
      statsY + 70,
      'Peek and remember the sea friends!',
      {
        fontSize: '26px',
        color: '#FFFFFF',
        fontStyle: 'bold',
        backgroundColor: '#1F3B4D',
        padding: { x: 18, y: 10 }
      }
    ).setOrigin(0.5);

    this.showHelperMessage('Peek and remember the sea friends!');
  }

  /**
   * Sets and lightly animates the helper caption so instructions feel lively
   * rather than static.
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

  private createCards() {
    const { width, height } = this.cameras.main;

    // Determine grid size based on difficulty
    const gridConfig = {
      easy: { cols: 3, rows: 4 }, // 6 pairs (12 cards)
      medium: { cols: 4, rows: 4 }, // 8 pairs (16 cards)
      hard: { cols: 4, rows: 6 } // 12 pairs (24 cards)
    };

    const { cols, rows } = gridConfig[this.difficulty];
    const totalCards = this.totalPairs * 2;

    // Card dimensions
    const cardWidth = 120;
    const cardHeight = 140;
    const padding = 20;

    // Calculate grid dimensions
    const gridWidth = cols * cardWidth + (cols - 1) * padding;
    const gridHeight = rows * cardHeight + (rows - 1) * padding;

    // Center the grid, accounting for UI elements
    const uiTopSpace = 200; // Space for title and stats
    const availableHeight = height - uiTopSpace;

    const startX = (width - gridWidth) / 2 + cardWidth / 2;
    const startY = uiTopSpace + (availableHeight - gridHeight) / 2 + cardHeight / 2;

    // Create icon pairs
    const iconIndices: number[] = [];
    for (let i = 0; i < this.totalPairs; i++) {
      iconIndices.push(i, i); // Create pairs
    }

    // Shuffle
    Phaser.Utils.Array.Shuffle(iconIndices);

    // Create cards
    let cardIndex = 0;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (cardIndex >= totalCards) break;

        const x = startX + col * (cardWidth + padding);
        const y = startY + row * (cardHeight + padding);

        const iconIndex = iconIndices[cardIndex];
        this.createCard(x, y, iconIndex, col, row);

        cardIndex++;
      }
    }

    // Animate cards appearing
    this.cards.forEach((card, index) => {
      card.sprite.setScale(0);
      card.cardBack.setScale(0);

      this.tweens.add({
        targets: [card.sprite, card.cardBack],
        scale: 1,
        duration: 300,
        delay: index * 50,
        ease: 'Back.easeOut'
      });
    });

    // Show all cards briefly at start (memory preview)
    this.time.delayedCall(1000, () => {
      this.previewCards();
    });
  }

  private createCard(x: number, y: number, iconIndex: number, gridX: number, gridY: number) {
    // Card front (with icon)
    const cardFront = this.add.sprite(x, y, 'card-front');
    cardFront.setDisplaySize(120, 140);

    // Add emoji text on card
    const iconEmojis = ['⛵', '🚤', '🛥️', '⚓', '🐟', '🐠', '🦈', '🐙', '🦀', '🐚', '⭐', '🌊'];
    const iconText = this.add.text(x, y, iconEmojis[iconIndex], {
      fontSize: '64px'
    }).setOrigin(0.5);

    // Hide front face until the card is flipped
    iconText.setVisible(false);
    cardFront.setVisible(false);
    cardFront.setDepth(2);
    iconText.setDepth(3);

    // Card back
    const cardBack = this.add.sprite(x, y, 'card-back');
    cardBack.setDisplaySize(120, 140);
    cardBack.setInteractive({ useHandCursor: true });
    cardBack.setDepth(1);

    // Create card object
    const card: Card = {
      sprite: cardFront,
      iconText,
      cardBack,
      icon: iconEmojis[iconIndex],
      flipped: false,
      matched: false,
      gridX,
      gridY
    };

    // Click handler
    cardBack.on('pointerdown', () => {
      this.onCardClick(card);
    });

    this.cards.push(card);
  }

  private previewCards() {
    this.showHelperMessage('Peek time! Remember the sea friends.');
    this.canFlip = false;

    // Flip all cards face up
    this.cards.forEach((card) => {
      this.flipCard(card, true, false);
    });

    // Flip back after 2 seconds
    this.time.delayedCall(2000, () => {
      this.cards.forEach((card) => {
        this.flipCard(card, false, false);
      });
      this.canFlip = true;
      this.showHelperMessage('Tap a card to find a matching friend.');
    });
  }

  private onCardClick(card: Card) {
    if (!this.canFlip || card.flipped || card.matched) return;

    audioService.play('tap');

    // Flip card
    this.flipCard(card, true, true);
    card.flipped = true;
    this.flippedCards.push(card);

    if (this.flippedCards.length === 1) {
      this.showHelperMessage(`Can you find another ${card.icon}?`);
    } else {
      this.showHelperMessage('Do these buddies match? Let\'s see!');
    }

    // Check for match
    if (this.flippedCards.length === 2) {
      this.canFlip = false;
      this.moves++;
      this.updateUI();

      this.time.delayedCall(800, () => {
        this.checkMatch();
      });
    }
  }

  private flipCard(card: Card, faceUp: boolean, playSound: boolean) {
    if (playSound) {
      audioService.play('whoosh');
    }

    const hideTargets = faceUp
      ? [card.cardBack]
      : [card.sprite, card.iconText];

    const showTargets = faceUp
      ? [card.sprite, card.iconText]
      : [card.cardBack];

    const filteredHideTargets = hideTargets.filter(Boolean) as Phaser.GameObjects.GameObject[];
    const filteredShowTargets = showTargets.filter(Boolean) as Phaser.GameObjects.GameObject[];

    if (filteredHideTargets.length === 0 && filteredShowTargets.length === 0) {
      return;
    }

    const hideTransforms = filteredHideTargets as any[];
    const showTransforms = filteredShowTargets as any[];

    const playShowTween = () => {
      if (showTransforms.length === 0) {
        return;
      }

      this.tweens.add({
        targets: showTransforms,
        scaleX: 1,
        duration: 150,
        ease: 'Power2'
      });
    };

    if (hideTransforms.length > 0) {
      this.tweens.add({
        targets: hideTransforms,
        scaleX: 0,
        duration: 150,
        ease: 'Power2',
        onComplete: () => {
          hideTransforms.forEach((target) => {
            target.setVisible(false);
            target.scaleX = 1;
            target.scaleY = 1;
          });

          showTransforms.forEach((target) => {
            target.setVisible(true);
            target.scaleX = 0;
            target.scaleY = 1;
          });

          playShowTween();
        }
      });
    } else {
      showTransforms.forEach((target) => {
        target.setVisible(true);
        target.scaleX = 0;
        target.scaleY = 1;
      });
      playShowTween();
    }
  }

  private checkMatch() {
    const [card1, card2] = this.flippedCards;

    if (card1.icon === card2.icon) {
      // Match!
      audioService.play('success');
      audioService.play('ding');

      card1.matched = true;
      card2.matched = true;
      this.matches++;

      this.showHelperMessage(`Yay! The ${card1.icon} friends found each other!`);

      // Celebrate matched cards
      this.tweens.add({
        targets: [card1.sprite, card1.iconText, card2.sprite, card2.iconText],
        scale: 1.2,
        duration: 200,
        yoyo: true,
        ease: 'Power2'
      });

      // Add sparkles
      this.createSparkle(card1.sprite.x, card1.sprite.y);
      this.createSparkle(card2.sprite.x, card2.sprite.y);

      this.flippedCards = [];
      this.canFlip = true;

      this.updateUI();

      // Check for game complete
      if (this.matches === this.totalPairs) {
        this.completeGame();
      }
    } else {
      // No match
      audioService.play('tap');

      // Flip back
      this.time.delayedCall(400, () => {
        this.flipCard(card1, false, true);
        this.flipCard(card2, false, true);

        card1.flipped = false;
        card2.flipped = false;
        this.flippedCards = [];
        this.canFlip = true;
        this.showHelperMessage('Not a match yet. Try another pair!');
      });
    }
  }

  private createSparkle(x: number, y: number) {
    const sparkle = this.add.circle(x, y, 40, 0xFFD93D, 1);
    this.tweens.add({
      targets: sparkle,
      scale: 2,
      alpha: 0,
      duration: 600,
      ease: 'Power2',
      onComplete: () => sparkle.destroy()
    });
  }

  private updateUI() {
    if (this.movesText) {
      this.movesText.setText(`Moves: ${this.moves}`);
    }
    if (this.matchesText) {
      this.matchesText.setText(`Matches: ${this.matches}/${this.totalPairs}`);
    }
  }

  private completeGame() {
    audioService.play('cheer');
    this.showHelperMessage('Amazing memory! Tap play again to swim more.');

    // Calculate score (fewer moves = higher score)
    const score = Math.max(0, this.totalPairs * 3 - this.moves);
    progressService.updateMemoryScore(score);

    // Show completion message
    const { width, height } = this.cameras.main;

    const successBg = this.add.rectangle(
      width / 2,
      height / 2,
      400,
      300,
      0xFFFFFF,
      0.95
    ).setDepth(200);

    const successText = this.add.text(
      width / 2,
      height / 2 - 60,
      '🎉 Amazing! 🎉',
      {
        fontSize: '48px',
        color: '#4CAF50',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5).setDepth(200);

    const scoreText = this.add.text(
      width / 2,
      height / 2,
      `Score: ${score}\nMoves: ${this.moves}`,
      {
        fontSize: '32px',
        color: '#263238',
        fontStyle: 'bold',
        align: 'center'
      }
    ).setOrigin(0.5).setDepth(200);

    // Play again button
    const againButton = this.add.rectangle(
      width / 2,
      height / 2 + 80,
      200,
      70,
      0x4A90E2
    ).setInteractive().setDepth(200);

    const againText = this.add.text(
      width / 2,
      height / 2 + 80,
      'Play Again!',
      {
        fontSize: '28px',
        color: '#FFFFFF',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5).setDepth(200);

    againButton.on('pointerdown', () => {
      audioService.play('tap');
      this.scene.restart();
    });

    // Animate
    this.tweens.add({
      targets: [successBg, successText, scoreText, againButton, againText],
      scale: { from: 0, to: 1 },
      duration: 400,
      ease: 'Back.easeOut'
    });
  }
}
