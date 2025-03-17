import React, { useState } from 'react';

function Finance() {
  const [solde, setSolde] = useState(0);
  const [investissements, setInvestissements] = useState([]);
  const [newInvestissement, setNewInvestissement] = useState({
    associe: 'Aziz', // Par défaut "Aziz"
    montant: '',
    motif: '',
  });

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
    setNewInvestissement({ associe: 'Aziz', montant: '', motif: '' }); // Réinitialisation du formulaire
  };

  const totalInvestiParAssocie = (nom) => {
    return investissements
      .filter(inv => inv.associe === nom)
      .reduce((total, inv) => total + inv.montant, 0)
      .toFixed(2);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center my-4">💰 Suivi Financier</h1>
      
      {/* Solde Actuel */}
      <div className="bg-white shadow p-4 rounded-lg mb-8">
        <label className="font-semibold">Solde Actuel (€) :</label>
        <input
          type="number"
          className="border rounded px-3 py-2 w-full mt-2"
          value={solde}
          onChange={(e) => setSolde(parseFloat(e.target.value) || 0)}
        />
      </div>

      {/* Ajouter un investissement */}
      <div className="bg-white shadow p-4 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Ajouter un Investissement</h2>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* Liste déroulante pour sélectionner l'associé */}
          <select
            name="associe"
            className="border rounded px-3 py-2"
            onChange={handleChange}
            value={newInvestissement.associe}
          >
            <option value="Aziz">Aziz</option>
            <option value="Koussi">Koussi</option>
          </select>

          <input
            type="number"
            name="montant"
            placeholder="Montant (€)"
            className="border rounded px-3 py-2"
            onChange={handleChange}
            value={newInvestissement.montant}
          />

          <input
            type="text"
            name="motif"
            placeholder="Motif"
            className="border rounded px-3 py-2"
            onChange={handleChange}
            value={newInvestissement.motif}
          />
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={addInvestissement}>
          Ajouter
        </button>
      </div>

      {/* Historique des investissements */}
      <div className="bg-white shadow p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Historique des Investissements</h2>
        <table className="min-w-full table-auto border">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2">Associé</th>
              <th className="px-4 py-2">Montant (€)</th>
              <th className="px-4 py-2">Motif</th>
            </tr>
          </thead>
          <tbody>
            {investissements.length > 0 ? (
              investissements.map((inv, index) => (
                <tr key={index} className="text-center border-b hover:bg-gray-100">
                  <td className="px-4 py-2">{inv.associe}</td>
                  <td className="px-4 py-2">{inv.montant.toFixed(2)} €</td>
                  <td className="px-4 py-2">{inv.motif}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-4">
                  Aucun investissement enregistré.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Total Investi par Associé */}
      <div className="bg-white shadow p-4 rounded-lg mt-4">
        <h2 className="text-xl font-semibold mb-4">Total Investi par Associé</h2>
        <p>💼 <strong>Aziz :</strong> {totalInvestiParAssocie('Aziz')} €</p>
        <p>💼 <strong>Koussi :</strong> {totalInvestiParAssocie('Koussi')} €</p>
      </div>
    </div>
  );
}

export default Finance;
