import React, { useState, useEffect } from 'react';
import InvestissementEditModal from './InvestissementEditModal';

function Finance() {
  const [solde, setSolde] = useState(0);
  const [investissements, setInvestissements] = useState([]);
  const [newInvestissement, setNewInvestissement] = useState({
    associe: 'Aziz', montant: '', motif: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentInvestissement, setCurrentInvestissement] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewInvestissement({ ...newInvestissement, [name]: value });
  };

  const addInvestissement = () => {
    if (!newInvestissement.associe || !newInvestissement.montant || !newInvestissement.motif) {
      alert("Veuillez remplir tous les champs.");
      return;
    }
    const montant = parseFloat(newInvestissement.montant);
    if (isNaN(montant) || montant <= 0) {
      alert("Veuillez entrer un montant valide.");
      return;
    }
    setInvestissements([...investissements, { ...newInvestissement, montant }]);
    setNewInvestissement({ associe: 'Aziz', montant: '', motif: '' });
  };

  const editInvestissement = (index) => {
    setCurrentInvestissement({ ...investissements[index], index });
    setIsModalOpen(true);
  };

  const handleSaveInvestissement = (updatedInvestissement) => {
    const updatedInvestissements = investissements.map((inv, index) =>
      index === updatedInvestissement.index ? updatedInvestissement : inv
    );
    setInvestissements(updatedInvestissements);
    setIsModalOpen(false);
  };

  const deleteInvestissement = (index) => {
    setInvestissements(investissements.filter((_, i) => i !== index));
  };

  const totalInvestiParAssocie = (nom) => investissements
    .filter(inv => inv.associe === nom)
    .reduce((total, inv) => total + inv.montant, 0).toFixed(2);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center my-4">💰 Suivi Financier</h1>

      <div className="bg-white shadow p-4 rounded-lg mb-8">
        <label className="font-semibold">Solde Actuel (€) :</label>
        <input type="number" className="border rounded px-3 py-2 w-full mt-2"
          value={solde} onChange={(e) => setSolde(parseFloat(e.target.value) || 0)}
        />
      </div>

      <div className="bg-white shadow p-4 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Ajouter un Investissement</h2>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <select name="associe" className="border rounded px-3 py-2"
            onChange={handleChange} value={newInvestissement.associe}
          >
            <option>Aziz</option>
            <option>Koussi</option>
          </select>
          <input type="number" name="montant" placeholder="Montant (€)"
            className="border rounded px-3 py-2"
            onChange={handleChange} value={newInvestissement.montant}
          />
          <input type="text" name="motif" placeholder="Motif"
            className="border rounded px-3 py-2"
            onChange={handleChange} value={newInvestissement.motif}
          />
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={addInvestissement}>Ajouter</button>
      </div>

      <div className="bg-white shadow p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Historique des Investissements</h2>
        <table className="min-w-full table-auto border">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2">Associé</th>
              <th className="px-4 py-2">Montant (€)</th>
              <th className="px-4 py-2">Motif</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {investissements.map((inv, idx) => (
              <tr key={idx} className="text-center border-b hover:bg-gray-100">
                <td className="px-4 py-2">{inv.associe}</td>
                <td className="px-4 py-2">{inv.montant.toFixed(2)} €</td>
                <td className="px-4 py-2">{inv.motif}</td>
                <td className="px-4 py-2">
                  <button className="bg-green-500 text-white px-2 py-1 rounded mr-2" onClick={() => editInvestissement(idx)}>Modifier</button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => deleteInvestissement(idx)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <InvestissementEditModal
        investissement={currentInvestissement}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveInvestissement}
      />
    </div>
  );
}

export default Finance;
