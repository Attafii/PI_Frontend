import React, { useState, useEffect } from "react";
import axios from "axios";
import ContractView from "../Contracts/ContractView";

// Enhanced Toast notification with icons
const Toast = ({ message, type, onClose }) => {
  const icons = {
    success: "✓",
    error: "✕",
    info: "ℹ",
    warning: "⚠"
  };

  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
    warning: "bg-yellow-500"
  };

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl ${colors[type]} text-white transform transition-all duration-300 animate-slide-in`}>
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold">{icons[type]}</span>
        <span className="font-medium">{message}</span>
        <button onClick={onClose} className="ml-4 text-white hover:text-gray-200 text-xl font-bold">
          ×
        </button>
      </div>
    </div>
  );
};

// Notification Badge Component
const NotificationBadge = ({ count }) => {
  if (count === 0) return null;
  return (
    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
      {count > 99 ? "99+" : count}
    </span>
  );
};

// Project Card with enhanced design
const ProjectCard = ({ project, onViewDetails, onAcceptBid, getNewBidsCount }) => {
  const newBids = getNewBidsCount(project);
  
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Header with status */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-1">{project.titre}</h3>
            <p className="text-sm text-blue-100">Budget: {project.budget} TND</p>
          </div>
          <span className={`px-4 py-1 rounded-full text-sm font-semibold ${getStatusBadge(project.statut)}`}>
            {project.statut}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-gray-700 mb-4 line-clamp-2">{project.description}</p>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 relative">
              {project.candidatures?.length || 0}
              {newBids > 0 && <NotificationBadge count={newBids} />}
            </div>
            <div className="text-xs text-gray-600">Candidatures</div>
          </div>
          
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {project.dateLimite ? new Date(project.dateLimite).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : '-'}
            </div>
            <div className="text-xs text-gray-600">Date limite</div>
          </div>
          
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {project.specialiteRequise || 'Toutes'}
            </div>
            <div className="text-xs text-gray-600">Spécialité</div>
          </div>
        </div>

        {/* Progress Bar for "En cours" projects */}
        {project.statut === "En cours" && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Avancement</span>
              <span className="font-semibold text-blue-600">25%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '25%' }}></div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={() => onViewDetails(project)}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-md"
        >
          {newBids > 0 ? `📩 ${newBids} Nouvelle${newBids > 1 ? 's' : ''} candidature${newBids > 1 ? 's' : ''}` : 'Voir les détails'}
        </button>
      </div>
    </div>
  );
};

// Helper function for status badge
const getStatusBadge = (statut) => {
  const badges = {
    "Ouvert": "bg-blue-100 text-blue-800",
    "En cours": "bg-yellow-100 text-yellow-800",
    "Terminé": "bg-green-100 text-green-800",
    "Annulé": "bg-red-100 text-red-800"
  };
  return badges[statut] || "bg-gray-100 text-gray-800";
};

// Create Project Modal with Milestones
const CreateProjectModal = ({ isOpen, onClose, onSubmit }) => {
  const [categories, setCategories] = useState([]);
  const [project, setProject] = useState({
    titre: "",
    description: "",
    budget: "",
    categorie: "",
    specialiteRequise: "",
    dateLimite: "",
    milestones: []
  });

  const [milestones, setMilestones] = useState([
    { titre: "", montant: "", description: "" }
  ]);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8001/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const addMilestone = () => {
    setMilestones([...milestones, { titre: "", montant: "", description: "" }]);
  };

  const removeMilestone = (index) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const updateMilestone = (index, field, value) => {
    const updated = [...milestones];
    updated[index][field] = value;
    setMilestones(updated);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!project.titre.trim()) newErrors.titre = "Le titre est requis";
    if (!project.description.trim()) newErrors.description = "La description est requise";
    if (!project.budget || project.budget <= 0) newErrors.budget = "Budget invalide";
    
    const totalMilestones = milestones.reduce((sum, m) => sum + (parseFloat(m.montant) || 0), 0);
    if (totalMilestones > parseFloat(project.budget)) {
      newErrors.milestones = "Le total des jalons dépasse le budget";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({ ...project, milestones: milestones.filter(m => m.titre && m.montant) });
      setProject({ titre: "", description: "", budget: "", specialiteRequise: "", dateLimite: "", milestones: [] });
      setMilestones([{ titre: "", montant: "", description: "" }]);
    }
  };

  if (!isOpen) return null;

  const totalMilestones = milestones.reduce((sum, m) => sum + (parseFloat(m.montant) || 0), 0);
  const remaining = (parseFloat(project.budget) || 0) - totalMilestones;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">📝 Créer un nouveau projet</h2>
            <button onClick={onClose} className="text-white hover:text-gray-200 text-3xl font-bold">
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Project Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Informations du projet</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Titre du projet *</label>
              <input
                type="text"
                value={project.titre}
                onChange={(e) => setProject({ ...project, titre: e.target.value })}
                className={`w-full px-4 py-3 border ${errors.titre ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Ex: Développement d'une application mobile"
              />
              {errors.titre && <p className="text-red-500 text-sm mt-1">{errors.titre}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                value={project.description}
                onChange={(e) => setProject({ ...project, description: e.target.value })}
                rows="4"
                className={`w-full px-4 py-3 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Décrivez votre projet en détail..."
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget total (TND) *</label>
                <input
                  type="number"
                  value={project.budget}
                  onChange={(e) => setProject({ ...project, budget: e.target.value })}
                  className={`w-full px-4 py-3 border ${errors.budget ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="5000"
                />
                {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie *</label>
                <select
                  value={project.categorie}
                  onChange={(e) => setProject({ ...project, categorie: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>
                      {cat.icone} {cat.nom_categorie}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date limite</label>
                <input
                  type="date"
                  value={project.dateLimite}
                  onChange={(e) => setProject({ ...project, dateLimite: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Spécialité requise</label>
              <input
                type="text"
                value={project.specialiteRequise}
                onChange={(e) => setProject({ ...project, specialiteRequise: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Développeur React, Designer UI/UX"
              />
            </div>
          </div>

          {/* Milestones Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-lg font-semibold text-gray-800">Jalons de paiement (optionnel)</h3>
              <div className="text-sm">
                <span className="text-gray-600">Restant: </span>
                <span className={`font-bold ${remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {remaining.toFixed(2)} TND
                </span>
              </div>
            </div>

            {errors.milestones && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {errors.milestones}
              </div>
            )}

            {milestones.map((milestone, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-700">Jalon {index + 1}</h4>
                  {milestones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMilestone(index)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      ✕ Supprimer
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={milestone.titre}
                    onChange={(e) => updateMilestone(index, 'titre', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Titre du jalon"
                  />
                  <input
                    type="number"
                    value={milestone.montant}
                    onChange={(e) => updateMilestone(index, 'montant', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Montant (TND)"
                  />
                  <textarea
                    value={milestone.description}
                    onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                    rows="2"
                    className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Description du jalon"
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addMilestone}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors font-medium"
            >
              + Ajouter un jalon
            </button>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
            >
              🚀 Publier le projet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Project Details Modal
const ProjectDetailsModal = ({ project, isOpen, onClose, onAcceptBid, onViewContract }) => {
  const [contractId, setContractId] = useState(null);
  const [loadingContract, setLoadingContract] = useState(false);

  useEffect(() => {
    if (isOpen && project && project.statut === "En cours") {
      fetchContract();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, project]);

  const fetchContract = async () => {
    setLoadingContract(true);
    try {
      const response = await axios.get(`http://localhost:8001/api/contrats/client/${localStorage.getItem("userId")}`);
      const projectContract = response.data.find(c => c.publicationId._id === project._id);
      if (projectContract) {
        setContractId(projectContract._id);
      }
    } catch (error) {
      console.error("Error fetching contract:", error);
    } finally {
      setLoadingContract(false);
    }
  };

  if (!isOpen || !project) return null;

  const pendingBids = project.candidatures?.filter(c => c.statut === "En attente") || [];
  const acceptedBid = project.candidatures?.find(c => c.statut === "Acceptée");

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">{project.titre}</h2>
              <p className="text-blue-100">{project.description}</p>
            </div>
            <button onClick={onClose} className="text-white hover:text-gray-200 text-3xl font-bold">
              ×
            </button>
          </div>
          <div className="flex gap-4 mt-4">
            <span className="bg-white/20 px-4 py-2 rounded-lg">
              💰 Budget: <span className="font-bold">{project.budget} TND</span>
            </span>
            <span className={`px-4 py-2 rounded-lg ${getStatusBadge(project.statut)}`}>
              {project.statut}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Accepted Bid Section */}
          {acceptedBid && (
            <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-green-800">✓ Freelancer sélectionné</h3>
                {contractId && (
                  <button
                    onClick={() => onViewContract(contractId)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all flex items-center gap-2 text-sm font-semibold"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Voir le Contrat
                  </button>
                )}
                {!contractId && loadingContract && (
                  <span className="text-sm text-gray-500">Chargement du contrat...</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800">
                    {acceptedBid.candidatId?.nom} {acceptedBid.candidatId?.prenom}
                  </p>
                  <p className="text-sm text-gray-600">{acceptedBid.candidatId?.email}</p>
                  <p className="text-sm text-gray-600 mt-2">{acceptedBid.message}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{acceptedBid.prixPropose} TND</div>
                  <div className="text-sm text-gray-600">{acceptedBid.delaiPropose} jours</div>
                </div>
              </div>
            </div>
          )}

          {/* Pending Bids */}
          {pendingBids.length > 0 ? (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                📬 Candidatures ({pendingBids.length})
              </h3>
              <div className="space-y-4">
                {pendingBids.map((bid) => (
                  <div key={bid._id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                            {bid.candidatId?.nom?.[0]}{bid.candidatId?.prenom?.[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {bid.candidatId?.nom} {bid.candidatId?.prenom}
                            </p>
                            <p className="text-sm text-gray-600">{bid.candidatId?.specialite || 'Freelancer'}</p>
                          </div>
                        </div>
                        <p className="text-gray-700 mt-3 leading-relaxed">{bid.message}</p>
                      </div>
                      
                      <div className="text-right ml-4">
                        <div className="text-3xl font-bold text-blue-600">{bid.prixPropose} TND</div>
                        <div className="text-sm text-gray-600 mt-1">⏱️ {bid.delaiPropose} jours</div>
                        <button
                          onClick={() => onAcceptBid(project._id, bid._id)}
                          className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors shadow-md"
                        >
                          ✓ Accepter
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-2 text-xs text-gray-500 border-t pt-3">
                      <span>📧 {bid.candidatId?.email}</span>
                      <span>•</span>
                      <span>📅 {new Date(bid.dateCandidature).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : !acceptedBid && (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-lg">Aucune candidature pour le moment</p>
              <p className="text-sm mt-2">Les freelancers pourront postuler bientôt</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
export default function EnhancedDashboardClient() {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState(null);
  const [toast, setToast] = useState(null);
  const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, completed: 0 });

  const clientId = localStorage.getItem("userId");

  useEffect(() => {
    fetchPublications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPublications = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8001/api/publications/client/${clientId}`
      );
      setPublications(response.data);
      
      // Calculate stats
      const total = response.data.length;
      const open = response.data.filter(p => p.statut === "Ouvert").length;
      const inProgress = response.data.filter(p => p.statut === "En cours").length;
      const completed = response.data.filter(p => p.statut === "Terminé").length;
      setStats({ total, open, inProgress, completed });
      
      setLoading(false);
    } catch (error) {
      console.error("Erreur:", error);
      setLoading(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleCreateProject = async (projectData) => {
    try {
      await axios.post("http://localhost:8001/api/publications", {
        ...projectData,
        clientId,
      });

      showToast("✓ Projet créé avec succès !", "success");
      setShowCreateModal(false);
      fetchPublications();
    } catch (error) {
      console.error("Erreur:", error);
      showToast("Erreur lors de la création du projet", "error");
    }
  };

  const handleAcceptBid = async (publicationId, candidatureId) => {
    try {
      await axios.put(
        `http://localhost:8001/api/publications/${publicationId}/candidatures/${candidatureId}/accept`,
        { clientId }
      );

      showToast("✓ Candidature acceptée ! Contrat en génération...", "success");
      setShowDetailsModal(false);
      fetchPublications();
    } catch (error) {
      console.error("Erreur:", error);
      showToast("Erreur lors de l'acceptation", "error");
    }
  };

  const getNewBidsCount = (project) => {
    return project.candidatures?.filter(c => c.statut === "En attente").length || 0;
  };

  const handleViewDetails = (project) => {
    setSelectedProject(project);
    setShowDetailsModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Tableau de bord Client</h1>
          <p className="text-gray-600">Gérez vos projets et collaborez avec des freelancers</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Projets</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">En cours</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.inProgress}</p>
              </div>
              <div className="text-4xl">🚀</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Ouverts</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.open}</p>
              </div>
              <div className="text-4xl">📢</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Terminés</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.completed}</p>
              </div>
              <div className="text-4xl">✓</div>
            </div>
          </div>
        </div>

        {/* Create Project Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center gap-3"
          >
            <span className="text-2xl">+</span>
            Créer un nouveau projet
          </button>
        </div>

        {/* Projects Grid */}
        {publications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Aucun projet pour le moment</h3>
            <p className="text-gray-600 mb-6">Commencez par créer votre premier projet</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105"
            >
              Créer un projet
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publications.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onViewDetails={handleViewDetails}
                onAcceptBid={handleAcceptBid}
                getNewBidsCount={getNewBidsCount}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateProject}
      />

      <ProjectDetailsModal
        project={selectedProject}
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        onAcceptBid={handleAcceptBid}
        onViewContract={(contractId) => {
          setSelectedContractId(contractId);
          setShowContractModal(true);
        }}
      />

      {/* Contract View Modal */}
      {showContractModal && selectedContractId && (
        <ContractView
          contractId={selectedContractId}
          userId={clientId}
          userType="client"
          onClose={() => {
            setShowContractModal(false);
            setSelectedContractId(null);
          }}
        />
      )}

      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
