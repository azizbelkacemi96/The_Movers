import React, { useEffect, useState } from "react";
import api from "../api";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

const HomeDashboard = () => {
  const [missions, setMissions] = useState([]);
  const [investors, setInvestors] = useState([]);

  useEffect(() => {
    api.get("/missions").then((res) => setMissions(res.data)).catch(console.error);
    api.get("/investors").then((res) => setInvestors(res.data)).catch(console.error);
  }, []);

  const totalMissions = missions.length;
  const movingCount = missions.filter((m) => m.type.toLowerCase().includes("moving")).length;
  const deliveryCount = missions.filter((m) => m.type.toLowerCase().includes("delivery")).length;

  const totalRevenue = missions.reduce((acc, m) => acc + (Number(m.priceTTC) || 0), 0);
  const totalSalaries = missions.reduce((acc, m) => acc + (Number(m.salary) || 0), 0);
  const totalCharges = missions.reduce((acc, m) => acc + (Number(m.charges) || 0), 0);
  const totalProfit = missions.reduce((acc, m) => acc + (Number(m.profit) || 0), 0);

  const totalInvestment = investors.reduce((acc, i) => acc + (i.totalDeposits || 0), 0);
  const totalWithdrawal = investors.reduce((acc, i) => acc + (i.totalWithdrawals || 0), 0);

  const investmentByPerson = investors.reduce((acc, i) => {
    acc[i.name] = (acc[i.name] || 0) + (i.totalDeposits || 0);
    return acc;
  }, {});

  const balanceByInvestor = investors.map((i) => ({
    name: i.name,
    balance: i.balance || 0,
  }));

  // 📊 Revenue & Profit by Month
  const revenuePerMonth = {};
  const profitPerMonth = {};
  missions.forEach((m) => {
    if (!m.date) return;
    const key = new Date(m.date).toLocaleString("en-US", { month: "short", year: "numeric" });
    revenuePerMonth[key] = (revenuePerMonth[key] || 0) + (Number(m.priceTTC) || 0);
    profitPerMonth[key] = (profitPerMonth[key] || 0) + (Number(m.profit) || 0);
  });

  const barData = {
    labels: Object.keys(revenuePerMonth),
    datasets: [
      {
        label: "Monthly Revenue (€)",
        data: Object.values(revenuePerMonth),
        backgroundColor: "#3b82f6",
      },
    ],
  };

  const profitLineData = {
    labels: Object.keys(profitPerMonth),
    datasets: [
      {
        label: "Monthly Profit (€)",
        data: Object.values(profitPerMonth),
        fill: false,
        borderColor: "#10b981",
        backgroundColor: "#10b981",
        tension: 0.3,
      },
    ],
  };

  const pieData = {
    labels: ["Moving", "Delivery"],
    datasets: [
      {
        label: "Mission Type",
        data: [movingCount, deliveryCount],
        backgroundColor: ["#10b981", "#f59e0b"],
      },
    ],
  };

  const investorBalanceChart = {
    labels: balanceByInvestor.map((i) => i.name),
    datasets: [
      {
        label: "Investor Balance (€)",
        data: balanceByInvestor.map((i) => i.balance),
        backgroundColor: "#6366f1",
      },
    ],
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-4">📊 Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded p-4 border">
          <h2 className="text-xl font-semibold mb-2">📋 Missions</h2>
          <p>Total: {totalMissions}</p>
          <p>🚚 Moving: {movingCount}</p>
          <p>📦 Delivery: {deliveryCount}</p>
        </div>

        <div className="bg-white shadow rounded p-4 border">
          <h2 className="text-xl font-semibold mb-2">💰 Revenue</h2>
          <p>Total (TTC): {totalRevenue.toFixed(2)} €</p>
        </div>

        <div className="bg-white shadow rounded p-4 border">
          <h2 className="text-xl font-semibold mb-2">📈 Profit</h2>
          <p>Total: {totalProfit.toFixed(2)} €</p>
        </div>

        <div className="bg-white shadow rounded p-4 border">
          <h2 className="text-xl font-semibold mb-2">👷 Salaries & Charges</h2>
          <p>Salaries: {totalSalaries.toFixed(2)} €</p>
          <p>Charges: {totalCharges.toFixed(2)} €</p>
        </div>

        <div className="bg-white shadow rounded p-4 border">
          <h2 className="text-xl font-semibold mb-2">🏦 Investments</h2>
          <p>Total Invested: {totalInvestment.toFixed(2)} €</p>
          <p>Total Withdrawn: {totalWithdrawal.toFixed(2)} €</p>
          <ul className="mt-2">
            {Object.entries(investmentByPerson).map(([name, amount]) => (
              <li key={name} className="flex justify-between text-sm">
                <span>👤 {name}</span>
                <span>{amount.toFixed(2)} €</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Graphs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded p-4 border">
          <h2 className="text-lg font-semibold mb-4">📅 Revenue by Month</h2>
          <Bar data={barData} />
        </div>

        <div className="bg-white shadow rounded p-4 border">
          <h2 className="text-lg font-semibold mb-4">📊 Mission Type Breakdown</h2>
          <Pie data={pieData} />
        </div>

        <div className="bg-white shadow rounded p-4 border md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">📈 Profit by Month</h2>
          <Line data={profitLineData} />
        </div>

        <div className="bg-white shadow rounded p-4 border md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">👥 Investor Balances</h2>
          <Bar data={investorBalanceChart} />
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;