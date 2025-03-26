import React, { useEffect, useState } from "react";
import api from "../api";
import Modal from "react-modal";
import * as XLSX from "xlsx";

Modal.setAppElement("#root");

const Finance = () => {
  const [investissements, setInvestissements] = useState([]);
  const [form, setForm] = useState({ nom: "", montant: "", date: "", categorie: "" });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedInvestissement, setSelectedInvestissement] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const investissementsParPage = 5;

  const totalPages = Math.ceil(investissements.length / investissementsParPage);
  const indexOfLast = currentPage * investissementsParPage;
  const indexOfFirst = indexOfLast - investissementsParPage;
  const investissementsPage = investissements.slice(indexOfFirst, indexOfLast);

  const fetchInvestissements = () => {
    api.get("/finance").then((res) => setInvestissements(res.data)).catch(console.error);
  };

  useEffect(() => {
    fetchInvestissements();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    api.post("/finance", form)
      .then(() => {
        fetchInvestissements();
        setForm({ nom: "", montant: "", date: "", categorie: "" });
      })
      .catch(console.error);
  };

  const handleDelete = (id) => {
    api.delete(`/finance/${id}`)
      .then(fetchInvestissements)
      .catch(console.error);
  };

  const handleEditClick = (item) => {
    setSelectedInvestissement(item);
    setEditModalOpen(true);
  };

  const handleEditSave = () => {
    api.put(`/finance/${selectedInvestissement.id}`, selectedInvestissement)
      .then(() => {
        fetchInvestissements();
        setEditModalOpen(false);
      })
      .catch(console.error);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(investissements);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Investissements");
    XLSX.writeFile(wb, "investissements.xlsx");
  };

  const totalMontant = investissements.reduce((acc, cur) => acc + Number(cur.montant), 0);

  const totalParPersonne = investissements.reduce((acc, inv) => {
    if (!inv.nom) return acc;
    acc[inv.nom] = (acc[inv.nom] || 0) + Number(inv.montant);
    return acc;
  }, {});

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">💼 Finance</h1>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">➕ Ajouter un investissement</h2>
        <form onSubmit={handleAdd} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <input name="nom" value={form.nom} onChange={handleChange} placeholder="👤 Nom de l'investisseur" className="border p-2 rounded" />
          <input name="montant" value={form.montant} onChange={handleChange} placeholder="💰 Montant (€)" type="number" className="border p-2 rounded" />
          <input name="date" value={form.date} onChange={handleChange} placeholder="📅 Date" type="date" className="border p-2 rounded" />
          <input name="categorie" value={form.categorie} onChange={handleChange} placeholder="🗂️ Catégorie" className="border p-2 rounded" />
          <button type="submit" className="bg-green-600 text-white col-span-2 md:col-span-1 px-4 py-2 rounded">Ajouter</button>
        </form>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <p className="font-medium">💶 Total des investissements : <strong>{totalMontant.toFixed(2)} €</strong></p>
        <button onClick={exportToExcel} className="bg-blue-500 text-white px-4 py-2 rounded">📊 Export Excel</button>
      </div>

      {/* Récap par investisseur */}
      <div className="mb-6 bg-yellow-50 border border-yellow-300 rounded p-4">
        <h3 className="font-semibold mb-2">📊 Répartition par investisseur :</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {Object.entries(totalParPersonne).map(([nom, total]) => (
            <li key={nom} className="flex justify-between">
              <span>👤 {nom}</span>
              <span className="font-medium">{total.toFixed(2)} €</span>
            </li>
          ))}
        </ul>
      </div>

      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">👤 Nom</th>
            <th className="border p-2">💰 Montant</th>
            <th className="border p-2">📅 Date</th>
            <th className="border p-2">🗂️ Catégorie</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {investissementsPage.map((inv) => (
            <tr key={inv.id} className="text-center">
              <td className="border p-2">{inv.nom}</td>
              <td className="border p-2">{inv.montant} €</td>
              <td className="border p-2">{inv.date}</td>
              <td className="border p-2">{inv.categorie}</td>
              <td className="border p-2 flex justify-center gap-2">
                <button onClick={() => handleEditClick(inv)} className="bg-yellow-400 px-2 py-1 rounded text-white">✏ Modifier</button>
                <button onClick={() => handleDelete(inv.id)} className="bg-red-500 px-2 py-1 rounded text-white">🗑 Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-2">
        {Array.from({ length: totalPages }, (_, idx) => (
          <button
            key={idx + 1}
            onClick={() => setCurrentPage(idx + 1)}
            className={`px-3 py-1 rounded border ${currentPage === idx + 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      {/* Modal d'édition */}
      <Modal
        isOpen={editModalOpen}
        onRequestClose={() => setEditModalOpen(false)}
        className="bg-white p-6 max-w-lg mx-auto mt-20 rounded shadow-lg z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40"
      >
        <h2 className="text-xl font-bold mb-4">✏️ Modifier l'investissement</h2>
        {selectedInvestissement && (
          <div className="grid grid-cols-2 gap-4">
            <input
              name="nom"
              value={selectedInvestissement.nom}
              onChange={(e) =>
                setSelectedInvestissement({ ...selectedInvestissement, nom: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              name="montant"
              type="number"
              value={selectedInvestissement.montant}
              onChange={(e) =>
                setSelectedInvestissement({ ...selectedInvestissement, montant: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              name="date"
              type="date"
              value={selectedInvestissement.date}
              onChange={(e) =>
                setSelectedInvestissement({ ...selectedInvestissement, date: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              name="categorie"
              value={selectedInvestissement.categorie}
              onChange={(e) =>
                setSelectedInvestissement({ ...selectedInvestissement, categorie: e.target.value })
              }
              className="border p-2 rounded"
            />
            <div className="col-span-2 flex justify-between mt-4">
              <button
                onClick={() => setEditModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Annuler
              </button>
              <button
                onClick={handleEditSave}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Enregistrer
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Finance;
