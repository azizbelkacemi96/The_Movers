import React, { useEffect, useState } from "react";
import api from "../api";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const HomeDashboard = () => {
  const [missions, setMissions] = useState([]);
  const [investments, setInvestments] = useState([]);

  useEffect(() => {
    api.get("/missions").then((res) => setMissions(res.data)).catch(console.error);
    api.get("/finance").then((res) => setInvestments(res.data)).catch(console.error);
  }, []);

  const totalMissions = missions.length;
  const movingCount = missions.filter((m) => m.type.toLowerCase().includes("moving")).length;
  const deliveryCount = missions.filter((m) => m.type.toLowerCase().includes("delivery")).length;

  const totalRevenue = missions.reduce((acc, m) => acc + (Number(m.priceTTC) || 0), 0);
  const totalSalaries = missions.reduce((acc, m) => acc + (Number(m.salary) || 0), 0);
  const totalCharges = missions.reduce((acc, m) => acc + (Number(m.charges) || 0), 0);

  const totalInvestment = investments.reduce((acc, i) => acc + Number(i.amount), 0);
  const investmentByPerson = investments.reduce((acc, i) => {
    if (!i.name) return acc;
    acc[i.name] = (acc[i.name] || 0) + Number(i.amount);
    return acc;
  }, {});

  const revenuePerMonth = {};
  missions.forEach((m) => {
    if (!m.date) return;
    const key = new Date(m.date).toLocaleString("en-US", { month: "short", year: "numeric" });
    revenuePerMonth[key] = (revenuePerMonth[key] || 0) + (Number(m.priceTTC) || 0);
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

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-4">📊 Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <h2 className="text-xl font-semibold mb-2">👷 Salaries & Charges</h2>
          <p>Salaries: {totalSalaries.toFixed(2)} €</p>
          <p>Charges: {totalCharges.toFixed(2)} €</p>
        </div>

        <div className="bg-white shadow rounded p-4 border">
          <h2 className="text-xl font-semibold mb-2">🏦 Investments</h2>
          <p>Total: {totalInvestment.toFixed(2)} €</p>
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
      </div>
    </div>
  );
};

export default HomeDashboard;
