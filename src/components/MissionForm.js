import React, { useState } from "react";
import api from "../api";

const MissionForm = ({ onMissionAdded }) => {
  const [mission, setMission] = useState({
    type: "Déménagement",
    client: "",
    adresse: "",
    date: "",
    prixHT: "",
    prixTTC: "",
    employe: "",
    salaire: "",
    charges: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...mission, [name]: value };

    // ✅ Calcul TTC = HT * 1.2
    const prixHT = parseFloat(updated.prixHT) || 0;
    updated.prixTTC = (prixHT * 1.2).toFixed(2);

    setMission(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/missions", mission);
      onMissionAdded();
      setMission({
        type: "Déménagement",
        client: "",
        adresse: "",
        date: "",
        prixHT: "",
        prixTTC: "",
        employe: "",
        salaire: "",
        charges: "",
      });
    } catch (err) {
      console.error("Erreur ajout mission:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded bg-white shadow mb-6">
      <h2 className="text-lg font-bold mb-4">📝 Ajouter une mission</h2>

      <div className="grid grid-cols-2 gap-4">
        <select
          name="type"
          value={mission.type}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="Déménagement">Déménagement</option>
          <option value="Livraison">Livraison</option>
        </select>

        <input
          type="text"
          name="client"
          value={mission.client}
          onChange={handleChange}
          placeholder="Nom du client"
          className="border p-2 rounded"
        />

        <input
          type="text"
          name="adresse"
          value={mission.adresse}
          onChange={handleChange}
          placeholder="Adresse"
          className="border p-2 rounded"
        />

        <input
          type="date"
          name="date"
          value={mission.date}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="number"
          name="prixHT"
          value={mission.prixHT}
          onChange={handleChange}
          placeholder="Prix HT (€)"
          className="border p-2 rounded"
        />

        <input
          type="text"
          value={mission.prixTTC}
          readOnly
          placeholder="Prix TTC (€)"
          className="border p-2 rounded bg-gray-100"
        />

        <input
          type="text"
          name="employe"
          value={mission.employe}
          onChange={handleChange}
          placeholder="Nom de l'employé"
          className="border p-2 rounded"
        />

        <input
          type="number"
          name="salaire"
          value={mission.salaire}
          onChange={handleChange}
          placeholder="Salaire (€)"
          className="border p-2 rounded"
        />

        <input
          type="number"
          name="charges"
          value={mission.charges}
          onChange={handleChange}
          placeholder="Charges (€)"
          className="border p-2 rounded"
        />
      </div>

      <div className="mt-4 text-right">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Enregistrer
        </button>
      </div>
    </form>
  );
};

export default MissionForm;
