import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// --- Projet Card (Pure Tailwind) ---
const ProjetCard = ({ projet, onPostuler }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="p-5 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-900">{projet.titre}</h3>
          <p className="text-gray-600 mt-2 leading-relaxed">
            {projet.description}
          </p>

          <div className="flex flex-wrap gap-3 mt-4 text-sm">
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
              Budget: {projet.budget} TND
            </span>

            {projet.specialiteRequise && (
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                Spécialité: {projet.specialiteRequise}
              </span>
            )}

            {projet.dateLimite && (
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">
                Date limite: {new Date(projet.dateLimite).toLocaleDateString()}
              </span>
            )}
          </div>

          <p className="mt-3 text-sm text-gray-500">
            Publié par : {projet.client?.nom} {projet.client?.prenom}
          </p>
        </div>

        <button
          onClick={() => onPostuler(projet)}
          className="ml-4 bg-blue-600 text-white px-5 py-2 rounded-xl shadow hover:bg-blue-700 transition font-medium"
        >
          Postuler
        </button>
      </div>
    </div>
  </motion.div>
);

// --- Candidature Card ---
const CandidatureCard = ({ item, getStatusColor }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <div className="p-5 bg-white border border-gray-200 rounded-2xl shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-gray-900">
          {item.publication.titre}
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
            item.candidature.statut
          )}`}
        >
          {item.candidature.statut}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-3 leading-relaxed">
        {item.candidature.message}
      </p>

      <div className="flex flex-wrap gap-6 text-sm">
        <div>
          <span className="font-medium text-gray-700">Votre prix:</span>
          <span className="ml-2 text-green-700 font-semibold">
            {item.candidature.prixPropose} TND
          </span>
        </div>
        <div>
          <span className="font-medium text-gray-700">Délai proposé:</span>
          <span className="ml-2 text-blue-700">
            {item.candidature.delaiPropose} jours
          </span>
        </div>
      </div>
    </div>
  </motion.div>
);

// --- Modal ---
const PostulerModal = ({
  projet,
  candidature,
  setCandidature,
  handlePostuler,
  onClose,
}) => (
  <motion.div
    className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{projet.titre}</h2>
          <p className="text-gray-600 mt-1">Budget: {projet.budget} TND</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
        >
          ×
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Votre proposition *
          </label>
          <textarea
            rows={5}
            value={candidature.message}
            onChange={(e) =>
              setCandidature({ ...candidature, message: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Expliquez pourquoi vous êtes le meilleur choix..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Votre prix (TND) *
            </label>
            <input
              type="number"
              value={candidature.prixPropose}
              onChange={(e) =>
                setCandidature({ ...candidature, prixPropose: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: 800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Délai (jours) *
            </label>
            <input
              type="number"
              value={candidature.delaiPropose}
              onChange={(e) =>
                setCandidature({ ...candidature, delaiPropose: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: 14"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-3">
          <button
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            onClick={handlePostuler}
          >
            Envoyer ma candidature
          </button>
          <button
            onClick={onClose}
            className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition"
          >
            Annuler
          </button>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

// --- Main Component ---
export default function DashboardFreelance() {
  const [projetsDisponibles, setProjetsDisponibles] = useState([]);
  const [mesCandidatures, setMesCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProjet, setSelectedProjet] = useState(null);
  const [activeTab, setActiveTab] = useState("projets");

  const freelanceId = localStorage.getItem("userId") || "demo_freelance_id";
  const [candidature, setCandidature] = useState({
    message: "",
    prixPropose: "",
    delaiPropose: "",
  });

  useEffect(() => {
    fetchProjets();
    fetchMesCandidatures();
  }, []);

  const fetchProjets = async () => {
    try {
      const res = await fetch(
        "http://localhost:8001/api/publications?statut=Ouvert"
      );
      const data = await res.json();
      setProjetsDisponibles(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMesCandidatures = async () => {
    try {

        const id = localStorage.getItem("userId");
        const freelanceId = id ;
        
        
      

      const res = await fetch(
        `http://localhost:8001/api/publications/freelance/${freelanceId}/candidatures`
      );

      const data = await res.json();
      console.log("CANDIDATURES:", data);

      setMesCandidatures(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setMesCandidatures([]); // fallback
    }
  };

const handlePostuler = async () => {
  if (
    !candidature.message ||
    !candidature.prixPropose ||
    !candidature.delaiPropose
  ) {
    alert("Veuillez remplir tous les champs obligatoires.");
    return;
  }

  // Payload matches backend expectations
  const payload = {
    candidatId: "691b179f8faa6fca9a7a2583",  // must be 'candidatId' as backend expects
    message: candidature.message,
    prixPropose: Number(candidature.prixPropose),
    delaiPropose: Number(candidature.delaiPropose),
  };

  try {
    const res = await fetch(
      `http://localhost:8001/api/publications/${selectedProjet._id}/apply`, // ID in URL
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Erreur lors de la candidature.");
    }

    // Reset state & refresh
    setSelectedProjet(null);
    setCandidature({ message: "", prixPropose: "", delaiPropose: "" });
    fetchMesCandidatures();
    alert("Candidature envoyée avec succès !");
  } catch (err) {
    console.error(err);
    alert(err.message || "Échec de l'envoi.");
  }
};


  const getStatusColor = (status) => {
    switch (status) {
      case "Acceptée":
        return "bg-green-100 text-green-700";
      case "Refusée":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-8 m-10 ">
      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b pb-2">
        <button
          onClick={() => setActiveTab("projets")}
          className={`pb-2 px-2 font-semibold transition ${
            activeTab === "projets"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-white-500"
          }`}
        >
          Projets disponibles
        </button>

        <button
          onClick={() => setActiveTab("candidatures")}
          className={`pb-2 px-2 font-semibold transition ${
            activeTab === "candidatures"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-white-500"
          }`}
        >
          Mes candidatures
        </button>
      </div>

      {/* LOADER */}
      {loading && <p className="text-gray-600">Chargement...</p>}

      {/* PROJETS DISPONIBLES */}
      {activeTab === "projets" && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projetsDisponibles.length === 0 ? (
            <p className="text-gray-500 col-span-full text-center">
              Aucun projet disponible pour le moment.
            </p>
          ) : (
            projetsDisponibles.map((projet) => (
              <ProjetCard
                key={projet._id}
                projet={projet}
                onPostuler={setSelectedProjet}
              />
            ))
          )}
        </div>
      )}

      {/* MES CANDIDATURES */}
      {activeTab === "candidatures" && !loading && (
        <div className="space-y-5">
          {mesCandidatures.length === 0 ? (
            <p className="text-gray-500 text-center">
              Vous n'avez postulé à aucun projet.
            </p>
          ) : (
            mesCandidatures.map((item) => (
              <CandidatureCard
                key={item.candidature._id}
                item={item}
                getStatusColor={getStatusColor}
              />
            ))
          )}
        </div>
      )}

      {/* MODAL */}
      {selectedProjet && (
        <PostulerModal
          projet={selectedProjet}
          candidature={candidature}
          setCandidature={setCandidature}
          handlePostuler={handlePostuler}
          onClose={() => setSelectedProjet(null)}
        />
      )}
    </div>
  );
}
