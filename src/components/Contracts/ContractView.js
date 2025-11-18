import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';

const ContractView = ({ contractId, userId, userType, onClose }) => {
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [showSignModal, setShowSignModal] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  useEffect(() => {
    fetchContract();
  }, [contractId]);

  const fetchContract = async () => {
    try {
      const response = await axios.get(`http://localhost:8001/api/contrats/${contractId}`);
      setContract(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching contract:', error);
      setLoading(false);
    }
  };

  const handleSign = async () => {
    if (!acceptTerms) {
      alert('Veuillez accepter les termes du contrat');
      return;
    }

    setSigning(true);
    try {
      const response = await axios.put(`http://localhost:8001/api/contrats/${contractId}/sign`, {
        userId,
        userType,
        ipAddress: 'client-ip', // In production, get from backend
        userAgent: navigator.userAgent
      });

      setContract(response.data.contrat);
      setShowSignModal(false);
      setAcceptTerms(false);
      alert('Contrat signé avec succès!');
    } catch (error) {
      console.error('Error signing contract:', error);
      alert('Erreur lors de la signature');
    } finally {
      setSigning(false);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let y = 20;

    // Title
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('CONTRAT DE PRESTATION', pageWidth / 2, y, { align: 'center' });
    y += 15;

    // Contract details
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(`Titre: ${contract.titre}`, margin, y);
    y += 10;
    doc.text(`Montant: ${contract.montantTotal} ${contract.devise}`, margin, y);
    y += 10;
    doc.text(`Délai: ${contract.delaiJours} jours`, margin, y);
    y += 10;
    doc.text(`Statut: ${contract.statut}`, margin, y);
    y += 15;

    // Parties
    doc.setFont(undefined, 'bold');
    doc.text('PARTIES:', margin, y);
    y += 8;
    doc.setFont(undefined, 'normal');
    doc.text(`Client: ${contract.clientId?.nom || ''} ${contract.clientId?.prenom || ''}`, margin, y);
    y += 8;
    doc.text(`Freelancer: ${contract.freelanceId?.nom || ''} ${contract.freelanceId?.prenom || ''}`, margin, y);
    y += 15;

    // Terms
    doc.setFont(undefined, 'bold');
    doc.text('TERMES ET CONDITIONS:', margin, y);
    y += 8;
    doc.setFont(undefined, 'normal');
    const splitTerms = doc.splitTextToSize(contract.termes, pageWidth - 2 * margin);
    doc.text(splitTerms, margin, y);

    // Signatures
    if (contract.signatureClient.signed || contract.signatureFreelance.signed) {
      doc.addPage();
      y = 20;
      doc.setFont(undefined, 'bold');
      doc.text('SIGNATURES:', margin, y);
      y += 10;

      if (contract.signatureClient.signed) {
        doc.setFont(undefined, 'normal');
        doc.text(`Client signé le: ${new Date(contract.signatureClient.date).toLocaleString()}`, margin, y);
        y += 8;
      }

      if (contract.signatureFreelance.signed) {
        doc.text(`Freelancer signé le: ${new Date(contract.signatureFreelance.date).toLocaleString()}`, margin, y);
      }
    }

    doc.save(`Contrat_${contract._id}.pdf`);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du contrat...</p>
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md">
          <h3 className="text-xl font-bold text-red-600 mb-4">Contrat introuvable</h3>
          <button
            onClick={onClose}
            className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  const isClient = userType === 'client';
  const isFreelance = userType === 'freelance';
  const hasSigned = isClient ? contract.signatureClient.signed : contract.signatureFreelance.signed;
  const otherPartySigned = isClient ? contract.signatureFreelance.signed : contract.signatureClient.signed;
  const fullyActive = contract.statut === 'Actif' || contract.statut === 'En cours';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">Contrat de Prestation</h2>
              <p className="text-blue-100">Réf: {contract._id}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Status Badge */}
          <div className="mb-6">
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
              contract.statut === 'Actif' ? 'bg-green-100 text-green-800' :
              contract.statut === 'Brouillon' ? 'bg-yellow-100 text-yellow-800' :
              contract.statut === 'Terminé' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {contract.statut}
            </span>
          </div>

          {/* Contract Details */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-bold text-gray-700 mb-3">📄 Détails du Projet</h3>
              <p className="font-semibold text-lg mb-2">{contract.titre}</p>
              <p className="text-gray-600 text-sm">{contract.description}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-bold text-gray-700 mb-3">💰 Conditions Financières</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Montant Total:</span>
                  <span className="font-bold text-lg">{contract.montantTotal} {contract.devise}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Délai:</span>
                  <span className="font-semibold">{contract.delaiJours} jours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date limite:</span>
                  <span className="text-sm">{new Date(contract.dateFinEstimee).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Parties */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="border-2 border-blue-200 rounded-xl p-4">
              <h3 className="font-bold text-gray-700 mb-3">👤 Client</h3>
              <p className="font-semibold">{contract.clientId?.nom} {contract.clientId?.prenom}</p>
              <p className="text-sm text-gray-600">{contract.clientId?.email}</p>
              {contract.signatureClient.signed ? (
                <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-700 font-semibold text-sm">✓ Signé</p>
                  <p className="text-xs text-green-600">
                    {new Date(contract.signatureClient.date).toLocaleString()}
                  </p>
                </div>
              ) : (
                <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-yellow-700 font-semibold text-sm">⏳ En attente de signature</p>
                </div>
              )}
            </div>

            <div className="border-2 border-purple-200 rounded-xl p-4">
              <h3 className="font-bold text-gray-700 mb-3">👨‍💻 Freelancer</h3>
              <p className="font-semibold">{contract.freelanceId?.nom} {contract.freelanceId?.prenom}</p>
              <p className="text-sm text-gray-600">{contract.freelanceId?.email}</p>
              <p className="text-sm text-purple-600 font-medium">{contract.freelanceId?.specialite}</p>
              {contract.signatureFreelance.signed ? (
                <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-700 font-semibold text-sm">✓ Signé</p>
                  <p className="text-xs text-green-600">
                    {new Date(contract.signatureFreelance.date).toLocaleString()}
                  </p>
                </div>
              ) : (
                <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-yellow-700 font-semibold text-sm">⏳ En attente de signature</p>
                </div>
              )}
            </div>
          </div>

          {/* Milestones */}
          {contract.milestones && contract.milestones.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-gray-700 mb-3">🎯 Jalons de Paiement</h3>
              <div className="space-y-3">
                {contract.milestones.map((milestone, index) => (
                  <div key={milestone._id} className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">Jalon {index + 1}: {milestone.titre}</p>
                        <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">{milestone.montant} TND</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          milestone.statut === 'Payé' ? 'bg-green-100 text-green-700' :
                          milestone.statut === 'Complété' ? 'bg-blue-100 text-blue-700' :
                          milestone.statut === 'En cours' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {milestone.statut}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Terms */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-700 mb-3">📜 Termes et Conditions</h3>
            <div className="bg-gray-50 rounded-xl p-4 max-h-60 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">{contract.termes}</pre>
            </div>
          </div>

          {/* Signature Status */}
          {fullyActive && (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-6">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-bold text-green-800">Contrat Actif</p>
                  <p className="text-sm text-green-600">Les deux parties ont signé le contrat</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t p-6 bg-gray-50 rounded-b-2xl">
          <div className="flex flex-wrap gap-3 justify-end">
            <button
              onClick={exportToPDF}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Télécharger PDF
            </button>

            {!hasSigned && contract.statut === 'Brouillon' && (
              <button
                onClick={() => setShowSignModal(true)}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition flex items-center font-semibold"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Signer le Contrat
              </button>
            )}

            <button
              onClick={onClose}
              className="px-6 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Fermer
            </button>
          </div>
        </div>
      </motion.div>

      {/* Signature Modal */}
      <AnimatePresence>
        {showSignModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60] p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-8 max-w-lg w-full"
            >
              <h3 className="text-2xl font-bold mb-4">Signature Électronique</h3>
              
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  En signant ce contrat, vous acceptez tous les termes et conditions énoncés ci-dessus.
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Votre signature sera enregistrée avec votre adresse IP et la date/heure pour des raisons légales.
                  </p>
                </div>

                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-1 w-5 h-5 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    J'accepte les termes et conditions de ce contrat et je confirme que j'ai l'autorité pour signer au nom de ma partie.
                  </span>
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowSignModal(false);
                    setAcceptTerms(false);
                  }}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  disabled={signing}
                >
                  Annuler
                </button>
                <button
                  onClick={handleSign}
                  disabled={!acceptTerms || signing}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  {signing ? 'Signature...' : 'Confirmer la Signature'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContractView;
