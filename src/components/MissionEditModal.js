import React, { useState, useEffect } from "react";

function MissionEditModal({ mission, isOpen, onClose, onSave }) {
  const [editedMission, setEditedMission] = useState(mission || {});

  useEffect(() => {
    if (mission) {
      setEditedMission(mission);
    }
  }, [mission]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedMission({ ...editedMission, [name]: value });
  };

  const handleSubmit = () => {
    onSave(editedMission);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-1/3">
        <h2 className="text-xl font-semibold mb-4">Modifier la Mission</h2>

        <label className="block mb-2">Type :</label>
        <select name="type" value={editedMission.type || ""} onChange={handleChange} className="border px-3 py-2 w-full mb-4">
          <option value="Déménagement">Déménagement</option>
          <option value="Livraison">Livraison</option>
        </select>

        <label className="block mb-2">Date :</label>
        <input type="date" name="date" value={editedMission.date || ""} onChange={handleChange} className="border px-3 py-2 w-full mb-4"/>

        <label className="block mb-2">Client :</label>
        <input name="client" value={editedMission.client || ""} onChange={handleChange} className="border px-3 py-2 w-full mb-4"/>

        <label className="block mb-2">Prix HT (€) :</label>
        <input type="number" step="0.01" name="prixHT" value={editedMission.prixHT || ""} onChange={handleChange} className="border px-3 py-2 w-full mb-4"/>

        <label className="block mb-2">Employé :</label>
        <input name="employe" value={editedMission.employe || ""} onChange={handleChange} className="border px-3 py-2 w-full mb-4"/>

        <label className="block mb-2">Salaire (€) :</label>
        <input type="number" step="0.01" name="salaire" value={editedMission.salaire || ""} onChange={handleChange} className="border px-3 py-2 w-full mb-4"/>

        <label className="block mb-2">Charges (€) :</label>
        <input type="number" step="0.01" name="charges" value={editedMission.charges || ""} onChange={handleChange} className="border px-3 py-2 w-full mb-4"/>

        <div className="flex justify-end gap-4">
          <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">Enregistrer</button>
          <button onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded">Annuler</button>
        </div>
      </div>
    </div>
  );
}

export default MissionEditModal;
