import React, { useState } from "react";
import api from "../../api";
import { toast } from "react-toastify";

const TransactionForm = ({ investorId, onSaved }) => {
  const [form, setForm] = useState({
    type: "deposit",
    amount: "",
    date: "",
    category: "",
  });

  const selectType = (type) => {
    setForm((prev) => ({ ...prev, type }));
  };

  const submit = async () => {
    if (!form.amount || !form.date) return toast.warn("Amount & date required");
    try {
      await api.post("/transactions", {
        investor_id: investorId,
        ...form,
      });
      toast.success("Transaction added");
      onSaved();
      setForm({ type: "deposit", amount: "", date: "", category: "" });
    } catch {
      toast.error("Add transaction failed");
    }
  };

  return (
    <div className="bg-white border rounded p-4 mb-6 shadow-sm">
      <h2 className="text-md font-semibold mb-3">➕ Add Transaction</h2>

      <div className="flex gap-3 mb-4">
        <button
          className={`flex-1 px-4 py-2 rounded ${
            form.type === "deposit"
              ? "bg-green-600 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
          onClick={() => selectType("deposit")}
        >
          💰 Deposit
        </button>
        <button
          className={`flex-1 px-4 py-2 rounded ${
            form.type === "withdrawal"
              ? "bg-red-600 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
          onClick={() => selectType("withdrawal")}
        >
          💸 Withdrawal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="number"
          placeholder="Amount"
          className="border px-3 py-2 rounded"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) })}
        />
        <input
          type="date"
          className="border px-3 py-2 rounded"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
        <input
          type="text"
          placeholder="Category (optional)"
          className="border px-3 py-2 rounded"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
      </div>

      <div className="mt-4 text-right">
        <button
          onClick={submit}
          className={`px-4 py-2 rounded text-white ${
            form.type === "deposit" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          Add {form.type === "deposit" ? "Deposit" : "Withdrawal"}
        </button>
      </div>
    </div>
  );
};

export default TransactionForm;
