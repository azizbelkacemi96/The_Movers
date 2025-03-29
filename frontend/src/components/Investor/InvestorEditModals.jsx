import React, { useState } from "react";
import api from "../../api";
import { toast } from "react-toastify";

export const InvestorEditModal = ({ investor, onClose, onUpdated }) => {
  const [name, setName] = useState(investor.name);

  const updateInvestor = async () => {
    try {
      await api.put(`/investors/${investor.id}`, { name });
      toast.success("Investor updated");
      onUpdated();
      onClose();
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Investor</h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border px-3 py-2 w-full rounded mb-4"
        />
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={updateInvestor}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export const TransactionEditModal = ({ transaction, onClose, onUpdated }) => {
  const [form, setForm] = useState({
    type: transaction.type,
    amount: transaction.amount,
    date: transaction.date,
    category: transaction.category || "",
  });

  const updateTransaction = async () => {
    try {
      await api.put(`/transactions/${transaction.id}`, {
        investor_id: transaction.investor_id,
        ...form,
      });
      toast.success("Transaction updated");
      onUpdated();
      onClose();
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Transaction</h2>

        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="border px-2 py-2 rounded w-full mb-2"
        >
          <option value="deposit">Deposit</option>
          <option value="withdrawal">Withdrawal</option>
        </select>

        <input
          type="number"
          placeholder="Amount"
          className="border px-2 py-2 rounded w-full mb-2"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) })}
        />

        <input
          type="date"
          className="border px-2 py-2 rounded w-full mb-2"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        <input
          type="text"
          placeholder="Category (optional)"
          className="border px-2 py-2 rounded w-full mb-4"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={updateTransaction}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
