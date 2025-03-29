import React, { useState } from "react";
import api from "../../api";
import { toast } from "react-toastify";
import { TransactionEditModal } from "./InvestorEditModals";

const ITEMS_PER_PAGE = 10;

const TransactionTable = ({ transactions, onDelete }) => {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [editingTransaction, setEditingTransaction] = useState(null);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const deleteTransaction = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    try {
      await api.delete(`/transactions/${id}`);
      toast.success("Transaction deleted");
      onDelete();
    } catch {
      toast.error("Delete failed");
    }
  };

  const sorted = [...transactions].sort((a, b) => {
    const aVal = a[sortBy] ?? "";
    const bVal = b[sortBy] ?? "";
    if (typeof aVal === "number") {
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    } else {
      return sortOrder === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    }
  });

  const pageData = sorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);

  const SortIcon = (col) => {
    if (sortBy !== col) return "⇅";
    return sortOrder === "asc" ? "↑" : "↓";
  };

  return (
    <>
      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            {["date", "type", "amount", "category"].map((col) => (
              <th
                key={col}
                className="px-3 py-2 cursor-pointer select-none"
                onClick={() => handleSort(col)}
              >
                {col.charAt(0).toUpperCase() + col.slice(1)} {SortIcon(col)}
              </th>
            ))}
            <th className="px-3 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pageData.map((tx) => (
            <tr key={tx.id} className="border-t hover:bg-gray-50">
              <td className="px-3 py-2">{tx.date}</td>
              <td className="px-3 py-2">
                <span
                  className={`px-2 py-1 rounded text-white ${
                    tx.type === "deposit" ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {tx.type}
                </span>
              </td>
              <td className="px-3 py-2">€{tx.amount.toFixed(2)}</td>
              <td className="px-3 py-2">{tx.category || "-"}</td>
              <td className="px-3 py-2 text-right space-x-2">
                <button
                  onClick={() => setEditingTransaction(tx)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ✏️
                </button>
                <button
                  onClick={() => deleteTransaction(tx.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
          {pageData.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center text-gray-400 py-4">
                No transactions
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-center items-center gap-4 mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          « Prev
        </button>
        <span>
          Page {page} / {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next »
        </button>
      </div>

      {editingTransaction && (
        <TransactionEditModal
          transaction={editingTransaction}
          onClose={() => setEditingTransaction(null)}
          onUpdated={onDelete}
        />
      )}
    </>
  );
};

export default TransactionTable;