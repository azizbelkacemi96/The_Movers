import React, { useState, useEffect } from 'react';
import api from '../api';

function MissionEditModal({ mission, isOpen, onClose, onSave }) {
  const [form, setForm] = useState({
    type: '',
    date: '',
    client: '',
    prixHT: '',
    prixTTC: '',
    employe: '',
    salaire: '',
    charges: ''
  });

  useEffect(() => {
    if (mission) setForm(mission);
  }, [mission]);

  const handleChange = ({ target: { name, value } }) => {
    let updatedForm = { ...form, [name]: value };
    if (name === 'prixHT') {
      updatedForm.prixTTC = ((parseFloat(value) || 0) * 1.2).toFixed(2);
    }
    setForm(updatedForm);
  };

  const handleSave = () => {
    api.put(`/missions/${form.id}`, form)
      .then(() => onSave())
      .catch(err => console.error(err));
  };

  if (!isOpen || !mission) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Modifier la Mission</h2>

        <select name="type" value={form.type} className="border rounded px-3 py-2 w-full mb-2" onChange={handleChange}>
          <option>Déménagement</option>
          <option>Livraison</option>
        </select>
        <input type="date" name="date" value={form.date} className="border rounded px-3 py-2 w-full mb-2" onChange={handleChange} />
        <input name="client" value={form.client} placeholder="Client" className="border rounded px-3 py-2 w-full mb-2" onChange={handleChange} />
        <input name="prixHT" type="number" value={form.prixHT} placeholder="Prix HT (€)" className="border rounded px-3 py-2 w-full mb-2" onChange={handleChange} />
        <input name="prixTTC" type="number" value={form.prixTTC} readOnly placeholder="Prix TTC (€)" className="border rounded px-3 py-2 bg-gray-100 w-full mb-2" />
        <input name="employe" value={form.employe} placeholder="Employé" className="border rounded px-3 py-2 w-full mb-2" onChange={handleChange} />
        <input name="salaire" type="number" value={form.salaire} placeholder="Salaire (€)" className="border rounded px-3 py-2 w-full mb-2" onChange={handleChange} />
        <input name="charges" type="number" value={form.charges} placeholder="Charges (€)" className="border rounded px-3 py-2 w-full mb-2" onChange={handleChange} />

        <div className="mt-4 flex justify-end space-x-2">
          <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={onClose}>Annuler</button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSave}>Enregistrer</button>
        </div>
      </div>
    </div>
  );
}

export default MissionEditModal;
