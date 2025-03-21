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
  const [investissements, setInvestissements] = useState([]);

  useEffect(() => {
    api.get("/missions").then((res) => setMissions(res.data)).catch(console.error);
    api.get("/finance").then((res) => setInvestissements(res.data)).catch(console.error);
  }, []);

  // 📊 Statistiques missions
  const totalMissions = missions.length;
  const demenagements = missions.filter((m) => m.type.toLowerCase().includes("déménagement")).length;
  const livraisons = missions.filter((m) => m.type.toLowerCase().includes("livraison")).length;

  const totalCA = missions.reduce((acc, m) => acc + (Number(m.prixTTC) || 0), 0);
  const totalSalaires = missions.reduce((acc, m) => acc + (Number(m.salaire) || 0), 0);
  const totalCharges = missions.reduce((acc, m) => acc + (Number(m.charges) || 0), 0);

  const totalInvestissements = investissements.reduce((acc, i) => acc + Number(i.montant), 0);
  const investParPersonne = investissements.reduce((acc, i) => {
    if (!i.nom) return acc;
    acc[i.nom] = (acc[i.nom] || 0) + Number(i.montant);
    return acc;
  }, {});

  // 📅 CA par mois
  const caParMois = {};
  missions.forEach((m) => {
    if (!m.date) return;
    const mois = new Date(m.date).toLocaleString("fr-FR", { month: "short", year: "numeric" });
    caParMois[mois] = (caParMois[mois] || 0) + (Number(m.prixTTC) || 0);
  });

  const graphCA = {
    labels: Object.keys(caParMois),
    datasets: [
      {
        label: "Chiffre d'affaires (€)",
        data: Object.values(caParMois),
        backgroundColor: "#3b82f6",
      },
    ],
  };

  const graphPie = {
    labels: ["Déménagements", "Livraisons"],
    datasets: [
      {
        label: "Répartition missions",
        data: [demenagements, livraisons],
        backgroundColor: ["#10b981", "#f59e0b"],
      },
    ],
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-4">📊 Tableau de bord</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded p-4 border">
          <h2 className="text-xl font-semibold mb-2">📋 Missions</h2>
          <p>Total : {totalMissions}</p>
          <p>🚚 Déménagements : {demenagements}</p>
          <p>📦 Livraisons : {livraisons}</p>
        </div>

        <div className="bg-white shadow rounded p-4 border">
          <h2 className="text-xl font-semibold mb-2">💰 Chiffre d'affaires</h2>
          <p>Total TTC : {totalCA.toFixed(2)} €</p>
        </div>

        <div className="bg-white shadow rounded p-4 border">
          <h2 className="text-xl font-semibold mb-2">👷 Charges & Salaires</h2>
          <p>Salaires : {totalSalaires.toFixed(2)} €</p>
          <p>Charges : {totalCharges.toFixed(2)} €</p>
        </div>

        <div className="bg-white shadow rounded p-4 border">
          <h2 className="text-xl font-semibold mb-2">🏦 Investissements</h2>
          <p>Total : {totalInvestissements.toFixed(2)} €</p>
          <ul className="mt-2">
            {Object.entries(investParPersonne).map(([nom, montant]) => (
              <li key={nom} className="flex justify-between text-sm">
                <span>👤 {nom}</span>
                <span>{montant.toFixed(2)} €</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded p-4 border">
          <h2 className="text-lg font-semibold mb-4">📅 CA par mois</h2>
          <Bar data={graphCA} />
        </div>

        <div className="bg-white shadow rounded p-4 border">
          <h2 className="text-lg font-semibold mb-4">📊 Répartition des missions</h2>
          <Pie data={graphPie} />
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;
