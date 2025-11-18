import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import './ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    num_tel: '',
    specialite: '',
    tarifHoraire: '',
    description: '',
    competences: []
  });
  const [newCompetence, setNewCompetence] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/connexion');
      return;
    }

    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    setFormData({
      nom: userData.nom || '',
      prenom: userData.prenom || '',
      email: userData.email || '',
      num_tel: userData.num_tel || '',
      specialite: userData.specialite || '',
      tarifHoraire: userData.tarifHoraire || '',
      description: userData.description || '',
      competences: userData.competences || []
    });
    setLoading(false);
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddCompetence = () => {
    if (newCompetence.trim() && !formData.competences.includes(newCompetence.trim())) {
      setFormData({
        ...formData,
        competences: [...formData.competences, newCompetence.trim()]
      });
      setNewCompetence('');
    }
  };

  const handleRemoveCompetence = (competence) => {
    setFormData({
      ...formData,
      competences: formData.competences.filter(c => c !== competence)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.put(
        `http://localhost:8001/api/users/update/${userId}`,
        {
          nom: formData.nom,
          prenom: formData.prenom,
          num_tel: formData.num_tel,
          specialite: formData.specialite,
          tarifHoraire: formData.tarifHoraire ? parseFloat(formData.tarifHoraire) : undefined,
          description: formData.description,
          competences: formData.competences
        }
      );

      // Update localStorage
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      // Dispatch auth change event to update navbar
      window.dispatchEvent(new Event('authChange'));

      setAlert({ type: 'success', message: 'Profil mis à jour avec succès !' });
      setIsEditing(false);

      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      console.error('Update error:', error);
      setAlert({ 
        type: 'error', 
        message: 'Erreur lors de la mise à jour du profil' 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original user data
    setFormData({
      nom: user.nom || '',
      prenom: user.prenom || '',
      email: user.email || '',
      num_tel: user.num_tel || '',
      specialite: user.specialite || '',
      tarifHoraire: user.tarifHoraire || '',
      description: user.description || '',
      competences: user.competences || []
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner-large"></div>
        <p>Chargement du profil...</p>
      </div>
    );
  }

  const isFreelance = user?.role === 'freelance' || user?.role === 'candidat';

  return (
    <div className="profile-page">
      <div className="profile-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
      </div>

      <div className="profile-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="profile-header"
        >
          <div className="profile-header-content">
            <h1>Mon Profil</h1>
            <p className="profile-subtitle">
              {isFreelance ? 'Gérez vos informations professionnelles' : 'Gérez vos informations'}
            </p>
          </div>
          {!isEditing && (
            <button className="btn-edit-profile" onClick={() => setIsEditing(true)}>
              <span>✏️</span>
              <span>Modifier</span>
            </button>
          )}
        </motion.div>

        {/* Alert */}
        {alert && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`profile-alert profile-alert-${alert.type}`}
          >
            <span className="alert-icon">
              {alert.type === 'success' ? '✓' : '✕'}
            </span>
            <span>{alert.message}</span>
          </motion.div>
        )}

        <div className="profile-content">
          {/* Left Column - Avatar & Stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="profile-sidebar"
          >
            <div className="profile-card">
              <div className="profile-avatar-section">
                <div className="profile-avatar-large">
                  {user?.photo ? (
                    <img src={user.photo} alt={user.nom} />
                  ) : (
                    <span className="avatar-initials">
                      {user?.nom?.[0]}{user?.prenom?.[0]}
                    </span>
                  )}
                </div>
                <h2 className="profile-name">{user?.prenom} {user?.nom}</h2>
                <p className="profile-role-badge">
                  {isFreelance ? '💼 Freelance' : '🎯 Client'}
                </p>
              </div>

              {isFreelance && (
                <>
                  <div className="profile-divider"></div>
                  <div className="profile-stats">
                    <div className="stat-item">
                      <span className="stat-icon">⭐</span>
                      <div className="stat-content">
                        <span className="stat-value">{user?.note || '0.0'}</span>
                        <span className="stat-label">Note moyenne</span>
                      </div>
                    </div>
                    <div className="stat-item">
                      <span className="stat-icon">💬</span>
                      <div className="stat-content">
                        <span className="stat-value">{user?.nombreAvis || 0}</span>
                        <span className="stat-label">Avis reçus</span>
                      </div>
                    </div>
                    {user?.tarifHoraire && (
                      <div className="stat-item">
                        <span className="stat-icon">💰</span>
                        <div className="stat-content">
                          <span className="stat-value">{user.tarifHoraire}€</span>
                          <span className="stat-label">Tarif horaire</span>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="profile-divider"></div>
              
              <div className="profile-info-list">
                <div className="info-item">
                  <span className="info-icon">📧</span>
                  <div className="info-content">
                    <span className="info-label">Email</span>
                    <span className="info-value">{user?.email}</span>
                  </div>
                </div>
                {user?.num_tel && (
                  <div className="info-item">
                    <span className="info-icon">📱</span>
                    <div className="info-content">
                      <span className="info-label">Téléphone</span>
                      <span className="info-value">{user.num_tel}</span>
                    </div>
                  </div>
                )}
                <div className="info-item">
                  <span className="info-icon">📅</span>
                  <div className="info-content">
                    <span className="info-label">Membre depuis</span>
                    <span className="info-value">
                      {user?.dateInscription 
                        ? new Date(user.dateInscription).toLocaleDateString('fr-FR')
                        : 'N/A'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="profile-main"
          >
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="profile-card">
                <h3 className="section-title">
                  <span className="title-icon">👤</span>
                  Informations personnelles
                </h3>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Nom</label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="form-input"
                      placeholder="Votre nom"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Prénom</label>
                    <input
                      type="text"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="form-input"
                      placeholder="Votre prénom"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="form-input"
                      placeholder="votre@email.com"
                    />
                    <span className="field-hint">L'email ne peut pas être modifié</span>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Téléphone</label>
                    <input
                      type="tel"
                      name="num_tel"
                      value={formData.num_tel}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="form-input"
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>
                </div>
              </div>

              {isFreelance && (
                <>
                  <div className="profile-card">
                    <h3 className="section-title">
                      <span className="title-icon">💼</span>
                      Informations professionnelles
                    </h3>

                    <div className="form-group">
                      <label className="form-label">Spécialité</label>
                      <input
                        type="text"
                        name="specialite"
                        value={formData.specialite}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="form-input"
                        placeholder="Ex: Développement Web, Design UI/UX..."
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Tarif horaire (€)</label>
                      <input
                        type="number"
                        name="tarifHoraire"
                        value={formData.tarifHoraire}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="form-input"
                        placeholder="45"
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Description professionnelle</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="form-textarea"
                        rows="5"
                        placeholder="Décrivez votre expérience, vos compétences et ce qui vous distingue..."
                      />
                    </div>
                  </div>

                  <div className="profile-card">
                    <h3 className="section-title">
                      <span className="title-icon">🛠️</span>
                      Compétences
                    </h3>

                    {isEditing && (
                      <div className="competence-input-wrapper">
                        <input
                          type="text"
                          value={newCompetence}
                          onChange={(e) => setNewCompetence(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCompetence())}
                          className="form-input"
                          placeholder="Ajouter une compétence (Ex: React, Node.js...)"
                        />
                        <button
                          type="button"
                          onClick={handleAddCompetence}
                          className="btn-add-competence"
                        >
                          + Ajouter
                        </button>
                      </div>
                    )}

                    <div className="competences-list">
                      {formData.competences.length > 0 ? (
                        formData.competences.map((competence, index) => (
                          <div key={index} className="competence-tag">
                            <span>{competence}</span>
                            {isEditing && (
                              <button
                                type="button"
                                onClick={() => handleRemoveCompetence(competence)}
                                className="competence-remove"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="empty-state">
                          {isEditing 
                            ? 'Ajoutez vos compétences pour attirer plus de clients'
                            : 'Aucune compétence ajoutée'
                          }
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {isEditing && (
                <div className="form-actions">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn-cancel"
                    disabled={saving}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="btn-save"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="loading-spinner-small"></span>
                        <span>Enregistrement...</span>
                      </>
                    ) : (
                      <>
                        <span>💾</span>
                        <span>Enregistrer les modifications</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
