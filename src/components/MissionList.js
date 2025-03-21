import React, { useState } from "react";
import api from "../api";

const MissionList = ({ missions, editMission, onDeleteMission }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const missionsPerPage = 5;

  const totalPages = Math.ceil(missions.length / missionsPerPage);
  const indexOfLastMission = currentPage * missionsPerPage;
  const indexOfFirstMission = indexOfLastMission - missionsPerPage;
  const currentMissions = missions.slice(indexOfFirstMission, indexOfLastMission);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/missions/${id}`);
      onDeleteMission(); // Rafraîchir les données
    } catch (error) {
      console.error("Erreur suppression mission :", error);
    }
  };

  return (
    <div className="mt-6">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Type</th>
            <th className="border p-2">Client</th>
            <th className="border p-2">Adresse</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Prix TTC</th>
            <th className="border p-2">Employé</th>
            <th className="border p-2">Salaire</th>
            <th className="border p-2">Charges</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentMissions.map((mission) => (
            <tr key={mission.id} className="text-center">
              <td className="border p-2">{mission.type}</td>
              <td className="border p-2">{mission.client}</td>
              <td className="border p-2">{mission.adresse}</td>
              <td className="border p-2">{mission.date}</td>
              <td className="border p-2">{mission.prixTTC} €</td>
              <td className="border p-2">{mission.employe}</td>
              <td className="border p-2">{mission.salaire} €</td>
              <td className="border p-2">{mission.charges} €</td>
              <td className="border p-2 flex flex-col gap-1 items-center justify-center">
                <button
                  onClick={() => editMission(mission)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded w-full"
                >
                  ✏ Modifier
                </button>
                <button
                  onClick={() => handleDelete(mission.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded w-full"
                >
                  🗑 Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === index + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MissionList;
