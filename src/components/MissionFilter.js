import React, { useState, useEffect } from "react";

const MissionFilter = ({ missions, onFilter }) => {
  const [type, setType] = useState("");
  const [client, setClient] = useState("");
  const [employe, setEmploye] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");

  const uniqueClients = [...new Set(missions.map(m => m.client).filter(Boolean))];
  const uniqueEmployes = [...new Set(missions.map(m => m.employe).filter(Boolean))];

  useEffect(() => {
    let result = missions;

    if (type) result = result.filter(m => m.type === type);
    if (client) result = result.filter(m => m.client === client);
    if (employe) result = result.filter(m => m.employe === employe);
    if (dateDebut) result = result.filter(m => new Date(m.date) >= new Date(dateDebut));
    if (dateFin) result = result.filter(m => new Date(m.date) <= new Date(dateFin));

    onFilter(result);
  }, [type, client, employe, dateDebut, dateFin, missions, onFilter]);

  const resetFilters = () => {
    setType("");
    setClient("");
    setEmploye("");
    setDateDebut("");
    setDateFin("");
  };

  return (
    <div className="bg-gray-100 p-4 rounded shadow mb-6">
      <h3 className="text-md font-semibold mb-3">🔍 Filtres</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <select value={type} onChange={(e) => setType(e.target.value)} className="border p-2 rounded">
          <option value="">📦 Tous les types</option>
          <option value="Déménagement">Déménagement</option>
          <option value="Livraison">Livraison</option>
        </select>

        <select value={client} onChange={(e) => setClient(e.target.value)} className="border p-2 rounded">
          <option value="">👤 Tous les clients</option>
          {uniqueClients.map((c, idx) => (
            <option key={idx} value={c}>{c}</option>
          ))}
        </select>

        <select value={employe} onChange={(e) => setEmploye(e.target.value)} className="border p-2 rounded">
          <option value="">🧑 Tous les employés</option>
          {uniqueEmployes.map((e, idx) => (
            <option key={idx} value={e}>{e}</option>
          ))}
        </select>

        <input
          type="date"
          value={dateDebut}
          onChange={(e) => setDateDebut(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="date"
          value={dateFin}
          onChange={(e) => setDateFin(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      <div className="text-right mt-4">
        <button onClick={resetFilters} className="bg-gray-400 text-white px-4 py-2 rounded">
          ♻️ Réinitialiser
        </button>
      </div>
    </div>
  );
};

export default MissionFilter;
