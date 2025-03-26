import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import api from "../api";

Modal.setAppElement("#root");

const MissionEditModal = ({ isOpen, onClose, mission, onSave }) => {
  const [form, setForm] = useState({});

  useEffect(() => {
    setForm(mission || {});
  }, [mission]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...form, [name]: value };

    // Calcul automatique TTC
    const prixHT = parseFloat(updated.prixHT) || 0;
    updated.prixTTC = (prixHT * 1.2).toFixed(2);

    setForm(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/missions/${form.id}`, form);
      onSave();
    } catch (err) {
      console.error("Erreur modification mission :", err);
    }
  };

  if (!isOpen || !mission) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Modifier Mission"
      className="bg-white p-6 max-w-xl mx-auto mt-20 rounded shadow-lg relative z-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-40 z-40 flex justify-center items-start"
    >
      <h2 className="text-xl font-bold mb-4">✏️ Modifier la mission</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <select name="type" value={form.type || ""} onChange={handleChange} className="border p-2 rounded">
          <option value="Déménagement">Déménagement</option>
          <option value="Livraison">Livraison</option>
        </select>

        <input
          type="text"
          name="client"
          value={form.client || ""}
          onChange={handleChange}
          placeholder="Client"
          className="border p-2 rounded"
        />

        <input
          type="text"
          name="adresse"
          value={form.adresse || ""}
          onChange={handleChange}
          placeholder="Adresse"
          className="border p-2 rounded"
        />

        <input
          type="date"
          name="date"
          value={form.date || ""}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="number"
          name="prixHT"
          value={form.prixHT || ""}
          onChange={handleChange}
          placeholder="Prix HT"
          className="border p-2 rounded"
        />

        <input
          type="text"
          value={form.prixTTC || ""}
          readOnly
          placeholder="Prix TTC"
          className="border p-2 rounded bg-gray-100"
        />

        <input
          type="text"
          name="employe"
          value={form.employe || ""}
          onChange={handleChange}
          placeholder="Employé"
          className="border p-2 rounded"
        />

        <input
          type="number"
          name="salaire"
          value={form.salaire || ""}
          onChange={handleChange}
          placeholder="Salaire"
          className="border p-2 rounded"
        />

        <input
          type="number"
          name="charges"
          value={form.charges || ""}
          onChange={handleChange}
          placeholder="Charges"
          className="border p-2 rounded"
        />

        <div className="col-span-2 flex justify-between mt-4">
          <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">
            Annuler
          </button>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Enregistrer
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default MissionEditModal;
