import React, { useEffect } from 'react';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';

// Capacitor
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';

// Pages
import Home from './pages/Home';
import GamePage from './pages/GamePage';

// Services
import { audioService } from './services/audio';
import { progressService } from './services/progress';

/**
 * Root Ionic application shell. Sets up global services, native UI chrome,
 * and routes between the home menu and the individual Phaser game screens.
 */
const App: React.FC = () => {
  useEffect(() => {
    const initializeApp = async () => {
      // Initialize services
      await audioService.initialize();
      await progressService.initialize();

      // Configure status bar
      try {
        await StatusBar.setStyle({ style: Style.Light });
        await StatusBar.setBackgroundColor({ color: '#4A90E2' });
      } catch (e) {
        console.log('StatusBar not available');
      }

      // Hide splash screen
      setTimeout(async () => {
        await SplashScreen.hide();
      }, 1500);
    };

    initializeApp();
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/home">
            <Home />
          </Route>
          <Route exact path="/game/:gameType">
            <GamePage />
          </Route>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
