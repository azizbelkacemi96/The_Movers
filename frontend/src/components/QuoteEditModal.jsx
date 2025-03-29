import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import { toast } from "react-toastify";

Modal.setAppElement("#root");

const QuoteEditModal = ({ quote, onClose, onUpdate }) => {
  const [formData, setFormData] = useState(quote);

  useEffect(() => {
    setFormData(quote);
  }, [quote]);

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
    const payload = { ...formData, totalHT, totalTVA, totalTTC };

    try {
      const res = await axios.put(
        `http://localhost:8080/quote/${formData.id}`,
        payload
      );
      toast.success("✅ Quote updated successfully");
      onUpdate(res.data);
      onClose();
    } catch (err) {
      console.error("❌ Error updating quote:", err);
      toast.error("❌ Failed to update quote.");
    }
  };

  if (!formData) return null;

  return (
    <Modal
      isOpen={true}
      onRequestClose={onClose}
      className="bg-white p-6 max-w-2xl mx-auto mt-20 rounded shadow-lg z-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40"
    >
      <h2 className="text-xl font-bold mb-4">✏️ Edit Quote</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            name="client_name"
            placeholder="Client name"
            value={formData.client_name}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <input
            name="client_address"
            placeholder="Address"
            value={formData.client_address}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <input
            name="client_city"
            placeholder="City"
            value={formData.client_city}
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

        <h3 className="font-semibold mt-4">Services</h3>
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
              placeholder="Price"
              value={p.prix}
              onChange={(e) => handlePrestChange(i, "prix", e.target.value)}
              className="p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={p.quantite}
              onChange={(e) =>
                handlePrestChange(i, "quantite", e.target.value)
              }
              className="p-2 border rounded"
            />
            <div className="flex items-center justify-between">
              <span>{(p.prix * p.quantite).toFixed(2)} €</span>
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

        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={addPrestation}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            ➕ Add service
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded"
          >
            💾 Save changes
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default QuoteEditModal;
