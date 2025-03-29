import React, { useState } from "react";
import * as XLSX from "xlsx";

const MissionList = ({ missions, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;
  const totalPages = Math.ceil(missions.length / perPage);
  const missionsPage = missions.slice((currentPage - 1) * perPage, currentPage * perPage);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(missions);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Missions");
    XLSX.writeFile(wb, "missions.xlsx");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">📋 Missions</h2>
        <button onClick={exportToExcel} className="bg-blue-600 text-white px-4 py-2 rounded">📤 Export</button>
      </div>
      <table className="w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th>📄 Type</th><th>📅 Date</th><th>👤 Client</th><th>📍 Address</th>
            <th>💰 HT</th><th>🧾 TTC</th><th>👷 Employee</th><th>💸 Salary</th><th>📉 Charges</th><th>⚙️ Actions</th>
          </tr>
        </thead>
        <tbody>
          {missionsPage.map((m) => (
            <tr key={m.id} className="text-center border-t">
              <td>{m.type}</td>
              <td>{m.date}</td>
              <td>{m.client}</td>
              <td>{m.address}</td>
              <td>{m.priceHT} €</td>
              <td>{m.priceTTC} €</td>
              <td>{m.employee}</td>
              <td>{m.salary} €</td>
              <td>{m.charges} €</td>
              <td>
                <button onClick={() => onEdit(m)} className="text-yellow-600">✏️</button>
                <button onClick={() => onDelete(m.id)} className="text-red-600 ml-2">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4 gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded border ${currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MissionList;
