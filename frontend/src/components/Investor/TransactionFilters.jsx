import React from "react";

const TransactionFilters = ({ filters, setFilters, onReset, onExport }) => {
  return (
    <div className="bg-white border shadow-sm rounded p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-md font-semibold">🔍 Filter Transactions</h2>
        <button
          onClick={onExport}
          className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
        >
          📤 Export Excel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
        <select
          value={filters.type}
          onChange={(e) =>
            setFilters({ ...filters, type: e.target.value })
          }
          className="border px-3 py-2 rounded"
        >
          <option value="">All Types</option>
          <option value="deposit">Deposit</option>
          <option value="withdrawal">Withdrawal</option>
        </select>

        <input
          type="text"
          placeholder="Category"
          className="border px-3 py-2 rounded"
          value={filters.category}
          onChange={(e) =>
            setFilters({ ...filters, category: e.target.value })
          }
        />

        <input
          type="date"
          className="border px-3 py-2 rounded"
          value={filters.start}
          onChange={(e) =>
            setFilters({ ...filters, start: e.target.value })
          }
        />

        <input
          type="date"
          className="border px-3 py-2 rounded"
          value={filters.end}
          onChange={(e) =>
            setFilters({ ...filters, end: e.target.value })
          }
        />

        <button
          onClick={onReset}
          className="bg-gray-200 px-4 py-2 rounded text-sm"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default TransactionFilters;
