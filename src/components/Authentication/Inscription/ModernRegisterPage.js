import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import '../Connexion/ModernAuth.css';

const ModernRegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'candidat', // freelance
    telephone: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    
    if (!formData.nom) {
      newErrors.nom = 'Nom requis';
    }
    
    if (!formData.prenom) {
      newErrors.prenom = 'Prénom requis';
    }
    
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
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmation requise';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    if (formData.telephone && !/^\d{8,}$/.test(formData.telephone)) {
      newErrors.telephone = 'Numéro invalide (min 8 chiffres)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await axios.post('http://localhost:8001/api/register', {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        mdp: formData.password,
        role: formData.role,
        telephone: formData.telephone
      });

      setAlert({ type: 'success', message: 'Inscription réussie ! Redirection...' });
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/connexion');
      }, 2000);

    } catch (error) {
      console.error('Registration error:', error);
      setAlert({ 
        type: 'error', 
        message: error.response?.data?.message || 'Erreur lors de l\'inscription. Email peut-être déjà utilisé.' 
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
          className="auth-card register-card"
        >
          {/* Logo/Brand */}
          <div className="auth-header">
            <div className="auth-logo">
              <div className="logo-icon">🚀</div>
            </div>
            <h1 className="auth-title">Rejoignez-nous gratuitement</h1>
            <p className="auth-subtitle">Commencez à publier ou décrocher des projets freelance</p>
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
            {/* Role Selection */}
            <div className="form-group">
              <label className="form-label">Je souhaite</label>
              <div className="role-selector">
                <label className={`role-option ${formData.role === 'candidat' ? 'role-selected' : ''}`}>
                  <input
                    type="radio"
                    name="role"
                    value="candidat"
                    checked={formData.role === 'candidat'}
                    onChange={handleChange}
                  />
                  <div className="role-content">
                    <span className="role-icon">💼</span>
                    <span className="role-label">Je suis freelance</span>
                  </div>
                </label>
                <label className={`role-option ${formData.role === 'client' ? 'role-selected' : ''}`}>
                  <input
                    type="radio"
                    name="role"
                    value="client"
                    checked={formData.role === 'client'}
                    onChange={handleChange}
                  />
                  <div className="role-content">
                    <span className="role-icon">🎯</span>
                    <span className="role-label">Je recrute des freelances</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Name Fields */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nom" className="form-label">Nom</label>
                <div className="input-wrapper">
                  <span className="input-icon">👤</span>
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    className={`form-input ${errors.nom ? 'input-error' : ''}`}
                    placeholder="Votre nom"
                  />
                </div>
                {errors.nom && <span className="error-message">{errors.nom}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="prenom" className="form-label">Prénom</label>
                <div className="input-wrapper">
                  <span className="input-icon">👤</span>
                  <input
                    type="text"
                    id="prenom"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    className={`form-input ${errors.prenom ? 'input-error' : ''}`}
                    placeholder="Votre prénom"
                  />
                </div>
                {errors.prenom && <span className="error-message">{errors.prenom}</span>}
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">Adresse email</label>
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
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            {/* Phone */}
            <div className="form-group">
              <label htmlFor="telephone" className="form-label">
                Téléphone <span className="optional-label">(optionnel)</span>
              </label>
              <div className="input-wrapper">
                <span className="input-icon">📱</span>
                <input
                  type="tel"
                  id="telephone"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  className={`form-input ${errors.telephone ? 'input-error' : ''}`}
                  placeholder="12345678"
                />
              </div>
              {errors.telephone && <span className="error-message">{errors.telephone}</span>}
            </div>

            {/* Password Fields */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password" className="form-label">Mot de passe</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`form-input ${errors.password ? 'input-error' : ''}`}
                    placeholder="Min 6 caractères"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">Confirmer</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
                    placeholder="Répéter"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="password-toggle"
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>
            </div>

            {/* Terms */}
            <div className="form-group">
              <label className="checkbox-label terms-label">
                <input type="checkbox" required />
                <span>
                  J'accepte les{' '}
                  <Link to="/terms" className="terms-link">conditions d'utilisation</Link>
                  {' '}et la{' '}
                  <Link to="/privacy" className="terms-link">politique de confidentialité</Link>
                </span>
              </label>
            </div>

            <button type="submit" disabled={loading} className="submit-button">
              {loading ? (
                <span className="loading-spinner"></span>
              ) : (
                <>
                  <span>Créer mon compte</span>
                  <svg className="button-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="auth-footer">
            <p>
              Vous avez déjà un compte ?{' '}
              <Link to="/connexion" className="signup-link">
                Se connecter
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
          <h2 className="info-title">Propulsez votre carrière freelance</h2>
          <p className="info-text">
            Des milliers de clients et freelances utilisent déjà notre plateforme pour collaborer,
            développer leurs projets et faire grandir leur business.
          </p>
          <div className="info-features">
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Inscription gratuite sans engagement</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Accès illimité aux projets et talents</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Protection financière garantie</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Équipe support réactive et disponible</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ModernRegisterPage;
