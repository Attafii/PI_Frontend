import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import './ModernAuth.css';

const ModernLoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    
    if (!formData.password) {
      newErrors.password = 'Mot de passe requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Minimum 6 caractères';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8001/api/login', {
        email: formData.email,
        mdp: formData.password
      });

      const { user, token } = response.data;

      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('user', JSON.stringify(user));

      // Dispatch custom event to notify navbar of authentication change
      window.dispatchEvent(new Event('authChange'));

      setAlert({ type: 'success', message: 'Connexion réussie !' });
      
      // Redirect based on role
      setTimeout(() => {
        if (user.role === 'freelance' || user.role === 'candidat') {
          navigate('/dashboard-freelance');
        } else if (user.role === 'client') {
          navigate('/dashboard-client');
        } else if (user.role === 'admin') {
          navigate('/admin-workspace');
        } else {
          navigate('/');
        }
      }, 1000);

    } catch (error) {
      console.error('Login error:', error);
      setAlert({ 
        type: 'error', 
        message: error.response?.data?.message || 'Email ou mot de passe incorrect' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modern-auth-container">
      <div className="auth-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="auth-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="auth-card"
        >
          {/* Logo/Brand */}
          <div className="auth-header">
            <div className="auth-logo">
              <div className="logo-icon">💼</div>
            </div>
            <h1 className="auth-title">Bon retour parmi nous !</h1>
            <p className="auth-subtitle">Connectez-vous pour gérer vos projets freelance</p>
          </div>

          {/* Alert */}
          {alert && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`auth-alert auth-alert-${alert.type}`}
            >
              <span className="alert-icon">
                {alert.type === 'success' ? '✓' : '✕'}
              </span>
              <span>{alert.message}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Adresse email
              </label>
              <div className="input-wrapper">
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input ${errors.email ? 'input-error' : ''}`}
                  placeholder="exemple@email.com"
                />
              </div>
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Mot de passe
              </label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-input ${errors.password ? 'input-error' : ''}`}
                  placeholder="Entrez votre mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>Se souvenir de moi</span>
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Mot de passe oublié ?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="submit-button"
            >
              {loading ? (
                <span className="loading-spinner"></span>
              ) : (
                <>
                  <span>Se connecter</span>
                  <svg className="button-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <span>ou</span>
          </div>

          {/* Social Login (Optional - can be enabled later) */}
          <div className="social-buttons">
            <button type="button" className="social-button">
              <span className="social-icon">G</span>
              <span>Google</span>
            </button>
            <button type="button" className="social-button">
              <span className="social-icon">f</span>
              <span>Facebook</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="auth-footer">
            <p>
              Pas encore de compte ?{' '}
              <Link to="/inscription" className="signup-link">
                Créer un compte
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Side Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="auth-info"
        >
          <h2 className="info-title">Votre hub freelance professionnel</h2>
          <p className="info-text">
            Publiez vos projets, trouvez les meilleurs talents ou décrochez des missions.
            Tout pour réussir en freelance, en toute sécurité.
          </p>
          <div className="info-features">
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Paiements garantis et sécurisés</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Contrats électroniques signables</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Messagerie et suivi intégrés</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ModernLoginPage;
