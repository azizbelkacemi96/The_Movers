import React, { useState, useEffect } from 'react';

function MissionFilter({ missions, onFilter }) {
  const [filters, setFilters] = useState({
    type: 'Tous',
    employe: '',
    client: '',
    dateDebut: '',
    dateFin: ''
  });

  const [employes, setEmployes] = useState([]);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    setEmployes([...new Set(missions.map(m => m.employe).filter(Boolean))]);
    setClients([...new Set(missions.map(m => m.client).filter(Boolean))]);
  }, [missions]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilter = () => {
    let filtered = [...missions];
    if (filters.type !== 'Tous') filtered = filtered.filter(m => m.type === filters.type);
    if (filters.employe) filtered = filtered.filter(m => m.employe.toLowerCase().includes(filters.employe.toLowerCase()));
    if (filters.client) filtered = filtered.filter(m => m.client.toLowerCase().includes(filters.client.toLowerCase()));
    if (filters.dateDebut) filtered = filtered.filter(m => new Date(m.date) >= new Date(filters.dateDebut));
    if (filters.dateFin) filtered = filtered.filter(m => new Date(m.date) <= new Date(filters.dateFin));

    onFilter(filtered);
  };

  const handleReset = () => {
    setFilters({ type: 'Tous', employe: '', client: '', dateDebut: '', dateFin: '' });
    onFilter(missions);
  };

  return (
    <div className="bg-white p-4 shadow rounded-lg my-4 grid grid-cols-3 gap-4">
      <select name="type" value={filters.type} className="border rounded px-3 py-2" onChange={handleChange}>
        <option>Tous</option>
        <option>Déménagement</option>
        <option>Livraison</option>
      </select>

      <select name="employe" value={filters.employe} className="border rounded px-3 py-2" onChange={handleChange}>
        <option value="">Tous les employés</option>
        {employes.map(emp => <option key={emp}>{emp}</option>)}
      </select>

      <select name="client" value={filters.client} className="border rounded px-3 py-2" onChange={handleChange}>
        <option value="">Tous les clients</option>
        {clients.map(client => <option key={client}>{client}</option>)}
      </select>

      <input name="dateDebut" type="date" className="border rounded px-3 py-2" value={filters.dateDebut} onChange={handleChange} />
      <input name="dateFin" type="date" className="border rounded px-3 py-2" value={filters.dateFin} onChange={handleChange} />

      <div className="flex space-x-2">
        <button onClick={handleFilter} className="bg-blue-500 text-white px-4 py-2 rounded">Filtrer</button>
        <button onClick={handleReset} className="bg-gray-500 text-white px-4 py-2 rounded">Réinitialiser</button>
      </div>
    </div>
  );
}

export default MissionFilter;
