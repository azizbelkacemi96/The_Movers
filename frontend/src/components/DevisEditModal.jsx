import React, { useState, useEffect } from "react";
import axios from "axios";

const DevisEditModal = ({ devis, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    client_nom: "",
    client_adresse: "",
    client_ville: "",
    date: "",
    prestations: [],
  });

  // Charger les données du devis à éditer
  useEffect(() => {
    setFormData({
      client_nom: devis.client_nom,
      client_adresse: devis.client_adresse,
      client_ville: devis.client_ville,
      date: devis.date,
      prestations: Array.isArray(devis.prestations)
        ? devis.prestations
        : JSON.parse(devis.prestations),
    });
  }, [devis]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePrestChange = (index, field, value) => {
    const newPrestations = [...formData.prestations];
    newPrestations[index][field] =
      field === "prix" || field === "quantite" ? parseFloat(value) : value;
    newPrestations[index].total =
      newPrestations[index].prix * newPrestations[index].quantite;
    setFormData({ ...formData, prestations: newPrestations });
  };

  const calculateTotals = () => {
    const totalHT = formData.prestations.reduce(
      (sum, p) => sum + p.prix * p.quantite,
      0
    );
    const totalTVA = totalHT * 0.2;
    const totalTTC = totalHT + totalTVA;
    return { totalHT, totalTVA, totalTTC };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { totalHT, totalTVA, totalTTC } = calculateTotals();

    const payload = {
      ...formData,
      totalHT,
      totalTVA,
      totalTTC,
    };

    try {
      const res = await axios.put(
        `http://localhost:5000/devis/${devis.id}`,
        payload
      );
      onUpdate({ ...payload, id: devis.id });
      onClose();
    } catch (err) {
      console.error("❌ Erreur mise à jour :", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded w-full max-w-3xl shadow-lg relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-xl font-bold text-red-600"
        >
          ✖
        </button>

        <h2 className="text-2xl font-semibold mb-4">✏️ Modifier le devis</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="client_nom"
              placeholder="Nom du client"
              value={formData.client_nom}
              onChange={handleChange}
              className="p-2 border rounded"
            />
            <input
              name="client_adresse"
              placeholder="Adresse"
              value={formData.client_adresse}
              onChange={handleChange}
              className="p-2 border rounded"
            />
            <input
              name="client_ville"
              placeholder="Ville"
              value={formData.client_ville}
              onChange={handleChange}
              className="p-2 border rounded"
            />
            <input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className="p-2 border rounded"
            />
          </div>

          <h3 className="font-semibold mt-4">Prestations</h3>
          {formData.prestations.map((p, i) => (
            <div
              key={i}
              className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2"
            >
              <input
                placeholder="Description"
                value={p.description}
                onChange={(e) =>
                  handlePrestChange(i, "description", e.target.value)
                }
                className="p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Prix"
                value={p.prix}
                onChange={(e) => handlePrestChange(i, "prix", e.target.value)}
                className="p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Quantité"
                value={p.quantite}
                onChange={(e) =>
                  handlePrestChange(i, "quantite", e.target.value)
                }
                className="p-2 border rounded"
              />
              <div className="flex items-center justify-between">
                <span>{p.total?.toFixed(2)} € HT</span>
              </div>
            </div>
          ))}

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded"
            >
              ✅ Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DevisEditModal;
