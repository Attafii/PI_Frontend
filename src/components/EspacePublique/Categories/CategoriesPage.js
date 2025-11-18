import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import './CategoriesPage.css';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchProjects();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8001/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:8001/api/publications');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const getProjectsByCategory = (categoryId) => {
    if (!categoryId) return projects;
    return projects.filter(p => p.categorie?._id === categoryId || p.categorie === categoryId);
  };

  const filteredProjects = selectedCategory 
    ? getProjectsByCategory(selectedCategory._id)
    : projects;

  return (
    <div className="categories-page">
      {/* Hero Section */}
      <section className="categories-hero">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hero-content"
          >
            <h1 className="page-title">
              Explorez tous les <span className="gradient-text">domaines d'expertise</span>
            </h1>
            <p className="page-subtitle">
              Découvrez nos catégories et trouvez le freelance parfait pour votre projet
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="categories-content">
        <div className="container">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Chargement des catégories...</p>
            </div>
          ) : (
            <>
              <div className="categories-grid-page">
                {categories.map((category, index) => (
                  <motion.div
                    key={category._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`category-card-page ${selectedCategory?._id === category._id ? 'active' : ''}`}
                    style={{ '--cat-color': category.couleur }}
                    onClick={() => setSelectedCategory(selectedCategory?._id === category._id ? null : category)}
                  >
                    <div className="category-icon-large">{category.icone}</div>
                    <h3 className="category-name-page">{category.nom_categorie}</h3>
                    <p className="category-description">{category.description}</p>
                    <div className="category-stats">
                      <div className="stat-item">
                        <span className="stat-number">{getProjectsByCategory(category._id).length}</span>
                        <span className="stat-label">Projets disponibles</span>
                      </div>
                    </div>
                    <button className="category-btn">
                      {selectedCategory?._id === category._id ? 'Tous les projets' : 'Voir les projets'}
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* Projects Section */}
              {selectedCategory && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="projects-section"
                >
                  <div className="section-header">
                    <h2 className="section-title">
                      Projets en {selectedCategory.nom_categorie}
                    </h2>
                    <button 
                      className="clear-filter-btn"
                      onClick={() => setSelectedCategory(null)}
                    >
                      Effacer le filtre
                    </button>
                  </div>

                  {filteredProjects.length > 0 ? (
                    <div className="projects-grid">
                      {filteredProjects.slice(0, 6).map((project) => (
                        <div key={project._id} className="project-card">
                          <div className="project-header">
                            <h3 className="project-title">{project.titre}</h3>
                            <span className="project-budget">{project.budget} TND</span>
                          </div>
                          <p className="project-description">
                            {project.description?.substring(0, 120)}...
                          </p>
                          <div className="project-footer">
                            <span className="project-date">
                              📅 {new Date(project.dateLimite).toLocaleDateString('fr-FR')}
                            </span>
                            <Link to="/inscription" className="project-link">
                              Postuler →
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-projects">
                      <p>Aucun projet disponible dans cette catégorie pour le moment.</p>
                      <Link to="/inscription" className="btn-primary">
                        Publier un projet
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}

              {/* CTA Section */}
              {!selectedCategory && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="categories-cta"
                >
                  <h2>Votre expertise ne figure pas dans la liste ?</h2>
                  <p>Rejoignez-nous et créez votre profil dans n'importe quel domaine</p>
                  <div className="cta-buttons">
                    <Link to="/inscription" className="btn-primary-cta">
                      Devenir freelance
                    </Link>
                    <Link to="/inscription" className="btn-secondary-cta">
                      Publier un projet
                    </Link>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default CategoriesPage;
