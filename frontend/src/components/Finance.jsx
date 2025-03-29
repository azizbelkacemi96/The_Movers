import React, { useEffect, useState } from "react";
import api from "../api";
import Modal from "react-modal";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

Modal.setAppElement("#root");

const Finance = () => {
  const [investments, setInvestments] = useState([]);
  const [form, setForm] = useState({ name: "", amount: "", date: "", category: "" });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(investments.length / itemsPerPage);
  const currentItems = investments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const fetchInvestments = () => {
    api.get("/finance")
      .then((res) => setInvestments(res.data))
      .catch((err) => {
        console.error("Error fetching investments:", err);
        toast.error("❌ Failed to fetch investments.");
      });
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    api.post("/finance", form)
      .then(() => {
        fetchInvestments();
        setForm({ name: "", amount: "", date: "", category: "" });
        toast.success("✅ Investment added successfully.");
      })
      .catch((err) => {
        console.error("Error adding investment:", err);
        toast.error("❌ Failed to add investment.");
      });
  };

  const handleDelete = (id) => {
    api.delete(`/finance/${id}`)
      .then(() => {
        fetchInvestments();
        toast.success("🗑️ Investment deleted.");
      })
      .catch((err) => {
        console.error("Error deleting investment:", err);
        toast.error("❌ Failed to delete investment.");
      });
  };

  const handleEditClick = (item) => {
    setSelectedInvestment(item);
    setEditModalOpen(true);
  };

  const handleEditSave = () => {
    api.put(`/finance/${selectedInvestment.id}`, selectedInvestment)
      .then(() => {
        fetchInvestments();
        setEditModalOpen(false);
        toast.success("✅ Investment updated.");
      })
      .catch((err) => {
        console.error("Error updating investment:", err);
        toast.error("❌ Failed to update investment.");
      });
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(investments);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Investments");
    XLSX.writeFile(wb, "investments.xlsx");
  };

  const totalAmount = investments.reduce((acc, cur) => acc + Number(cur.amount), 0);

  const amountByPerson = investments.reduce((acc, inv) => {
    if (!inv.name) return acc;
    acc[inv.name] = (acc[inv.name] || 0) + Number(inv.amount);
    return acc;
  }, {});

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">💼 Finance</h1>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">➕ Add Investment</h2>
        <form onSubmit={handleAdd} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <input name="name" value={form.name} onChange={handleChange} placeholder="👤 Investor name" className="border p-2 rounded" />
          <input name="amount" value={form.amount} onChange={handleChange} placeholder="💰 Amount (€)" type="number" className="border p-2 rounded" />
          <input name="date" value={form.date} onChange={handleChange} placeholder="📅 Date" type="date" className="border p-2 rounded" />
          <input name="category" value={form.category} onChange={handleChange} placeholder="🗂️ Category" className="border p-2 rounded" />
          <button type="submit" className="bg-green-600 text-white col-span-2 md:col-span-1 px-4 py-2 rounded">Add</button>
        </form>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <p className="font-medium">💶 Total investments: <strong>{totalAmount.toFixed(2)} €</strong></p>
        <button onClick={exportToExcel} className="bg-blue-500 text-white px-4 py-2 rounded">📊 Export Excel</button>
      </div>

      <div className="mb-6 bg-yellow-50 border border-yellow-300 rounded p-4">
        <h3 className="font-semibold mb-2">📊 Breakdown by investor:</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {Object.entries(amountByPerson).map(([name, total]) => (
            <li key={name} className="flex justify-between">
              <span>👤 {name}</span>
              <span className="font-medium">{total.toFixed(2)} €</span>
            </li>
          ))}
        </ul>
      </div>

      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">👤 Name</th>
            <th className="border p-2">💰 Amount</th>
            <th className="border p-2">📅 Date</th>
            <th className="border p-2">🗂️ Category</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((inv) => (
            <tr key={inv.id} className="text-center">
              <td className="border p-2">{inv.name}</td>
              <td className="border p-2">{inv.amount} €</td>
              <td className="border p-2">{inv.date}</td>
              <td className="border p-2">{inv.category}</td>
              <td className="border p-2 flex justify-center gap-2">
                <button onClick={() => handleEditClick(inv)} className="bg-yellow-400 px-2 py-1 rounded text-white">✏ Edit</button>
                <button onClick={() => handleDelete(inv.id)} className="bg-red-500 px-2 py-1 rounded text-white">🗑 Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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

      <Modal
        isOpen={editModalOpen}
        onRequestClose={() => setEditModalOpen(false)}
        className="bg-white p-6 max-w-lg mx-auto mt-20 rounded shadow-lg z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40"
      >
        <h2 className="text-xl font-bold mb-4">✏️ Edit Investment</h2>
        {selectedInvestment && (
          <div className="grid grid-cols-2 gap-4">
            <input
              name="name"
              value={selectedInvestment.name}
              onChange={(e) =>
                setSelectedInvestment({ ...selectedInvestment, name: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              name="amount"
              type="number"
              value={selectedInvestment.amount}
              onChange={(e) =>
                setSelectedInvestment({ ...selectedInvestment, amount: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              name="date"
              type="date"
              value={selectedInvestment.date}
              onChange={(e) =>
                setSelectedInvestment({ ...selectedInvestment, date: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              name="category"
              value={selectedInvestment.category}
              onChange={(e) =>
                setSelectedInvestment({ ...selectedInvestment, category: e.target.value })
              }
              className="border p-2 rounded"
            />
            <div className="col-span-2 flex justify-between mt-4">
              <button
                onClick={() => setEditModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Finance;
