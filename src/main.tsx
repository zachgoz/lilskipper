import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Ionic & Capacitor
import { setupIonicReact } from '@ionic/react';
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import './theme/variables.css';
import './theme/global.css';

// Setup Ionic
setupIonicReact({
  mode: 'ios', // Consistent UI across platforms, toddler-friendly
  hardwareBackButton: true,
  swipeBackEnabled: false // Prevent accidental swipes
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
