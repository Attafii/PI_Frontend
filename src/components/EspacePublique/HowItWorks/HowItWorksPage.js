import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './HowItWorksPage.css';

const HowItWorksPage = () => {
  const clientSteps = [
    {
      number: '01',
      icon: '📝',
      title: 'Publiez votre projet',
      description: 'Décrivez votre besoin en détail, fixez votre budget et définissez vos délais. La publication est 100% gratuite et ne prend que quelques minutes.',
      details: [
        'Formulaire simple et guidé',
        'Choix de catégorie précis',
        'Budget flexible et ajustable',
        'Pièces jointes acceptées'
      ]
    },
    {
      number: '02',
      icon: '💼',
      title: 'Recevez des propositions',
      description: 'Les freelances qualifiés consultent votre projet et vous envoient leurs offres avec leurs tarifs, délais et portfolios.',
      details: [
        'Propositions sous 24-48h',
        'Profils vérifiés et notés',
        'Portfolios consultables',
        'Communication directe'
      ]
    },
    {
      number: '03',
      icon: '🤝',
      title: 'Sélectionnez et collaborez',
      description: 'Comparez les offres, consultez les profils et choisissez le freelance qui correspond le mieux à vos attentes. Signez un contrat électronique.',
      details: [
        'Contrat sécurisé automatique',
        'Signature électronique',
        'Messagerie intégrée',
        'Suivi en temps réel'
      ]
    },
    {
      number: '04',
      icon: '✅',
      title: 'Validez et payez',
      description: 'Suivez l\'avancement du projet, validez les livrables étape par étape et effectuez le paiement en toute sécurité via notre système de dépôt.',
      details: [
        'Paiement par jalons',
        'Garantie de satisfaction',
        'Système de dépôt fiduciaire',
        'Support en cas de litige'
      ]
    }
  ];

  const freelanceSteps = [
    {
      number: '01',
      icon: '👤',
      title: 'Créez votre profil',
      description: 'Inscrivez-vous gratuitement et créez un profil professionnel complet avec vos compétences, expériences et portfolio.',
      details: [
        'Inscription gratuite',
        'Profil personnalisable',
        'Upload de portfolio',
        'Certifications et diplômes'
      ]
    },
    {
      number: '02',
      icon: '🔍',
      title: 'Trouvez des projets',
      description: 'Parcourez les projets disponibles dans votre domaine d\'expertise. Utilisez les filtres pour trouver les missions qui vous conviennent.',
      details: [
        'Nouveaux projets quotidiens',
        'Filtres par catégorie',
        'Notifications en temps réel',
        'Recherche avancée'
      ]
    },
    {
      number: '03',
      icon: '📨',
      title: 'Envoyez vos offres',
      description: 'Rédigez des propositions personnalisées, précisez vos tarifs et délais. Mettez en avant votre expertise et vos réalisations.',
      details: [
        'Propositions illimitées',
        'Templates personnalisables',
        'Chat avec le client',
        'Pièces jointes autorisées'
      ]
    },
    {
      number: '04',
      icon: '💰',
      title: 'Travaillez et soyez payé',
      description: 'Une fois sélectionné, réalisez le projet selon le contrat. Recevez vos paiements de manière sécurisée à chaque validation.',
      details: [
        'Paiements garantis',
        'Virements rapides',
        'Historique transparent',
        'Protection juridique'
      ]
    }
  ];

  const benefits = [
    {
      icon: '🔒',
      title: 'Sécurité maximale',
      description: 'Système de paiement sécurisé avec dépôt fiduciaire et contrats électroniques signables'
    },
    {
      icon: '⚡',
      title: 'Rapidité',
      description: 'Trouvez votre freelance ou décrochez des projets en moins de 24h'
    },
    {
      icon: '💬',
      title: 'Communication fluide',
      description: 'Messagerie intégrée pour échanger facilement avec tous vos collaborateurs'
    },
    {
      icon: '🎯',
      title: 'Qualité garantie',
      description: 'Profils vérifiés, avis authentiques et système de notation transparent'
    },
    {
      icon: '📊',
      title: 'Suivi complet',
      description: 'Tableau de bord pour gérer tous vos projets et suivre leur avancement'
    },
    {
      icon: '🤝',
      title: 'Support dédié',
      description: 'Équipe disponible pour vous accompagner à chaque étape'
    }
  ];

  return (
    <div className="how-it-works-page">
      {/* Hero Section */}
      <section className="hiw-hero">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hero-content"
          >
            <h1 className="page-title">
              Comment ça marche <span className="gradient-text">?</span>
            </h1>
            <p className="page-subtitle">
              Découvrez comment notre plateforme simplifie la collaboration entre clients et freelances
            </p>
          </motion.div>
        </div>
      </section>

      {/* Toggle Section */}
      <section className="toggle-section">
        <div className="container">
          <div className="toggle-buttons">
            <button className="toggle-btn active" data-target="client">
              <span className="toggle-icon">🎯</span>
              <span>Je suis client</span>
            </button>
            <button className="toggle-btn" data-target="freelance">
              <span className="toggle-icon">💼</span>
              <span>Je suis freelance</span>
            </button>
          </div>
        </div>
      </section>

      {/* Client Steps */}
      <section className="steps-section client-steps active-section" id="client-section">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title-main"
          >
            En 4 étapes simples, trouvez votre freelance idéal
          </motion.h2>

          <div className="steps-container">
            {clientSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="step-item"
              >
                <div className="step-number-large">{step.number}</div>
                <div className="step-content">
                  <div className="step-icon-large">{step.icon}</div>
                  <h3 className="step-title-large">{step.title}</h3>
                  <p className="step-description-large">{step.description}</p>
                  <ul className="step-details">
                    {step.details.map((detail, i) => (
                      <li key={i}>
                        <span className="check-icon">✓</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Freelance Steps */}
      <section className="steps-section freelance-steps" id="freelance-section">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title-main"
          >
            Lancez votre carrière freelance en 4 étapes
          </motion.h2>

          <div className="steps-container">
            {freelanceSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="step-item"
              >
                <div className="step-number-large">{step.number}</div>
                <div className="step-content">
                  <div className="step-icon-large">{step.icon}</div>
                  <h3 className="step-title-large">{step.title}</h3>
                  <p className="step-description-large">{step.description}</p>
                  <ul className="step-details">
                    {step.details.map((detail, i) => (
                      <li key={i}>
                        <span className="check-icon">✓</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-header"
          >
            <h2 className="section-title-main">Pourquoi choisir notre plateforme ?</h2>
            <p className="section-subtitle">Les avantages qui font la différence</p>
          </motion.div>

          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="benefit-card"
              >
                <div className="benefit-icon">{benefit.icon}</div>
                <h3 className="benefit-title">{benefit.title}</h3>
                <p className="benefit-description">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="hiw-cta">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="cta-content"
          >
            <h2>Prêt à commencer ?</h2>
            <p>Rejoignez des milliers de clients et freelances satisfaits</p>
            <div className="cta-buttons">
              <Link to="/inscription" className="btn-primary-cta">
                Créer un compte gratuitement
              </Link>
              <Link to="/connexion" className="btn-secondary-cta">
                Se connecter
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

// Add toggle functionality
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    
    toggleButtons.forEach(button => {
      button.addEventListener('click', () => {
        const target = button.getAttribute('data-target');
        
        // Update buttons
        toggleButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Update sections
        const clientSection = document.getElementById('client-section');
        const freelanceSection = document.getElementById('freelance-section');
        
        if (target === 'client') {
          clientSection?.classList.add('active-section');
          freelanceSection?.classList.remove('active-section');
        } else {
          freelanceSection?.classList.add('active-section');
          clientSection?.classList.remove('active-section');
        }
      });
    });
  });
}

export default HowItWorksPage;
