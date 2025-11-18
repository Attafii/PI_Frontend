import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import './ModernLandingPage.css';

const ModernLandingPage = () => {
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    projects: 0,
    freelancers: 0,
    clients: 0,
    completed: 0
  });

  useEffect(() => {
    fetchCategories();
    fetchStats();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8001/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const [pubRes, userRes] = await Promise.all([
        axios.get('http://localhost:8001/api/publications'),
        axios.get('http://localhost:8001/api/utilisateurs')
      ]);
      
      setStats({
        projects: pubRes.data.length,
        freelancers: userRes.data.filter(u => u.role === 'freelance').length,
        clients: userRes.data.filter(u => u.role === 'client').length,
        completed: pubRes.data.filter(p => p.statut === 'Terminé').length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="modern-landing">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-gradient"></div>
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-text"
          >
            <h1 className="hero-title">
              Connectez talents et <span className="gradient-text">opportunités</span>
              <br />en freelance
            </h1>
            <p className="hero-subtitle">
              La plateforme qui réunit freelances experts et clients ambitieux.
              Publiez vos projets, recevez des offres et collaborez en toute sécurité.
            </p>
            <div className="hero-buttons">
              <Link to="/inscription" className="btn-primary-hero">
                <span>Publier un projet</span>
                <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link to="/inscription" className="btn-secondary-hero">
                Devenir freelance
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-image"
          >
            <div className="floating-card card-1">
              <div className="card-icon">💼</div>
              <div className="card-text">
                <div className="card-title">+{stats.projects}</div>
                <div className="card-subtitle">Projets publiés</div>
              </div>
            </div>
            <div className="floating-card card-2">
              <div className="card-icon">👥</div>
              <div className="card-text">
                <div className="card-title">+{stats.freelancers}</div>
                <div className="card-subtitle">Freelances actifs</div>
              </div>
            </div>
            <div className="floating-card card-3">
              <div className="card-icon">✓</div>
              <div className="card-text">
                <div className="card-title">+{stats.completed}</div>
                <div className="card-subtitle">Projets réalisés</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-header"
          >
            <h2 className="section-title">Domaines d'expertise</h2>
            <p className="section-subtitle">
              Travaillez avec des freelances spécialisés dans votre secteur d'activité
            </p>
          </motion.div>

          <div className="categories-grid">
            {categories.slice(0, 8).map((cat, index) => (
              <motion.div
                key={cat._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="category-card"
                style={{ '--cat-color': cat.couleur }}
              >
                <div className="category-icon">{cat.icone}</div>
                <h3 className="category-name">{cat.nom_categorie}</h3>
                <p className="category-desc">{cat.description}</p>
                <div className="category-count">
                  {cat.nombrePublications || 0} projets disponibles
                </div>
              </motion.div>
            ))}
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/categories" className="view-all-btn">
              Voir toutes les catégories →
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-header"
          >
            <h2 className="section-title">Votre projet en 4 étapes</h2>
            <p className="section-subtitle">
              De la publication à la livraison, un processus simple et sécurisé
            </p>
          </motion.div>

          <div className="steps-grid">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="step-card"
            >
              <div className="step-number">1</div>
              <div className="step-icon">📝</div>
              <h3 className="step-title">Publiez gratuitement</h3>
              <p className="step-desc">
                Décrivez votre projet, budget et délai en quelques minutes
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="step-card"
            >
              <div className="step-number">2</div>
              <div className="step-icon">�</div>
              <h3 className="step-title">Comparez les offres</h3>
              <p className="step-desc">
                Recevez des propositions de freelances qualifiés et vérifiés
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="step-card"
            >
              <div className="step-number">3</div>
              <div className="step-icon">🤝</div>
              <h3 className="step-title">Collaborez</h3>
              <p className="step-desc">
                Choisissez votre freelance et suivez l'avancement en temps réel
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="step-card"
            >
              <div className="step-number">4</div>
              <div className="step-icon">�</div>
              <h3 className="step-title">Payez sécurisé</h3>
              <p className="step-desc">
                Validez le travail avant libération du paiement garanti
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-header"
          >
            <h2 className="section-title">Une plateforme de confiance</h2>
            <p className="section-subtitle">
              Tout ce dont vous avez besoin pour réussir vos projets freelance
            </p>
          </motion.div>

          <div className="features-grid">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="feature-card"
            >
              <div className="feature-icon">🔒</div>
              <h3 className="feature-title">Paiements garantis</h3>
              <p className="feature-desc">
                Système de dépôt sécurisé - Payez uniquement si satisfait
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="feature-card"
            >
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">Mise en relation rapide</h3>
              <p className="feature-desc">
                Recevez des propositions qualifiées en moins de 24h
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="feature-card"
            >
              <div className="feature-icon">💬</div>
              <h3 className="feature-title">Messagerie intégrée</h3>
              <p className="feature-desc">
                Échangez directement avec vos freelances via la plateforme
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="feature-card"
            >
              <div className="feature-icon">🎯</div>
              <h3 className="feature-title">Talents vérifiés</h3>
              <p className="feature-desc">
                Profils validés, portfolios et avis clients authentiques
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="feature-card"
            >
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Gestion simplifiée</h3>
              <p className="feature-desc">
                Tableau de bord intuitif pour piloter tous vos projets
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="feature-card"
            >
              <div className="feature-icon">🤝</div>
              <h3 className="feature-title">Support dédié</h3>
              <p className="feature-desc">
                Assistance disponible pour accompagner votre réussite
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="stat-card"
            >
              <div className="stat-number">{stats.projects}+</div>
              <div className="stat-label">Projets Publiés</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="stat-card"
            >
              <div className="stat-number">{stats.freelancers}+</div>
              <div className="stat-label">Freelances Actifs</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="stat-card"
            >
              <div className="stat-number">{stats.clients}+</div>
              <div className="stat-label">Clients Satisfaits</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="stat-card"
            >
              <div className="stat-number">{stats.completed}+</div>
              <div className="stat-label">Projets Réalisés</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-header"
          >
            <h2 className="section-title">Ils nous font confiance</h2>
            <p className="section-subtitle">
              Découvrez les témoignages de nos clients et freelances satisfaits
            </p>
          </motion.div>

          <div className="testimonials-grid">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="testimonial-card"
            >
              <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "J'ai lancé 5 projets sur la plateforme. Communication fluide, talents compétents, résultats au rendez-vous !"
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">👨‍💼</div>
                <div className="author-info">
                  <div className="author-name">Ahmed Mansour</div>
                  <div className="author-role">CEO, Digital Solutions</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="testimonial-card"
            >
              <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "Meilleure plateforme freelance ! Projets variés, clients sérieux, paiements à temps. Mon activité a décollé."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">👩‍💻</div>
                <div className="author-info">
                  <div className="author-name">Salma Trabelsi</div>
                  <div className="author-role">Freelance Développeuse</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="testimonial-card"
            >
              <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "Enfin une plateforme tunisienne professionnelle. Trouvé un graphiste excellent en 48h. Très satisfait !"
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">👨‍💼</div>
                <div className="author-info">
                  <div className="author-name">Yassine Dridi</div>
                  <div className="author-role">Directeur Marketing</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="cta-content"
        >
          <h2 className="cta-title">Lancez votre premier projet dès maintenant</h2>
          <p className="cta-subtitle">
            Rejoignez des milliers de clients et freelances qui réalisent leurs ambitions sur notre plateforme
          </p>
          <div className="cta-buttons">
            <Link to="/inscription" className="btn-cta-primary">
              Publier un projet gratuitement
            </Link>
            <Link to="/inscription" className="btn-cta-secondary">
              M'inscrire comme freelance
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default ModernLandingPage;
