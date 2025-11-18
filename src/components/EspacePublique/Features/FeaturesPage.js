import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './FeaturesPage.css';

const FeaturesPage = () => {
  const mainFeatures = [
    {
      icon: '🔒',
      title: 'Paiements 100% sécurisés',
      description: 'Système de dépôt fiduciaire garantissant la sécurité de vos transactions',
      details: [
        'Paiement par jalons',
        'Garantie de remboursement',
        'Protection acheteur et vendeur',
        'Historique transparent'
      ],
      image: '💳'
    },
    {
      icon: '📝',
      title: 'Contrats électroniques',
      description: 'Contrats automatiques avec signature numérique pour chaque projet',
      details: [
        'Génération automatique',
        'Signature électronique valide',
        'Stockage sécurisé',
        'Modification encadrée'
      ],
      image: '✍️'
    },
    {
      icon: '💬',
      title: 'Messagerie intégrée',
      description: 'Communiquez en temps réel avec vos collaborateurs directement sur la plateforme',
      details: [
        'Chat instantané',
        'Partage de fichiers',
        'Notifications push',
        'Historique conservé'
      ],
      image: '📨'
    },
    {
      icon: '📊',
      title: 'Tableau de bord complet',
      description: 'Gérez tous vos projets depuis une interface intuitive et moderne',
      details: [
        'Vue d\'ensemble claire',
        'Statistiques détaillées',
        'Filtres avancés',
        'Export de données'
      ],
      image: '📈'
    },
    {
      icon: '⭐',
      title: 'Système de notation',
      description: 'Avis vérifiés et notation transparente pour garantir la qualité',
      details: [
        'Avis clients authentiques',
        'Notation sur 5 étoiles',
        'Badges de confiance',
        'Historique consultable'
      ],
      image: '🏆'
    },
    {
      icon: '🔔',
      title: 'Notifications intelligentes',
      description: 'Restez informé en temps réel de toutes les activités importantes',
      details: [
        'Alertes personnalisables',
        'Email et push',
        'Récapitulatif quotidien',
        'Ne ratez rien'
      ],
      image: '📬'
    }
  ];

  const additionalFeatures = [
    {
      icon: '🎯',
      title: 'Matching intelligent',
      description: 'Algorithme qui connecte les meilleurs freelances aux projets adaptés'
    },
    {
      icon: '📱',
      title: 'Application mobile',
      description: 'Gérez vos projets en déplacement avec notre app (bientôt disponible)'
    },
    {
      icon: '🌐',
      title: 'Support multilingue',
      description: 'Interface disponible en français, arabe et anglais'
    },
    {
      icon: '💼',
      title: 'Portfolio intégré',
      description: 'Présentez vos réalisations directement sur votre profil'
    },
    {
      icon: '📅',
      title: 'Calendrier de projet',
      description: 'Planifiez et suivez les échéances de vos missions'
    },
    {
      icon: '🛡️',
      title: 'Protection juridique',
      description: 'Support juridique en cas de litige entre parties'
    },
    {
      icon: '💡',
      title: 'Formation continue',
      description: 'Accès à des ressources pour développer vos compétences'
    },
    {
      icon: '🤝',
      title: 'Médiation professionnelle',
      description: 'Équipe dédiée pour résoudre les différends rapidement'
    },
    {
      icon: '📊',
      title: 'Analytics avancés',
      description: 'Statistiques détaillées sur vos performances et revenus'
    }
  ];

  const securityFeatures = [
    {
      icon: '🔐',
      title: 'Cryptage SSL',
      description: 'Toutes vos données sont cryptées et sécurisées'
    },
    {
      icon: '✅',
      title: 'Vérification d\'identité',
      description: 'Processus de validation pour garantir l\'authenticité des profils'
    },
    {
      icon: '🏦',
      title: 'Comptes vérifiés',
      description: 'Validation bancaire pour les transactions sécurisées'
    },
    {
      icon: '🔍',
      title: 'Détection de fraude',
      description: 'Système automatique de détection des comportements suspects'
    }
  ];

  return (
    <div className="features-page">
      {/* Hero Section */}
      <section className="features-hero">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hero-content"
          >
            <h1 className="page-title">
              Toutes les <span className="gradient-text">fonctionnalités</span> pour réussir
            </h1>
            <p className="page-subtitle">
              Une plateforme complète avec tous les outils nécessaires pour vos projets freelance
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Features */}
      <section className="main-features-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-header"
          >
            <h2 className="section-title">Fonctionnalités principales</h2>
            <p className="section-subtitle">Les outils essentiels pour collaborer efficacement</p>
          </motion.div>

          <div className="main-features-grid">
            {mainFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="feature-card-large"
              >
                <div className="feature-header">
                  <div className="feature-icon-main">{feature.icon}</div>
                  <div className="feature-image">{feature.image}</div>
                </div>
                <h3 className="feature-title-main">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <ul className="feature-list">
                  {feature.details.map((detail, i) => (
                    <li key={i}>
                      <span className="check-icon">✓</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="additional-features-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-header"
          >
            <h2 className="section-title">Et bien plus encore...</h2>
            <p className="section-subtitle">D'autres fonctionnalités pour optimiser votre expérience</p>
          </motion.div>

          <div className="additional-features-grid">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="feature-card-small"
              >
                <div className="feature-icon-small">{feature.icon}</div>
                <h4 className="feature-title-small">{feature.title}</h4>
                <p className="feature-desc-small">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="security-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-header"
          >
            <h2 className="section-title">Sécurité & Confiance</h2>
            <p className="section-subtitle">Votre sécurité est notre priorité absolue</p>
          </motion.div>

          <div className="security-grid">
            {securityFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="security-card"
              >
                <div className="security-icon">{feature.icon}</div>
                <div className="security-content">
                  <h4 className="security-title">{feature.title}</h4>
                  <p className="security-description">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-highlight">
        <div className="container">
          <div className="stats-grid">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="stat-card"
            >
              <div className="stat-icon">🚀</div>
              <div className="stat-number">99.9%</div>
              <div className="stat-label">Disponibilité</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="stat-card"
            >
              <div className="stat-icon">⚡</div>
              <div className="stat-number">&lt;24h</div>
              <div className="stat-label">Temps de réponse</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="stat-card"
            >
              <div className="stat-icon">🔒</div>
              <div className="stat-number">100%</div>
              <div className="stat-label">Paiements sécurisés</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="stat-card"
            >
              <div className="stat-icon">⭐</div>
              <div className="stat-number">4.8/5</div>
              <div className="stat-label">Satisfaction client</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="features-cta">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="cta-content"
          >
            <h2>Découvrez toutes nos fonctionnalités</h2>
            <p>Inscrivez-vous gratuitement et explorez tous les outils à votre disposition</p>
            <div className="cta-buttons">
              <Link to="/inscription" className="btn-primary-cta">
                Créer un compte gratuit
              </Link>
              <Link to="/comment-ca-marche" className="btn-secondary-cta">
                Comment ça marche ?
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;
