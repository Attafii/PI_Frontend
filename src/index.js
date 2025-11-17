import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Translation imports
import global_fr from "./translations/fr/global.json";
import global_en from "./translations/en/global.json";
import global_ar from "./translations/ar/global.json";
import i18next from "i18next";
import { I18nextProvider } from 'react-i18next';

// Redux imports
import { Provider } from 'react-redux';
import store from './components/Authentication/Connexion/store'; // Import the Redux store

// i18n initialization
const savedLanguage = localStorage.getItem("i18nextLng") || "fr"; // Charger la langue sauvegardée
i18next.init({
  interpolation: { escapeValue: false },
  lng: savedLanguage, // Utiliser la langue sauvegardée
  fallbackLng: "fr", // Langue de secours
  resources: {
    en: { global: global_en },
    fr: { global: global_fr },
    ar: { global: global_ar },
  },
});

// Render application
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Redux Provider */}
    <Provider store={store}>
      {/* i18n Provider */}
      <I18nextProvider i18n={i18next}>
        <App />
      </I18nextProvider>
    </Provider>
  </React.StrictMode>
);

// Measuring performance
reportWebVitals();
