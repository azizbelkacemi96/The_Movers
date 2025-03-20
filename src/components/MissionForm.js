import React, { useState } from 'react';
import api from '../api';

function MissionForm({ onMissionAdded }) {
  const [mission, setMission] = useState({
    type: 'Déménagement', date: '', client: '', prixHT: '', prixTTC: '', employe: '', salaire: '', charges: ''
  });

  const handleChange = ({ target: { name, value } }) => {
    const updatedMission = { ...mission, [name]: value };
    if (name === 'prixHT') {
      updatedMission.prixTTC = ((parseFloat(value) || 0) * 1.2).toFixed(2);
    }
    setMission(updatedMission);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post('/missions', mission).then(() => {
      onMissionAdded();
      setMission({ type: 'Déménagement', date: '', client: '', prixHT: '', prixTTC: '', employe: '', salaire: '', charges: '' });
    });
  };

  return (
    <form className="grid grid-cols-2 gap-4 bg-white p-4 shadow rounded-lg" onSubmit={handleSubmit}>
      <select name="type" value={mission.type} className="border rounded px-3 py-2" onChange={handleChange}>
        <option>Déménagement</option>
        <option>Livraison</option>
      </select>
      <input name="date" type="date" value={mission.date} className="border rounded px-3 py-2" onChange={handleChange} required />
      <input name="client" placeholder="Client" value={mission.client} className="border rounded px-3 py-2" onChange={handleChange} required />
      <input name="prixHT" type="number" placeholder="Prix HT (€)" value={mission.prixHT} className="border rounded px-3 py-2" onChange={handleChange} required />
      <input name="prixTTC" type="number" placeholder="Prix TTC (€)" value={mission.prixTTC} readOnly className="border rounded px-3 py-2 bg-gray-100" />
      <input name="employe" placeholder="Employé" value={mission.employe} className="border rounded px-3 py-2" onChange={handleChange} required />
      <input name="salaire" type="number" placeholder="Salaire (€)" value={mission.salaire} className="border rounded px-3 py-2" onChange={handleChange} required />
      <input name="charges" type="number" placeholder="Charges (€)" value={mission.charges} className="border rounded px-3 py-2" onChange={handleChange} required />
      <button type="submit" className="col-span-2 bg-blue-500 hover:bg-blue-700 text-white py-2 rounded-lg">Ajouter la Mission</button>
    </form>
  );
}

export default MissionForm;
