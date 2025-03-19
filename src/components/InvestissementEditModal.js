import React, { useState, useEffect } from "react";

function InvestissementEditModal({ investissement, isOpen, onClose, onSave }) {
  const [editedInvestissement, setEditedInvestissement] = useState(investissement || {});

  useEffect(() => {
    if (investissement) {
      setEditedInvestissement(investissement);
    }
  }, [investissement]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedInvestissement({ ...editedInvestissement, [name]: value });
  };

  const handleSubmit = () => {
    onSave({
      ...editedInvestissement,
      montant: parseFloat(editedInvestissement.montant),
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-1/3">
        <h2 className="text-xl font-semibold mb-4">Modifier l'investissement</h2>

        <label className="block mb-2">Associé :</label>
        <select name="associe" value={editedInvestissement.associe || ""} onChange={handleChange} className="border px-3 py-2 w-full mb-4">
          <option>Aziz</option>
          <option>Koussi</option>
        </select>

        <label className="block mb-2">Montant (€) :</label>
        <input type="number" step="0.01" name="montant" value={editedInvestissement.montant || ""} onChange={handleChange} className="border px-3 py-2 w-full mb-4"/>

        <label className="block mb-2">Motif :</label>
        <input name="motif" value={editedInvestissement.motif || ""} onChange={handleChange} className="border px-3 py-2 w-full mb-4"/>

        <div className="flex justify-end gap-4">
          <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">Enregistrer</button>
          <button onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded">Annuler</button>
        </div>
      </div>
    </div>
  );
}

export default InvestissementEditModal;
