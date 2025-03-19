import React from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function MissionList({ missions, deleteMission, editMission }) {

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(missions);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Missions");

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, `missions_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  return (
    <div className="bg-white shadow p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">📋 Liste des Missions</h2>
        <button onClick={exportToExcel} className="bg-green-600 text-white px-4 py-2 rounded">
          📥 Exporter Excel
        </button>
      </div>
      
      <table className="min-w-full table-auto border">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Client</th>
            <th className="px-4 py-2">Prix HT (€)</th>
            <th className="px-4 py-2">Prix TTC (€)</th>
            <th className="px-4 py-2">Employé</th>
            <th className="px-4 py-2">Salaire (€)</th>
            <th className="px-4 py-2">Charges (€)</th>
            <th className="px-4 py-2">Résultat HT (€)</th>
            <th className="px-4 py-2">Résultat TTC (€)</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {missions.length > 0 ? (
            missions.map((mission, index) => (
              <tr key={index} className="text-center border-b hover:bg-gray-100">
                <td className="px-4 py-2">{mission.type}</td>
                <td className="px-4 py-2">{mission.date}</td>
                <td className="px-4 py-2">{mission.client}</td>
                <td className="px-4 py-2">{mission.prixHT} €</td>
                <td className="px-4 py-2">{mission.prixTTC} €</td>
                <td className="px-4 py-2">{mission.employe}</td>
                <td className="px-4 py-2">{mission.salaire} €</td>
                <td className="px-4 py-2">{mission.charges} €</td>
                <td className="px-4 py-2">{mission.resultatHT} €</td>
                <td className="px-4 py-2">{mission.resultatTTC} €</td>
                <td className="px-4 py-2 flex gap-2">
                  <button className="bg-green-500 text-white px-2 py-1 rounded" onClick={() => editMission(index)}>Modifier</button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => deleteMission(index)}>Supprimer</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11" className="text-center py-4">Aucune mission enregistrée.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default MissionList;
