import React, { useState } from "react";
import api from "../../api";
import { toast } from "react-toastify";
import { InvestorEditModal } from "./InvestorEditModals";

const InvestorList = ({ investors, selected, onSelect, refresh }) => {
  const [name, setName] = useState("");
  const [editingInvestor, setEditingInvestor] = useState(null);

  const addInvestor = async () => {
    if (!name.trim()) return;
    try {
      await api.post("/investors", { name });
      toast.success("Investor added");
      setName("");
      refresh();
    } catch {
      toast.error("Add investor failed");
    }
  };

  const deleteInvestor = async (id) => {
    if (!window.confirm("Delete this investor?")) return;
    try {
      await api.delete(`/investors/${id}`);
      toast.success("Investor deleted");
      refresh();
    } catch {
      toast.error("Delete investor failed");
    }
  };

  return (
    <div className="mb-6">
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="New investor name"
          className="border px-3 py-2 rounded w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={addInvestor} className="bg-blue-600 text-white px-4 py-2 rounded">
          Add
        </button>
      </div>

      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-3 py-2 text-left">Name</th>
            <th className="px-3 py-2 text-right">Deposits</th>
            <th className="px-3 py-2 text-right">Withdrawals</th>
            <th className="px-3 py-2 text-right">Balance</th>
            <th className="px-3 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {investors.map((inv) => (
            <tr key={inv.id} className="border-t">
              <td className="px-3 py-2">{inv.name}</td>
              <td className="px-3 py-2 text-right">€{inv.totalDeposits.toFixed(2)}</td>
              <td className="px-3 py-2 text-right">€{inv.totalWithdrawals.toFixed(2)}</td>
              <td className="px-3 py-2 text-right font-semibold">€{inv.balance.toFixed(2)}</td>
              <td className="px-3 py-2 text-right space-x-2">
                <button
                  onClick={() => onSelect(inv)}
                  className={`px-2 py-1 rounded text-sm ${
                    selected?.id === inv.id ? "bg-green-700 text-white" : "bg-green-500 text-white"
                  }`}
                >
                  Select
                </button>
                <button
                  onClick={() => setEditingInvestor(inv)}
                  className="bg-yellow-400 text-white px-2 py-1 rounded text-sm"
                >
                  ✏️
                </button>
                <button
                  onClick={() => deleteInvestor(inv.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingInvestor && (
        <InvestorEditModal
          investor={editingInvestor}
          onClose={() => setEditingInvestor(null)}
          onUpdated={refresh}
        />
      )}
    </div>
  );
};

export default InvestorList;