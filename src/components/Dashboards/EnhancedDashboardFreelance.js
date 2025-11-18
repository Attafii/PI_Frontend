import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import ContractView from "../Contracts/ContractView";

// Enhanced Toast Component
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
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl ${colors[type]} text-white`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold">{icons[type]}</span>
        <span className="font-medium">{message}</span>
        <button onClick={onClose} className="ml-4 text-white hover:text-gray-200 text-xl font-bold">
          ×
        </button>
      </div>
    </motion.div>
  );
};

// Project Card Component
const ProjectCard = ({ project, onApply }) => {
  const daysLeft = project.dateLimite 
    ? Math.max(0, Math.ceil((new Date(project.dateLimite) - new Date()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
    >
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-4 text-white">
        <h3 className="text-xl font-bold mb-1">{project.titre}</h3>
        <div className="flex items-center gap-4 text-sm">
          <span className="bg-white/20 px-3 py-1 rounded-full">
            💰 {project.budget} TND
          </span>
          {daysLeft !== null && (
            <span className="bg-white/20 px-3 py-1 rounded-full">
              ⏰ {daysLeft} jours restants
            </span>
          )}
        </div>
      </div>

      <div className="p-6">
        <p className="text-gray-700 mb-4 line-clamp-3 leading-relaxed">
          {project.description}
        </p>

        {project.specialiteRequise && (
          <div className="mb-4">
            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              🎯 {project.specialiteRequise}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{project.client?.nom} {project.client?.prenom}</span>
          </div>
          <button
            onClick={() => onApply(project)}
            className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition-all transform hover:scale-105 shadow-md"
          >
            Postuler
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Application Modal
const ApplicationModal = ({ project, isOpen, onClose, onSubmit }) => {
  const [application, setApplication] = useState({
    prixPropose: "",
    delaiPropose: "",
    message: ""
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!application.prixPropose || application.prixPropose <= 0) {
      newErrors.prixPropose = "Prix invalide";
    }
    if (!application.delaiPropose || application.delaiPropose <= 0) {
      newErrors.delaiPropose = "Délai invalide";
    }
    if (!application.message.trim()) {
      newErrors.message = "Message requis";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(application);
      setApplication({ prixPropose: "", delaiPropose: "", message: "" });
    }
  };

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full"
      >
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">📝 Postuler au projet</h2>
              <p className="text-white/90">{project.titre}</p>
            </div>
            <button onClick={onClose} className="text-white hover:text-gray-200 text-3xl font-bold">
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-sm text-blue-800">
              <strong>Budget du client:</strong> {project.budget} TND
            </p>
            <p className="text-sm text-blue-800 mt-1">
              Proposez un prix compétitif et un délai réaliste
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Votre prix (TND) *
              </label>
              <input
                type="number"
                value={application.prixPropose}
                onChange={(e) => setApplication({ ...application, prixPropose: e.target.value })}
                className={`w-full px-4 py-3 border ${errors.prixPropose ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-purple-500`}
                placeholder="Ex: 3500"
              />
              {errors.prixPropose && <p className="text-red-500 text-sm mt-1">{errors.prixPropose}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Délai (jours) *
              </label>
              <input
                type="number"
                value={application.delaiPropose}
                onChange={(e) => setApplication({ ...application, delaiPropose: e.target.value })}
                className={`w-full px-4 py-3 border ${errors.delaiPropose ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-purple-500`}
                placeholder="Ex: 30"
              />
              {errors.delaiPropose && <p className="text-red-500 text-sm mt-1">{errors.delaiPropose}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message de motivation *
            </label>
            <textarea
              value={application.message}
              onChange={(e) => setApplication({ ...application, message: e.target.value })}
              rows="6"
              className={`w-full px-4 py-3 border ${errors.message ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-purple-500`}
              placeholder="Présentez votre expérience, compétences et approche pour ce projet..."
            />
            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
            <p className="text-sm text-gray-500 mt-1">
              {application.message.length}/500 caractères
            </p>
          </div>

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
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
            >
              🚀 Envoyer la candidature
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// My Applications Component
const MyApplicationCard = ({ application, getStatusColor, onViewContract }) => {
  const [contractId, setContractId] = useState(null);

  useEffect(() => {
    if (application.candidature.statut === "Acceptée") {
      fetchContract();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [application]);

  const fetchContract = async () => {
    try {
      const response = await axios.get(`http://localhost:8001/api/contrats/freelance/${localStorage.getItem("userId")}`);
      const projectContract = response.data.find(c => c.publicationId._id === application.publication._id || c.publicationId === application.publication._id);
      if (projectContract) {
        setContractId(projectContract._id);
      }
    } catch (error) {
      console.error("Error fetching contract:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {application.publication?.titre}
          </h3>
          <p className="text-sm text-gray-600">
            Client: {application.client?.nom} {application.client?.prenom}
          </p>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(application.candidature.statut)}`}>
          {application.candidature.statut}
        </span>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <p className="text-gray-700 text-sm leading-relaxed">
          {application.candidature.message}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-xl font-bold text-green-600">
            {application.candidature.prixPropose} TND
          </div>
          <div className="text-xs text-gray-600">Votre prix</div>
        </div>

        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-xl font-bold text-blue-600">
            {application.candidature.delaiPropose} j
          </div>
          <div className="text-xs text-gray-600">Délai proposé</div>
        </div>

        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-xl font-bold text-purple-600">
            {application.publication?.budget} TND
          </div>
          <div className="text-xs text-gray-600">Budget client</div>
        </div>
      </div>

      {application.candidature.statut === "Acceptée" && (
        <div className="mt-4 bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <p className="text-green-800 font-semibold mb-2">
            🎉 Félicitations ! Votre candidature a été acceptée.
          </p>
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
        </div>
      )}
    </motion.div>
  );
};

// Main Enhanced Freelancer Dashboard
export default function EnhancedDashboardFreelance() {
  const [availableProjects, setAvailableProjects] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState(null);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("available"); // available | applications
  const [stats, setStats] = useState({ 
    available: 0, 
    applied: 0, 
    accepted: 0, 
    pending: 0 
  });

  const freelanceId = localStorage.getItem("userId");

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      const [projectsRes, applicationsRes] = await Promise.all([
        axios.get("http://localhost:8001/api/publications?statut=Ouvert"),
        axios.get(`http://localhost:8001/api/publications/freelance/${freelanceId}/candidatures`)
      ]);

      setAvailableProjects(projectsRes.data);
      setMyApplications(applicationsRes.data);

      // Calculate stats
      const applied = applicationsRes.data.length;
      const accepted = applicationsRes.data.filter(a => a.candidature.statut === "Acceptée").length;
      const pending = applicationsRes.data.filter(a => a.candidature.statut === "En attente").length;

      setStats({
        available: projectsRes.data.length,
        applied,
        accepted,
        pending
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleApply = (project) => {
    setSelectedProject(project);
    setShowApplicationModal(true);
  };

  const handleSubmitApplication = async (applicationData) => {
    try {
      await axios.post(
        `http://localhost:8001/api/publications/${selectedProject._id}/apply`,
        {
          ...applicationData,
          candidatId: freelanceId
        }
      );

      showToast("✓ Candidature envoyée avec succès !", "success");
      setShowApplicationModal(false);
      fetchData();
    } catch (error) {
      console.error("Error:", error);
      showToast(error.response?.data?.error || "Erreur lors de la candidature", "error");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      "En attente": "bg-yellow-100 text-yellow-800",
      "Acceptée": "bg-green-100 text-green-800",
      "Refusée": "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Tableau de bord Freelance</h1>
          <p className="text-gray-600">Trouvez des projets et développez votre activité</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Projets disponibles</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.available}</p>
              </div>
              <div className="text-4xl">📢</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Mes candidatures</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.applied}</p>
              </div>
              <div className="text-4xl">📝</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">En attente</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.pending}</p>
              </div>
              <div className="text-4xl">⏳</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Acceptées</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.accepted}</p>
              </div>
              <div className="text-4xl">✓</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("available")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === "available"
                ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            📢 Projets disponibles ({stats.available})
          </button>
          <button
            onClick={() => setActiveTab("applications")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === "applications"
                ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            📝 Mes candidatures ({stats.applied})
          </button>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === "available" ? (
            <motion.div
              key="available"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {availableProjects.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Aucun projet disponible pour le moment
                  </h3>
                  <p className="text-gray-600">
                    Revenez bientôt pour découvrir de nouvelles opportunités
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableProjects.map((project) => (
                    <ProjectCard
                      key={project._id}
                      project={project}
                      onApply={handleApply}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="applications"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {myApplications.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <div className="text-6xl mb-4">📭</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Aucune candidature
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Commencez à postuler aux projets disponibles
                  </p>
                  <button
                    onClick={() => setActiveTab("available")}
                    className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-700 transition-all transform hover:scale-105"
                  >
                    Voir les projets
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {myApplications.map((app) => (
                    <MyApplicationCard
                      key={app._id}
                      application={app}
                      getStatusColor={getStatusColor}
                      onViewContract={(contractId) => {
                        setSelectedContractId(contractId);
                        setShowContractModal(true);
                      }}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Application Modal */}
      <ApplicationModal
        project={selectedProject}
        isOpen={showApplicationModal}
        onClose={() => setShowApplicationModal(false)}
        onSubmit={handleSubmitApplication}
      />

      {/* Contract View Modal */}
      {showContractModal && selectedContractId && (
        <ContractView
          contractId={selectedContractId}
          userId={freelanceId}
          userType="freelance"
          onClose={() => {
            setShowContractModal(false);
            setSelectedContractId(null);
          }}
        />
      )}

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
