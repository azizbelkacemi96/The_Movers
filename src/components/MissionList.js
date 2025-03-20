import React, { useState, useEffect } from 'react';
import api from '../api';

function MissionList({ missions, editMission, onDeleteMission }) {
  const [currentPage, setCurrentPage] = useState(1);
  const missionsParPage = 5;

  const sortedMissions = [...missions].sort((a, b) => new Date(b.date) - new Date(a.date));
  const totalPages = Math.ceil(sortedMissions.length / missionsParPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [missions]);

  const missionsAffichees = sortedMissions.slice((currentPage - 1) * missionsParPage, currentPage * missionsParPage);

  const handleDelete = (id) => {
    api.delete(`/missions/${id}`).then(onDeleteMission);
  };

  const totalCA = missions.reduce((sum, m) => sum + parseFloat(m.prixTTC), 0);
  const totalCharges = missions.reduce((sum, m) => sum + parseFloat(m.salaire) + parseFloat(m.charges), 0);
  const benefice = totalCA - totalCharges;

  return (
    <div>
      {/* Partie Résultats */}
      <div className="bg-gray-100 p-4 rounded shadow mb-4 flex justify-around text-center">
        <div>
          <p className="text-lg font-bold">💰 Chiffre d'affaires</p>
          <p>{totalCA.toFixed(2)} €</p>
        </div>
        <div>
          <p className="text-lg font-bold">📉 Charges totales</p>
          <p>{totalCharges.toFixed(2)} €</p>
        </div>
        <div>
          <p className="text-lg font-bold">📈 Bénéfice</p>
          <p>{benefice.toFixed(2)} €</p>
        </div>
      </div>

      {/* Tableau des missions */}
      <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            {["Type", "Date", "Client", "Prix HT (€)", "Prix TTC (€)", "Employé", "Salaire (€)", "Charges (€)", "Actions"].map(h => (
              <th key={h} className="px-4 py-2">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {missionsAffichees.map(m => (
            <tr key={m.id} className="border-b hover:bg-gray-100 text-center">
              <td className="px-4 py-2">{m.type}</td>
              <td className="px-4 py-2">{m.date}</td>
              <td className="px-4 py-2">{m.client}</td>
              <td className="px-4 py-2">{parseFloat(m.prixHT).toFixed(2)}</td>
              <td className="px-4 py-2">{parseFloat(m.prixTTC).toFixed(2)}</td>
              <td className="px-4 py-2">{m.employe}</td>
              <td className="px-4 py-2">{parseFloat(m.salaire).toFixed(2)}</td>
              <td className="px-4 py-2">{parseFloat(m.charges).toFixed(2)}</td>
              <td className="px-4 py-2">
                <button className="bg-green-500 text-white px-2 rounded" onClick={() => editMission(m)}>Modifier</button>
                <button className="bg-red-500 text-white px-2 ml-2 rounded" onClick={() => handleDelete(m.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`mx-1 px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setCurrentPage(i + 1)}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MissionList;
