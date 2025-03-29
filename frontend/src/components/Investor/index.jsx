import React, { useEffect, useState } from "react";
import InvestorDashboardCard from "./InvestorDashboardCard";
import InvestorList from "./InvestorList";
import TransactionFilters from "./TransactionFilters";
import TransactionForm from "./TransactionForm";
import TransactionTable from "./TransactionTable";
import { exportToExcel } from "./utils";
import api from "../../api";
import { toast } from "react-toastify";

const InvestorPage = () => {
  const [investors, setInvestors] = useState([]);
  const [selected, setSelected] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({
    type: "",
    category: "",
    start: "",
    end: "",
  });

  const fetchInvestors = async (selectedId = null) => {
    const res = await api.get("/investors");
    setInvestors(res.data);
    if (selectedId) {
      const updated = res.data.find((i) => i.id === selectedId);
      if (updated) setSelected(updated);
    }
  };

  const fetchTransactions = async (id) => {
    const res = await api.get(`/transactions/${id}`);
    setTransactions(res.data);
  };

  const handleSelectInvestor = (inv) => {
    setSelected(inv);
    fetchTransactions(inv.id);
  };

  const handleTransactionChange = () => {
    if (selected) {
      fetchTransactions(selected.id);
      fetchInvestors(selected.id);
    }
  };

  const handleResetFilters = () => {
    setFilters({ type: "", category: "", start: "", end: "" });
    toast.info("Filters reset");
  };

  useEffect(() => {
    fetchInvestors();
  }, []);

  const filteredTransactions = transactions.filter((tx) => {
    const matchType = filters.type ? tx.type === filters.type : true;
    const matchCategory = filters.category
      ? tx.category?.toLowerCase().includes(filters.category.toLowerCase())
      : true;
    const txDate = new Date(tx.date);
    const matchStart = filters.start ? txDate >= new Date(filters.start) : true;
    const matchEnd = filters.end ? txDate <= new Date(filters.end) : true;
    return matchType && matchCategory && matchStart && matchEnd;
  });

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Investor Dashboard</h1>
      <InvestorList
        investors={investors}
        onSelect={handleSelectInvestor}
        selectedId={selected?.id}
        onUpdated={() => fetchInvestors(selected?.id)}
      />

      {selected && (
        <>
          <InvestorDashboardCard investor={selected} />

          <TransactionForm
            investorId={selected.id}
            onSaved={handleTransactionChange}
          />

          <TransactionFilters
            filters={filters}
            setFilters={setFilters}
            onReset={handleResetFilters}
            onExport={() => exportToExcel(filteredTransactions)}
          />
          
          <TransactionTable
            transactions={filteredTransactions}
            onDelete={handleTransactionChange}
          />
        </>
      )}
    </div>
  );
};

export default InvestorPage;
