import Phaser from 'phaser';
import BuildBoatScene from './scenes/BuildBoatScene';
import MemoryScene from './scenes/MemoryScene';
import DrawingScene from './scenes/DrawingScene';

/**
 * Builds a Phaser game configuration tailored to the requested mini-game.
 * The config locks the game to the supplied DOM parent so each Ionic view
 * can mount and unmount cleanly without orphaned canvases.
 */
export const createGameConfig = (
  parent: string | HTMLElement,
  gameType: 'build-boat' | 'memory' | 'drawing'
): Phaser.Types.Core.GameConfig => {
  const sceneMap = {
    'build-boat': BuildBoatScene,
    'memory': MemoryScene,
    'drawing': DrawingScene
  };

  return {
    type: Phaser.CANVAS, // Use Canvas instead of WebGL for better compatibility
    parent,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#B3E5FC',
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: window.innerWidth,
      height: window.innerHeight
    },
    physics: {
      default: 'arcade',
      arcade: {
        debug: false,
        gravity: { x: 0, y: 0 }
      }
    },
    scene: sceneMap[gameType],
    audio: {
      disableWebAudio: false
    },
    input: {
      activePointers: 3 // Support multi-touch for toddlers
    },
    render: {
      pixelArt: false,
      antialias: true,
      roundPixels: true
    }
  };
};
