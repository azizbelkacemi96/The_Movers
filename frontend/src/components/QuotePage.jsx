import React, { useState, useEffect } from "react";
import axios from "axios";
import QuoteEditModal from "./QuoteEditModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const QuotePage = () => {
  const [quotes, setQuotes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);

  const [formData, setFormData] = useState({
    client_name: "",
    client_address: "",
    client_city: "",
    date: "",
    prestations: [{ description: "", prix: 0, quantite: 1, total: 0 }],
  });

  const fetchQuotes = async () => {
    try {
      const res = await axios.get("http://localhost:8080/quote");
      setQuotes(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch quotes:", err);
      toast.error("❌ Failed to load quotes.");
    }
  };

  useEffect(() => {
    fetchQuotes();
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
      await axios.post("http://localhost:8080/quote", payload);
      toast.success("✅ Quote created successfully");
      fetchQuotes();
      resetForm();
    } catch (err) {
      console.error("❌ Error creating quote:", err);
      toast.error("❌ Failed to create quote.");
    }
  };

  const resetForm = () => {
    setFormData({
      client_name: "",
      client_address: "",
      client_city: "",
      date: "",
      prestations: [{ description: "", prix: 0, quantite: 1, total: 0 }],
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/quote/${id}`);
      setQuotes((prev) => prev.filter((q) => q.id !== id));
      toast.success("🗑️ Quote deleted");
    } catch (err) {
      console.error("❌ Error deleting quote:", err);
      toast.error("❌ Failed to delete quote.");
    }
  };

  const handleEditClick = (quote) => {
    setSelectedQuote(quote);
    setShowModal(true);
  };

  const handleEditSubmit = (updatedQuote) => {
    setQuotes((prev) =>
      prev.map((q) => (q.id === updatedQuote.id ? updatedQuote : q))
    );
    setShowModal(false);
  };

  const viewPDF = (id) => {
    window.open(`http://localhost:8080/quote/generate/${id}`, "_blank");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ToastContainer position="top-right" autoClose={4000} />
      <h1 className="text-3xl font-bold mb-4">🧾 Quote Management</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-gray-100 p-6 rounded shadow-md"
      >
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

        <h2 className="font-semibold mt-4">Services</h2>
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
              <span>{p.total.toFixed(2)} € excl. VAT</span>
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
            ➕ Add service
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded"
          >
            💾 Save quote
          </button>
        </div>
      </form>

      <hr className="my-6" />
      <h2 className="text-xl font-semibold mb-2">📋 Quotes list</h2>
      <table className="w-full table-auto border-collapse border border-gray-300 text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-3 py-2">ID</th>
            <th className="border px-3 py-2">Client</th>
            <th className="border px-3 py-2">Address</th>
            <th className="border px-3 py-2">City</th>
            <th className="border px-3 py-2">Date</th>
            <th className="border px-3 py-2">Total (TTC)</th>
            <th className="border px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {quotes.map((quote) => (
            <tr key={quote.id}>
              <td className="border px-3 py-1">{quote.id}</td>
              <td className="border px-3 py-1">{quote.client_name}</td>
              <td className="border px-3 py-1">{quote.client_address}</td>
              <td className="border px-3 py-1">{quote.client_city}</td>
              <td className="border px-3 py-1">{quote.date}</td>
              <td className="border px-3 py-1">
                {quote.totalTTC?.toFixed(2)} €
              </td>
              <td className="border px-3 py-1 flex justify-center gap-2">
                <button
                  onClick={() => viewPDF(quote.id)}
                  className="text-blue-600"
                >
                  👁️
                </button>
                <button
                  onClick={() => handleEditClick(quote)}
                  className="text-yellow-600"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(quote.id)}
                  className="text-red-600"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && selectedQuote && (
        <QuoteEditModal
          quote={selectedQuote}
          onClose={() => setShowModal(false)}
          onUpdate={handleEditSubmit}
        />
      )}
    </div>
  );
};

export default QuotePage;
