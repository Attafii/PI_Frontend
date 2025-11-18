import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './ModernNavbar.css';

const ModernNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    // Check authentication
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (token) {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        setIsAuthenticated(true);
        setUser(userData);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    checkAuth();

    // Listen for authentication changes
    const handleAuthChange = () => {
      checkAuth();
    };

    // Handle scroll
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    // Close profile menu when clicking outside
    const handleClickOutside = (event) => {
      if (showProfileMenu && !event.target.closest('.profile-wrapper')) {
        setShowProfileMenu(false);
      }
    };

    window.addEventListener('authChange', handleAuthChange);
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setUser(null);
    setShowProfileMenu(false);
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('authChange'));
    
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    if (user.role === 'freelance' || user.role === 'candidat') {
      return '/dashboard-freelance';
    } else if (user.role === 'client') {
      return '/dashboard-client';
    } else if (user.role === 'admin') {
      return '/admin-workspace';
    }
    return '/';
  };

  const navLinks = isAuthenticated
    ? [
        { path: '/', label: 'Accueil', icon: '🏠' },
        { path: getDashboardLink(), label: 'Mon Espace', icon: '📊' },
        { path: '/formations', label: 'Formations', icon: '📚' },
      ]
    : [
        { path: '/', label: 'Accueil', icon: '🏠' },
        { path: '/categories', label: 'Catégories', icon: '📂' },
        { path: '/comment-ca-marche', label: 'Comment ça marche', icon: '💡' },
        { path: '/fonctionnalites', label: 'Fonctionnalités', icon: '⚡' },
      ];

  return (
    <nav className={`modern-navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="logo-wrapper">
            <span className="logo-icon">💼</span>
            <span className="logo-text">FreelancePro</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-links desktop-only">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'nav-link-active' : ''}`}
            >
              <span className="nav-icon">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="navbar-actions desktop-only">
          {isAuthenticated ? (
            <div className="profile-wrapper">
              <button
                className="profile-button"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div className="profile-avatar">
                  {user?.photo ? (
                    <img src={user.photo} alt={user.nom} />
                  ) : (
                    <span>{user?.nom?.[0] || user?.email?.[0] || 'U'}</span>
                  )}
                </div>
                <span className="profile-name">{user?.nom || user?.prenom || 'Utilisateur'}</span>
                <svg className="profile-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="profile-menu"
                  >
                    <Link to="/profil" className="profile-menu-item" onClick={() => setShowProfileMenu(false)}>
                      <span className="menu-icon">👤</span>
                      <span>Mon Profil</span>
                    </Link>
                    <Link to={getDashboardLink()} className="profile-menu-item" onClick={() => setShowProfileMenu(false)}>
                      <span className="menu-icon">📊</span>
                      <span>Tableau de bord</span>
                    </Link>
                    <div className="profile-menu-divider"></div>
                    <button className="profile-menu-item logout-item" onClick={handleLogout}>
                      <span className="menu-icon">🚪</span>
                      <span>Déconnexion</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link to="/connexion" className="nav-button nav-button-secondary">
                Connexion
              </Link>
              <Link to="/inscription" className="nav-button nav-button-primary">
                Inscription
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-button mobile-only"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mobile-menu"
          >
            <div className="mobile-menu-content">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="mobile-menu-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="nav-icon">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}

              {isAuthenticated ? (
                <>
                  <div className="mobile-menu-divider"></div>
                  <Link
                    to="/profil"
                    className="mobile-menu-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="nav-icon">👤</span>
                    <span>Mon Profil</span>
                  </Link>
                  <button className="mobile-menu-link logout-link" onClick={handleLogout}>
                    <span className="nav-icon">🚪</span>
                    <span>Déconnexion</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="mobile-menu-divider"></div>
                  <Link
                    to="/connexion"
                    className="mobile-menu-button mobile-button-secondary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/inscription"
                    className="mobile-menu-button mobile-button-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Inscription
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default ModernNavbar;
