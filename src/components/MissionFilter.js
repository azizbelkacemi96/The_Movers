import React, { useState, useEffect } from 'react';

function MissionFilter({ onFilter, employes = [], clients = [] }) {
  const [filters, setFilters] = useState({
    type: 'Tous',
    employe: '',
    client: '',
    dateDebut: '',
    dateFin: '',
  });

  useEffect(() => {
    if (onFilter) {
      onFilter(filters);
    }
  }, [filters]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      type: 'Tous',
      employe: '',
      client: '',
      dateDebut: '',
      dateFin: '',
    });
  };

  return (
    <div className="bg-white shadow p-4 rounded-lg mb-8">
      <div className="grid grid-cols-3 gap-4 mb-4">
        <select name="type" className="border rounded px-3 py-2" onChange={handleChange} value={filters.type}>
          <option value="Tous">Tous</option>
          <option value="Déménagement">Déménagement</option>
          <option value="Livraison">Livraison</option>
        </select>

        <select name="employe" className="border rounded px-3 py-2" onChange={handleChange} value={filters.employe}>
          <option value="">Tous les employés</option>
          {employes.map((emp, index) => (
            <option key={index} value={emp}>{emp}</option>
          ))}
        </select>

        <select name="client" className="border rounded px-3 py-2" onChange={handleChange} value={filters.client}>
          <option value="">Tous les clients</option>
          {clients.map((cli, index) => (
            <option key={index} value={cli}>{cli}</option>
          ))}
        </select>

        <input type="date" name="dateDebut" className="border rounded px-3 py-2" onChange={handleChange} value={filters.dateDebut} />
        <input type="date" name="dateFin" className="border rounded px-3 py-2" onChange={handleChange} value={filters.dateFin} />
      </div>

      <div className="flex gap-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => onFilter(filters)}>
          Filtrer
        </button>
        <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={resetFilters}>
          Réinitialiser
        </button>
      </div>
    </div>
  );
}

export default MissionFilter;
