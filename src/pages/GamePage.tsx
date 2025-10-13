import React, { useEffect, useRef, useState } from 'react';
import { IonContent, IonPage, IonButton, IonIcon, useIonViewDidEnter, useIonViewDidLeave } from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import { arrowBack } from 'ionicons/icons';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import Phaser from 'phaser';
import { createGameConfig } from '../game/config';
import { audioService } from '../services/audio';
import './GamePage.css';

interface GameParams {
  gameType: 'build-boat' | 'memory' | 'drawing';
}

/**
 * Hosts a Phaser scene inside an Ionic page. The page lifecycle is used to
 * tear down and rebuild the game when navigating away or returning so that
 * toddlers always land on a fresh, interactive canvas.
 */
const GamePage: React.FC = () => {
  const { gameType } = useParams<GameParams>();
  const history = useHistory();
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  /**
   * Dispose of the active Phaser instance and remove any DOM content so the
   * next game mount starts from a clean container.
   */
  const cleanupGame = () => {
    if (gameRef.current) {
      gameRef.current.destroy(true);
      gameRef.current = null;
    }

    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }
  };

  /**
   * Lazily create a new Phaser game using the shared configuration factory
   * when the page is active and the container element is ready.
   */
  const initializeGame = () => {
    if (!containerRef.current || gameRef.current) {
      return;
    }

    const config = createGameConfig(containerRef.current, gameType);
    gameRef.current = new Phaser.Game(config);
  };

  useIonViewDidEnter(() => {
    setIsActive(true);
  });

  useIonViewDidLeave(() => {
    setIsActive(false);
  });

  useEffect(() => {
    if (!isActive || !containerRef.current) {
      return;
    }

    initializeGame();

    return () => cleanupGame();
  }, [gameType, isActive]);

  const handleBack = () => {
    Haptics.impact({ style: ImpactStyle.Light });
    audioService.play('tap');

    // Destroy game before navigating
    cleanupGame();
    history.push('/home');
  };

  return (
    <IonPage>
      <IonContent fullscreen className="game-page-content">
        <div className="game-page-container">
          {/* Back Button */}
          <IonButton
            className="game-back-button"
            onClick={handleBack}
            fill="clear"
            color="light"
          >
            <IonIcon icon={arrowBack} slot="icon-only" />
          </IonButton>

          {/* Game Container */}
          <div
            id="game-container"
            ref={containerRef}
            className="phaser-game-container"
          />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default GamePage;
