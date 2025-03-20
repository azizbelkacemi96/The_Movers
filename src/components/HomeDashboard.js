import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api';

function HomeDashboard() {
  const [missions, setMissions] = useState([]);
  const [caParMois, setCaParMois] = useState([]);

  useEffect(() => {
    api.get('/missions')
      .then(res => {
        setMissions(res.data);
        calculerCAParMois(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  const totalCA = missions.reduce((sum, m) => sum + (parseFloat(m.prixTTC) || 0), 0);
  const totalCharges = missions.reduce((sum, m) => sum + (parseFloat(m.charges) || 0), 0);
  const totalSalaires = missions.reduce((sum, m) => sum + (parseFloat(m.salaire) || 0), 0);
  const benefice = totalCA - (totalCharges + totalSalaires);

  // Fonction pour regrouper le CA par mois
  const calculerCAParMois = (missions) => {
    let caMensuel = {};
    missions.forEach(m => {
      const date = new Date(m.date);
      const mois = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // Format YYYY-MM
      caMensuel[mois] = (caMensuel[mois] || 0) + (parseFloat(m.prixTTC) || 0);
    });

    // Transformer l'objet en tableau trié
    const donneesTriees = Object.keys(caMensuel)
      .sort()
      .map(mois => ({ mois, ca: caMensuel[mois] }));

    setCaParMois(donneesTriees);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">🏠 Dashboard de The Movers</h1>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white shadow p-4 rounded-lg">
          <h2 className="text-xl font-semibold">💰 Chiffre d'affaires</h2>
          <p className="text-3xl font-bold mt-2">{totalCA.toFixed(2)} €</p>
        </div>
        <div className="bg-white shadow p-4 rounded-lg">
          <h2 className="text-xl font-semibold">📉 Charges totales</h2>
          <p className="text-3xl font-bold mt-2">{totalCharges.toFixed(2)} €</p>
        </div>
        <div className="bg-white shadow p-4 rounded-lg">
          <h2 className="text-xl font-semibold">📈 Bénéfice</h2>
          <p className={`text-3xl font-bold mt-2 ${benefice >= 0 ? 'text-green-500' : 'text-red-500'}`}>{benefice.toFixed(2)} €</p>
        </div>
      </div>

      {/* 📊 Courbe d'évolution du CA par mois */}
      <div className="bg-white shadow p-4 rounded-lg mt-6">
        <h2 className="text-xl font-semibold text-center mb-4">📈 Évolution du CA par mois</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={caParMois}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mois" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="ca" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default HomeDashboard;
