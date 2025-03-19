import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function HomeDashboard() {
  const [missions, setMissions] = useState([]);

  useEffect(() => {
    const missionsData = JSON.parse(localStorage.getItem("missions") || "[]");
    setMissions(missionsData);
  }, []);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const missionsDuMois = missions.filter(mission => {
    const dateMission = new Date(mission.date);
    return dateMission.getMonth() === currentMonth && dateMission.getFullYear() === currentYear;
  });

  const totalHT = missionsDuMois.reduce((sum, m) => sum + (parseFloat(m.prixHT) || 0), 0);
  const totalTTC = missionsDuMois.reduce((sum, m) => sum + (parseFloat(m.prixTTC) || 0), 0);
  const totalCharges = missionsDuMois.reduce((sum, m) => sum + (parseFloat(m.charges) || 0), 0);
  const totalSalaires = missionsDuMois.reduce((sum, m) => sum + (parseFloat(m.salaire) || 0), 0);

  const getMonthlyCA = () => {
    const data = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - i, 1);
      const mois = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      const missionsMois = missions.filter(mission => {
        const missionDate = new Date(mission.date);
        return missionDate.getMonth() === date.getMonth() && missionDate.getFullYear() === date.getFullYear();
      });
      const ca = missionsMois.reduce((sum, m) => sum + (parseFloat(m.prixTTC) || 0), 0);
      data.push({ mois, ca });
    }
    return data;
  };

  const caMensuelData = getMonthlyCA();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">🏠 Dashboard de The Movers</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white shadow p-4 rounded-lg">
          <h2 className="text-xl font-semibold">Chiffre d'affaires HT du mois</h2>
          <p className="text-3xl font-bold mt-2">{totalHT.toFixed(2)} €</p>
        </div>
        <div className="bg-white shadow p-4 rounded-lg">
          <h2 className="text-xl font-semibold">Chiffre d'affaires TTC du mois</h2>
          <p className="text-3xl font-bold mt-2">{totalTTC.toFixed(2)} €</p>
        </div>
        <div className="bg-white shadow p-4 rounded-lg">
          <h2 className="text-xl font-semibold">Total Charges du mois</h2>
          <p className="text-3xl font-bold mt-2">{totalCharges.toFixed(2)} €</p>
        </div>
        <div className="bg-white shadow p-4 rounded-lg">
          <h2 className="text-xl font-semibold">Total Salaires du mois</h2>
          <p className="text-3xl font-bold mt-2">{totalSalaires.toFixed(2)} €</p>
        </div>
      </div>

      <div className="bg-white shadow p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">📈 Croissance du Chiffre d'affaires (12 derniers mois)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={caMensuelData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mois" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="ca" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default HomeDashboard;
