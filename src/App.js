import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import LoginPage from './components/Authentication/Connexion/LoginPage';
import RegisterPage from './components/Authentication/Inscription/RegisterPage';
import HomeComponent from './components/EspacePublique/Home/HomeComponent';
import FooterComponent from './components/Footer/FooterComponent';
import ForgetPwdPage from './components/Authentication/ForgetPwd/ForgetPwdPage';
import SidebarComponent from './components/EspaceAdmin/sidebarComponent';
import NavbarComponent from './components/Navbar/NavbarComponent';
import FormationsComponent from './components/EspacePublique/Formations/FormationsComponent';
import FormationDetailComponent from './components/EspacePublique/Formations/FormationDetailComponent';
import SkeletonList from './components/Profil/skeletonList';
import StatisticsComponent from './components/EspaceAdmin/statistics/StatisticsComponent';
import HomeAdmin from './components/EspaceAdmin/HomeAdmin';
import ReadCategoryComponent from './components/EspaceAdmin/crudCategorie/ReadCategoryComponent';
import BienvenueDocument from './components/EspaceAdmin/BienvenuDocument';
import HomeCandidatComponent from './components/EspaceCandidat/HomeCandidatComponent';
import HomeFormateurComponent from './components/EspaceFormateur/HomeFormateurComponent';

function AppLayout() {
  const location = useLocation();

  // Vérifie si l'utilisateur est sous la route `/admin-workspace`
  const isAdminWorkspace = location.pathname === '/admin-workspace';

  return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh', // Hauteur totale de la fenêtre
        }}
    >
      {/* Header fixe */}
     

      {/* Contenu principal scrollable */}
      <main>
         {isAdminWorkspace ? <BienvenueDocument /> : <header style={{ position: 'fixed', top: 0, width: '100%', zIndex: 100 }}><NavbarComponent /></header>}
         
      <div className="container">
        <Routes>
          <Route exact path="/" element={<HomeComponent />} />
          <Route path='/profil' element={<SkeletonList />} />
          <Route path='/candidat' element={<HomeCandidatComponent />} />
          <Route path='/formateur' element={<HomeFormateurComponent />} />
          <Route path='/dashboard' element={<StatisticsComponent />} />
          <Route path="/signin" element={<LoginPage />} />
          <Route path="/signup" element={<RegisterPage />} />
          <Route path='/forgot-password' element={<ForgetPwdPage />} />
          <Route path="/formations" element={<FormationsComponent />} />
          <Route path="/accueil/:id" element={<FormationsComponent />} />
          <Route path="/gestionCategories" element={<ReadCategoryComponent />} />
          <Route path="/formations/:id" element={<FormationDetailComponent />} />
          {/* Ajoutez une route pour admin-workspace si nécessaire */}
          {/* <Route path="/admin-workspace" element={<div>Admin Workspace</div>} /> */}
        </Routes>
      </div>
      
      {/* Affiche le Footer sauf si sous /admin-workspace */}
      {!isAdminWorkspace && <FooterComponent />}
      </main>

      {/* Footer fixe */}
      <footer>
        {/* <FooterComponent /> */}
      </footer>
    </div>


  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
