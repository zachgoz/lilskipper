import localforage from 'localforage';

export interface BoatLevel {
  id: number;
  name: string;
  boatType: 'kayak' | 'sailboat' | 'cargo' | 'yacht' | 'trawler' | 'speedboat' | 'tugboat' | 'ferry' | 'submarine' | 'canoe';
  stars: number; // 0-3
  completed: boolean;
  unlocked: boolean;
}

export interface GameProgress {
  boatLevels: BoatLevel[];
  memoryHighScore: number;
  drawingCount: number;
  totalStars: number;
  stickersUnlocked: string[];
  lastPlayed: string;
}

/**
 * Handles saving and loading toddler progress so rewards and unlocked boats
 * persist between play sessions without requiring any account setup.
 */
class ProgressService {
  private progress: GameProgress | null = null;
  private initialized = false;

  async initialize() {
    if (this.initialized) return;

    // Configure localforage
    localforage.config({
      name: 'LittleSkipper',
      storeName: 'progress',
      description: 'Game progress and achievements'
    });

    // Load existing progress or create new
    const saved = await localforage.getItem<GameProgress>('gameProgress');

    if (saved) {
      this.progress = saved;
    } else {
      // Initialize new progress
      this.progress = {
        boatLevels: this.createInitialLevels(),
        memoryHighScore: 0,
        drawingCount: 0,
        totalStars: 0,
        stickersUnlocked: [],
        lastPlayed: new Date().toISOString()
      };
      await this.save();
    }

    this.initialized = true;
  }

  private createInitialLevels(): BoatLevel[] {
    const boatTypes: BoatLevel['boatType'][] = [
      'kayak',
      'sailboat',
      'canoe',
      'speedboat',
      'yacht',
      'tugboat',
      'ferry',
      'trawler',
      'cargo',
      'submarine'
    ];

    return boatTypes.map((type, index) => ({
      id: index + 1,
      name: this.getBoatName(type),
      boatType: type,
      stars: 0,
      completed: false,
      unlocked: index === 0 // Only first level unlocked
    }));
  }

  private getBoatName(type: BoatLevel['boatType']): string {
    const names: Record<BoatLevel['boatType'], string> = {
      kayak: 'Little Kayak',
      sailboat: 'Sunny Sailboat',
      canoe: 'Cozy Canoe',
      speedboat: 'Speedy Boat',
      yacht: 'Fancy Yacht',
      tugboat: 'Tough Tugboat',
      ferry: 'Fun Ferry',
      trawler: 'Fishing Trawler',
      cargo: 'Big Cargo Ship',
      submarine: 'Deep Submarine'
    };
    return names[type];
  }

  async save() {
    if (!this.progress) return;
    this.progress.lastPlayed = new Date().toISOString();
    await localforage.setItem('gameProgress', this.progress);
  }

  getProgress(): GameProgress | null {
    return this.progress;
  }

  getBoatLevels(): BoatLevel[] {
    return this.progress?.boatLevels || [];
  }

  getBoatLevel(id: number): BoatLevel | undefined {
    return this.progress?.boatLevels.find(level => level.id === id);
  }

  async completeBoatLevel(levelId: number, stars: number) {
    if (!this.progress) return;

    const level = this.progress.boatLevels.find(l => l.id === levelId);
    if (!level) return;

    const oldStars = level.stars;
    level.completed = true;
    level.stars = Math.max(level.stars, stars); // Keep best score

    // Update total stars
    const starDiff = level.stars - oldStars;
    this.progress.totalStars += starDiff;

    // Unlock next level
    const nextLevel = this.progress.boatLevels.find(l => l.id === levelId + 1);
    if (nextLevel) {
      nextLevel.unlocked = true;
    }

    // Award stickers based on stars
    if (stars === 3 && !this.progress.stickersUnlocked.includes(`boat_${levelId}`)) {
      this.progress.stickersUnlocked.push(`boat_${levelId}`);
    }

    await this.save();
  }

  async updateMemoryScore(score: number) {
    if (!this.progress) return;

    if (score > this.progress.memoryHighScore) {
      this.progress.memoryHighScore = score;

      // Award sticker for high scores
      if (score >= 10 && !this.progress.stickersUnlocked.includes('memory_master')) {
        this.progress.stickersUnlocked.push('memory_master');
      }
    }

    await this.save();
  }

  async incrementDrawingCount() {
    if (!this.progress) return;

    this.progress.drawingCount++;

    // Award stickers for drawing milestones
    if (this.progress.drawingCount === 5 && !this.progress.stickersUnlocked.includes('artist_5')) {
      this.progress.stickersUnlocked.push('artist_5');
    }
    if (this.progress.drawingCount === 20 && !this.progress.stickersUnlocked.includes('artist_20')) {
      this.progress.stickersUnlocked.push('artist_20');
    }

    await this.save();
  }

  getStickers(): string[] {
    return this.progress?.stickersUnlocked || [];
  }

  getTotalStars(): number {
    return this.progress?.totalStars || 0;
  }

  async resetProgress() {
    this.progress = {
      boatLevels: this.createInitialLevels(),
      memoryHighScore: 0,
      drawingCount: 0,
      totalStars: 0,
      stickersUnlocked: [],
      lastPlayed: new Date().toISOString()
    };
    await this.save();
  }
}

export const progressService = new ProgressService();
