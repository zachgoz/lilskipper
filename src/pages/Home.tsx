import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonButton, IonIcon } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { construct, fish, colorPalette, settings } from 'ionicons/icons';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import ParentalGate from '../components/ParentalGate';
import { audioService } from '../services/audio';
import { progressService } from '../services/progress';
import './Home.css';

/**
 * Landing page that welcomes toddlers with animated buttons and routes them
 * into the three mini-games while surfacing their collected stars.
 */
const Home: React.FC = () => {
  const history = useHistory();
  const [showParentalGate, setShowParentalGate] = useState(false);
  const [totalStars, setTotalStars] = useState(0);
  const [animateButtons, setAnimateButtons] = useState(false);

  useEffect(() => {
    // Load progress
    const progress = progressService.getProgress();
    if (progress) {
      setTotalStars(progress.totalStars);
    }

    // Play background music
    audioService.playBackgroundMusic();

    // Animate buttons on mount
    setTimeout(() => setAnimateButtons(true), 100);
  }, []);

  const handleGameSelect = (gameType: string) => {
    Haptics.impact({ style: ImpactStyle.Light });
    audioService.play('tap');

    // Add bounce animation
    const button = document.querySelector(`[data-game="${gameType}"]`);
    button?.classList.add('button-bounce');

    setTimeout(() => {
      history.push(`/game/${gameType}`);
    }, 200);
  };

  const handleSettingsClick = () => {
    Haptics.impact({ style: ImpactStyle.Light });
    audioService.play('tap');
    setShowParentalGate(true);
  };

  const handleParentalSuccess = () => {
    setShowParentalGate(false);
    // Navigate to settings page (to be implemented)
    // For now, just close the gate
  };

  return (
    <IonPage>
      <IonContent fullscreen className="home-content">
        <div className="home-container">
          {/* Header */}
          <div className="home-header">
            <h1 className="app-title animate-float">
              ⛵ Little Skipper
            </h1>
            <p className="app-subtitle">Learn with Boats!</p>

            <div className="stars-display">
              ⭐ {totalStars} Stars
            </div>
          </div>

          {/* Menu Buttons */}
          <div className="menu-buttons">
            <IonButton
              className={`menu-button build-boat-button ${animateButtons ? 'animate-bounce-in' : ''}`}
              data-game="build-boat"
              expand="block"
              onClick={() => handleGameSelect('build-boat')}
              style={{ animationDelay: '0.1s' }}
            >
              <IonIcon icon={construct} slot="start" />
              Build a Boat
            </IonButton>

            <IonButton
              className={`menu-button memory-button ${animateButtons ? 'animate-bounce-in' : ''}`}
              data-game="memory"
              expand="block"
              color="secondary"
              onClick={() => handleGameSelect('memory')}
              style={{ animationDelay: '0.2s' }}
            >
              <IonIcon icon={fish} slot="start" />
              Memory Game
            </IonButton>

            <IonButton
              className={`menu-button drawing-button ${animateButtons ? 'animate-bounce-in' : ''}`}
              data-game="drawing"
              expand="block"
              color="success"
              onClick={() => handleGameSelect('drawing')}
              style={{ animationDelay: '0.3s' }}
            >
              <IonIcon icon={colorPalette} slot="start" />
              Draw & Color
            </IonButton>
          </div>

          {/* Settings Button */}
          <IonButton
            className="settings-button"
            fill="clear"
            onClick={handleSettingsClick}
          >
            <IonIcon icon={settings} />
          </IonButton>

          {/* Decorative elements */}
          <div className="wave-decoration wave-1"></div>
          <div className="wave-decoration wave-2"></div>
        </div>

        {/* Parental Gate */}
        <ParentalGate
          isOpen={showParentalGate}
          onClose={() => setShowParentalGate(false)}
          onSuccess={handleParentalSuccess}
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;
