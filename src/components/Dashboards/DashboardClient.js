import React, { useState, useEffect } from "react";
import axios from "axios";

// Toast notification component
const Toast = ({ message, type, onClose }) => (
  <div
    className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
      type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
    }`}
  >
    <div className="flex items-center gap-2">
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 text-white hover:text-gray-200">
        ×
      </button>
    </div>
  </div>
);

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm p-6">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      ))}
    </div>
  </div>
);

export default function DashboardClient() {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewProject, setShowNewProject] = useState(false);
  const [toast, setToast] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const clientId = localStorage.getItem("userId"); // À adapter

  const [newProject, setNewProject] = useState({
    titre: "",
    description: "",
    budget: "",
    specialiteRequise: "",
    dateLimite: "",
  });

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8001/api/publications/client/${clientId}`
      );
      setPublications(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Erreur:", error);
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!newProject.titre.trim()) errors.titre = "Le titre est requis";
    if (!newProject.description.trim())
      errors.description = "La description est requise";
    if (!newProject.budget || newProject.budget <= 0)
      errors.budget = "Budget invalide";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.post("http://localhost:8001/api/publications", {
        ...newProject,
        clientId,
      });

      showToast("Projet créé avec succès !");
      setShowNewProject(false);
      setNewProject({
        titre: "",
        description: "",
        budget: "",
        specialiteRequise: "",
        dateLimite: "",
      });
      setFormErrors({});
      fetchPublications();
    } catch (error) {
      console.error("Erreur:", error);
      showToast("Erreur lors de la création du projet", "error");
    }
  };

  const handleAcceptCandidature = async (publicationId, candidatureId) => {
    try {
      await axios.put(
        `http://localhost:8001/api/publications/${publicationId}/candidatures/${candidatureId}/accept`,
        { clientId }
      );

      showToast("Candidature acceptée !");
      fetchPublications();
    } catch (error) {
      console.error("Erreur:", error);
      showToast("Erreur lors de l'acceptation", "error");
    }
  };

  const getStatusColor = (statut) => {
    switch (statut) {
      case "Ouvert":
        return "bg-blue-100 text-blue-800";
      case "En cours":
        return "bg-yellow-100 text-yellow-800";
      case "Terminé":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Dashboard Client
              </h1>
              <p className="text-gray-600 mt-6">
                Gérez vos projets et candidatures
              </p>
            </div>
            <button
              onClick={() => setShowNewProject(!showNewProject)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              + Nouveau Projet
            </button>
          </div>
        </div>

        {/* Formulaire nouveau projet */}
        {showNewProject && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 mt-6">
              Créer un nouveau projet
            </h2>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre du projet *
                </label>
                <input
                  type="text"
                  required
                  value={newProject.titre}
                  onChange={(e) =>
                    setNewProject({ ...newProject, titre: e.target.value })
                  }
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.titre ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Ex: Développement d'un site e-commerce"
                />
                {formErrors.titre && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.titre}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      description: e.target.value,
                    })
                  }
                  rows="4"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.description
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Décrivez votre projet en détail..."
                />
                {formErrors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget (TND) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newProject.budget}
                    onChange={(e) =>
                      setNewProject({ ...newProject, budget: e.target.value })
                    }
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.budget ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="1000"
                  />
                  {formErrors.budget && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.budget}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Spécialité requise
                  </label>
                  <select
                    value={newProject.specialiteRequise}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        specialiteRequise: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner...</option>
                    <option value="Développement Web">Développement Web</option>
                    <option value="Développement Mobile">
                      Développement Mobile
                    </option>
                    <option value="Design">Design</option>
                    <option value="Marketing Digital">Marketing Digital</option>
                    <option value="Rédaction">Rédaction</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date limite
                  </label>
                  <input
                    type="date"
                    value={newProject.dateLimite}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        dateLimite: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Créer le projet
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewProject(false)}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Liste des publications */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Mes Projets ({publications.length})
          </h2>

          {publications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <p className="text-gray-500 text-lg">
                Aucun projet pour le moment
              </p>
              <p className="text-gray-400 mt-2">
                Créez votre premier projet pour commencer
              </p>
            </div>
          ) : (
            publications.map((pub) => (
              <div key={pub._id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">
                      {pub.titre}
                    </h3>
                    <p className="text-gray-600 mt-2">{pub.description}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      pub.statut
                    )}`}
                  >
                    {pub.statut}
                  </span>
                </div>

                <div className="flex gap-6 text-sm text-gray-600 mb-4">
                  <div>
                    <span className="font-medium">Budget:</span> {pub.budget}{" "}
                    TND
                  </div>
                  {pub.specialiteRequise && (
                    <div>
                      <span className="font-medium">Spécialité:</span>{" "}
                      {pub.specialiteRequise}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Candidatures:</span>{" "}
                    {pub.candidatures.length}
                  </div>
                </div>

                {/* Candidatures */}
                {pub.candidatures.length > 0 && (
                  <div className="mt-4 border-t pt-4">
                    <h4 className="font-bold text-gray-900 mb-3">
                      Candidatures reçues ({pub.candidatures.length})
                    </h4>
                    <div className="space-y-3">
                      {pub.candidatures.map((cand) => (
                        <div
                          key={cand._id}
                          className="bg-gray-50 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">
                                {cand.candidatId?.nom} {cand.candidatId?.prenom}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {cand.message}
                              </p>
                              <div className="flex gap-4 mt-2 text-sm">
                                <span className="text-green-600 font-medium">
                                  Prix: {cand.prixPropose} TND
                                </span>
                                <span className="text-blue-600 font-medium">
                                  Délai: {cand.delaiPropose} jours
                                </span>
                              </div>
                            </div>
                            {pub.statut === "Ouvert" &&
                              cand.statut === "En attente" && (
                                <button
                                  onClick={() =>
                                    handleAcceptCandidature(pub._id, cand._id)
                                  }
                                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm"
                                >
                                  Accepter
                                </button>
                              )}
                            {cand.statut === "Acceptée" && (
                              <span className="text-green-600 font-medium text-sm">
                                ✓ Acceptée
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
