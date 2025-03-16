import React, { useState, useEffect } from 'react';

function MissionForm({ addMission, missionToEdit, updateMission, cancelEdit }) {
  const initialForm = { type: 'Déménagement', date: '', client: '', prixHT: '', prixTTC: '', employe: '', salaire: '', charges: '', resultatHT: 0, resultatTTC: 0 };
  const [mission, setMission] = useState(initialForm);

  useEffect(() => {
    if (missionToEdit) {
      setMission(missionToEdit);
    } else {
      setMission(initialForm);
    }
  }, [missionToEdit]);

  useEffect(() => {
    if (!missionToEdit) {
      setMission((prevMission) => {
        const prixHT = parseFloat(prevMission.prixHT || 0);
        const salaire = parseFloat(prevMission.salaire || 0);
        const charges = parseFloat(prevMission.charges || 0);
      
        return {
          ...prevMission,
          prixTTC: (prixHT * 1.20).toFixed(2),
          resultatHT: (prixHT - salaire - charges).toFixed(2),
          resultatTTC: (prixHT * 1.20 - salaire - charges).toFixed(2),
        };
      });
    }
  }, [mission.prixHT, mission.salaire, mission.charges]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMission({
      ...mission,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (missionToEdit) {
      updateMission(mission);
    } else {
      addMission(mission);
    }
    setMission(initialForm);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow p-5 rounded-lg mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        {missionToEdit ? 'Modifier la Mission' : 'Ajouter une Mission'}
      </h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <select
          name="type"
          value={mission.type}
          onChange={handleChange}
          className="border rounded px-3 py-2"
          required
        >
          <option value="Déménagement">Déménagement</option>
          <option value="Livraison">Livraison</option>
        </select>

        <input
          type="date"
          name="date"
          value={mission.date}
          onChange={handleChange}
          className="border rounded px-3 py-2"
          required
        />

        <input
          name="client"
          value={mission.client}
          onChange={handleChange}
          placeholder="Client"
          className="border rounded px-3 py-2"
          required
        />

        <input
          type="number"
          step="0.01"
          name="prixHT"
          value={mission.prixHT}
          onChange={handleChange}
          placeholder="Prix HT (€)"
          className="border rounded px-3 py-2"
          required
        />

        <input
          name="employe"
          value={mission.employe}
          onChange={handleChange}
          placeholder="Employé"
          className="border rounded px-3 py-2"
          required
        />

        <input
          type="number"
          step="0.01"
          name="salaire"
          value={mission.salaire}
          onChange={handleChange}
          placeholder="Salaire (€)"
          className="border rounded px-3 py-2"
          required
        />

        <input
          type="number"
          step="0.01"
          name="charges"
          value={mission.charges}
          onChange={handleChange}
          placeholder="Charges (€)"
          className="border rounded px-3 py-2"
          required
        />

        <div className="col-span-2 bg-gray-100 border rounded px-3 py-2">
          <strong>Prix TTC (HT + TVA 20%) : </strong>{mission.prixTTC} €
        </div>

        <div className="col-span-2 bg-gray-100 border rounded px-3 py-2">
          <strong>Résultat HT (Prix HT - Salaire - Charges) : </strong>{mission.resultatHT} €
        </div>

        <div className="col-span-2 bg-gray-100 border rounded px-3 py-2">
          <strong>Résultat TTC (Prix TTC - Salaire - Charges) : </strong>{mission.resultatTTC} €
        </div>
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        {missionToEdit ? 'Modifier' : 'Ajouter'}
      </button>

      {missionToEdit && (
        <button
          type="button"
          onClick={cancelEdit}
          className="bg-gray-400 ml-2 text-white px-4 py-2 rounded"
        >
          Annuler
        </button>
      )}
    </form>
  );
}

export default MissionForm;