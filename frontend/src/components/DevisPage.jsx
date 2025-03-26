import React, { useState, useEffect } from "react";
import axios from "axios";
import DevisEditModal from "./DevisEditModal";

const DevisPage = () => {
  const [devisList, setDevisList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDevis, setSelectedDevis] = useState(null);

  const [formData, setFormData] = useState({
    client_nom: "",
    client_adresse: "",
    client_ville: "",
    date: "",
    prestations: [{ description: "", prix: 0, quantite: 1, total: 0 }],
  });

  const fetchDevis = async () => {
    try {
      const res = await axios.get("http://localhost:5000/devis");
      setDevisList(res.data);
    } catch (err) {
      console.error("Erreur lors du fetch des devis :", err);
    }
  };

  useEffect(() => {
    fetchDevis();
  }, []);

  const calculateTotals = () => {
    const totalHT = formData.prestations.reduce(
      (sum, p) => sum + p.prix * p.quantite,
      0
    );
    const totalTVA = totalHT * 0.2;
    const totalTTC = totalHT + totalTVA;
    return { totalHT, totalTVA, totalTTC };
  };

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

  const addPrestation = () => {
    setFormData({
      ...formData,
      prestations: [
        ...formData.prestations,
        { description: "", prix: 0, quantite: 1, total: 0 },
      ],
    });
  };

  const removePrestation = (index) => {
    const newPrestations = [...formData.prestations];
    newPrestations.splice(index, 1);
    setFormData({ ...formData, prestations: newPrestations });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { totalHT, totalTVA, totalTTC } = calculateTotals();
    const payload = { ...formData, totalHT, totalTVA, totalTTC };

    try {
      await axios.post("http://localhost:5000/devis", payload);
      fetchDevis();
      resetForm();
    } catch (err) {
      console.error("Erreur lors de l'envoi du devis :", err);
    }
  };

  const resetForm = () => {
    setFormData({
      client_nom: "",
      client_adresse: "",
      client_ville: "",
      date: "",
      prestations: [{ description: "", prix: 0, quantite: 1, total: 0 }],
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/devis/${id}`);
      setDevisList((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error("Erreur suppression devis :", err);
    }
  };

  const handleEditClick = (devis) => {
    setSelectedDevis(devis);
    setShowModal(true);
  };

  const handleEditSubmit = (updatedDevis) => {
    setDevisList((prev) =>
      prev.map((d) => (d.id === updatedDevis.id ? updatedDevis : d))
    );
    setShowModal(false);
  };

  const viewPDF = (id) => {
    window.open(`http://localhost:5000/devis/generate/${id}`, "_blank");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">🧾 Gestion des Devis</h1>

      {/* Création formulaire */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-gray-100 p-6 rounded shadow-md"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

        <h2 className="font-semibold mt-4">Prestations</h2>
        {formData.prestations.map((p, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
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
              <span>{p.total.toFixed(2)} € HT</span>
              <button
                type="button"
                onClick={() => removePrestation(i)}
                className="text-red-600"
              >
                ❌
              </button>
            </div>
          </div>
        ))}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={addPrestation}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            ➕ Ajouter prestation
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded"
          >
            💾 Enregistrer le devis
          </button>
        </div>
      </form>

      {/* 📋 Liste des devis */}
      <hr className="my-6" />
      <h2 className="text-xl font-semibold mb-2">📋 Liste des devis</h2>
      <table className="w-full table-auto border-collapse border border-gray-300 text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-3 py-2">ID</th>
            <th className="border px-3 py-2">Nom</th>
            <th className="border px-3 py-2">Adresse</th>
            <th className="border px-3 py-2">Ville</th>
            <th className="border px-3 py-2">Date</th>
            <th className="border px-3 py-2">TTC</th>
            <th className="border px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {devisList.map((devis) => (
            <tr key={devis.id}>
              <td className="border px-3 py-1">{devis.id}</td>
              <td className="border px-3 py-1">{devis.client_nom}</td>
              <td className="border px-3 py-1">{devis.client_adresse}</td>
              <td className="border px-3 py-1">{devis.client_ville}</td>
              <td className="border px-3 py-1">{devis.date}</td>
              <td className="border px-3 py-1">
                {devis.totalTTC?.toFixed(2)} €
              </td>
              <td className="border px-3 py-1 flex justify-center gap-2">
                <button
                  onClick={() => viewPDF(devis.id)}
                  className="text-blue-600"
                >
                  👁️
                </button>
                <button
                  onClick={() => handleEditClick(devis)}
                  className="text-yellow-600"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(devis.id)}
                  className="text-red-600"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal d'édition */}
      {showModal && selectedDevis && (
        <DevisEditModal
          devis={selectedDevis}
          onClose={() => setShowModal(false)}
          onUpdate={handleEditSubmit}
        />
      )}
    </div>
  );
};

export default DevisPage;
