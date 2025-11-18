import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import LoginPage from './components/Authentication/Connexion/LoginPage';
import ModernLoginPage from './components/Authentication/Connexion/ModernLoginPage';
import RegisterPage from './components/Authentication/Inscription/RegisterPage';
import ModernRegisterPage from './components/Authentication/Inscription/ModernRegisterPage';
import HomeComponent from './components/EspacePublique/Home/HomeComponent';
import ModernLandingPage from './components/EspacePublique/Home/ModernLandingPage';
import CategoriesPage from './components/EspacePublique/Categories/CategoriesPage';
import HowItWorksPage from './components/EspacePublique/HowItWorks/HowItWorksPage';
import FeaturesPage from './components/EspacePublique/Features/FeaturesPage';
import FooterComponent from './components/Footer/FooterComponent';
import ForgetPwdPage from './components/Authentication/ForgetPwd/ForgetPwdPage';
import SidebarComponent from './components/EspaceAdmin/sidebarComponent';
import NavbarComponent from './components/Navbar/NavbarComponent';
import ModernNavbar from './components/Navbar/ModernNavbar';
import FormationsComponent from './components/EspacePublique/Formations/FormationsComponent';
import FormationDetailComponent from './components/EspacePublique/Formations/FormationDetailComponent';
import SkeletonList from './components/Profil/skeletonList';
import ProfilePage from './components/Profil/ProfilePage';
import StatisticsComponent from './components/EspaceAdmin/statistics/StatisticsComponent';
import HomeAdmin from './components/EspaceAdmin/HomeAdmin';
import ReadCategoryComponent from './components/EspaceAdmin/crudCategorie/ReadCategoryComponent';
import BienvenueDocument from './components/EspaceAdmin/BienvenuDocument';
import HomeCandidatComponent from './components/EspaceCandidat/HomeCandidatComponent';
import HomeFormateurComponent from './components/EspaceFormateur/HomeFormateurComponent';
import DashboardClient from './components/Dashboards/DashboardClient';
import DashboardFreelance from './components/Dashboards/DashboardFreelance';
import EnhancedDashboardClient from './components/Dashboards/EnhancedDashboardClient';
import EnhancedDashboardFreelance from './components/Dashboards/EnhancedDashboardFreelance';

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
         {isAdminWorkspace ? <BienvenueDocument /> : <header style={{ position: 'fixed', top: 0, width: '100%', zIndex: 100 }}><ModernNavbar /></header>}
         
      <div className="container">
        <Routes>
          <Route exact path="/" element={<ModernLandingPage />} />
          <Route path="/home-old" element={<HomeComponent />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/comment-ca-marche" element={<HowItWorksPage />} />
          <Route path="/fonctionnalites" element={<FeaturesPage />} />
          <Route path='/profil' element={<ProfilePage />} />
          <Route path='/skeleton' element={<SkeletonList />} />
          <Route path='/candidat' element={<HomeCandidatComponent />} />
          <Route path='/formateur' element={<HomeFormateurComponent />} />
          <Route path='/dashboard' element={<StatisticsComponent />} />
          <Route path="/connexion" element={<ModernLoginPage />} />
          <Route path="/signin" element={<ModernLoginPage />} />
          <Route path="/login-old" element={<LoginPage />} />
          <Route path="/inscription" element={<ModernRegisterPage />} />
          <Route path="/signup" element={<ModernRegisterPage />} />
          <Route path="/register-old" element={<RegisterPage />} />
          <Route path='/forgot-password' element={<ForgetPwdPage />} />
          <Route path="/formations" element={<FormationsComponent />} />
          <Route path="/accueil/:id" element={<FormationsComponent />} />
          <Route path="/gestionCategories" element={<ReadCategoryComponent />} />
          <Route path="/formations/:id" element={<FormationDetailComponent />} />
          <Route path="/dashboard-client" element={<EnhancedDashboardClient />} />
          <Route path="/dashboard-client-old" element={<DashboardClient />} />
          <Route path="/dashboard-freelance" element={<EnhancedDashboardFreelance />} />
          <Route path="/dashboard-freelance-old" element={<DashboardFreelance />} />
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
