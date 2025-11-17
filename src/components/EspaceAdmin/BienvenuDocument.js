import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SidebarComponent from './sidebarComponent';
import StatisticsComponent from './statistics/StatisticsComponent';
import HomeCategComponent from './crudCategorie/HomeCategComponent';
import HomeFormateurComponent from './crudFormateur/HomeFormateurComponent';
import HomeCandidatComponent from './crudCandidat/HomeCandidatComponent';
import HomeFormationComponent from './crudFormation/HomeFormationComponent';
import LoginPage from '../Authentication/Connexion/LoginPage';
import HomeComponent from '../EspacePublique/Home/HomeComponent';
import HomeTagComponent from './crudTags/HomeTagComponent';
import HomeSessionComponent from './crudSessions/HomeSessionComponent';

const BienvenueDocument = () => {
  const { t, i18n } = useTranslation();
  const [selectedContent, setSelectedContent] = useState(<StatisticsComponent />);

  const handleSelectMenu = (key) => {
    switch (key) {
      case "dashboard":
        setSelectedContent(<StatisticsComponent />);
        break;
      case "candidates":
        setSelectedContent(<HomeCandidatComponent />);
        break;
      case "trainers":
        setSelectedContent(<HomeFormateurComponent />);
        break;
      case "formations":
        setSelectedContent(<HomeFormationComponent />);
        break;
      case "categories":
        setSelectedContent(<HomeCategComponent />);
        break;
      case "tags":
        setSelectedContent(<HomeTagComponent />);
        break;
      case "sessions":
        setSelectedContent(<HomeSessionComponent />);
        break;
      case "logout":
        // Implémentez la logique de déconnexion ici
        console.log("Déconnexion");
        setSelectedContent(<HomeComponent />);
        break;
      default:
        setSelectedContent(<StatisticsComponent />);
        break;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Barre latérale */}
      <SidebarComponent onSelectMenu={handleSelectMenu} />

      {/* Contenu dynamique */}
      <div style={{ flex: 1, padding: '20px', backgroundColor: '#f0f2f5' }}>
        {selectedContent}
      </div>
    </div>
  );
};

export default BienvenueDocument;
