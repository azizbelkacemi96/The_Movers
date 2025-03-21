import React, { useEffect, useState } from "react";
import MissionForm from "./MissionForm";
import MissionFilter from "./MissionFilter";
import MissionList from "./MissionList";
import MissionEditModal from "./MissionEditModal";
import * as XLSX from "xlsx";
import api from "../api";

const MissionsPage = () => {
  const [missions, setMissions] = useState([]);
  const [missionsFiltrees, setMissionsFiltrees] = useState([]);
  const [currentMission, setCurrentMission] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 📥 Récupération des missions depuis l'API
  const fetchMissions = async () => {
    try {
      const res = await api.get("/missions");
      const sorted = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setMissions(sorted);
      setMissionsFiltrees(sorted);
    } catch (err) {
      console.error("Erreur récupération missions :", err);
    }
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  const handleEditMission = (mission) => {
    setCurrentMission(mission);
    setIsModalOpen(true);
  };

  const handleSaveEdit = () => {
    setIsModalOpen(false);
    fetchMissions();
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(missionsFiltrees);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Missions");
    XLSX.writeFile(wb, "missions.xlsx");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">📋 Liste des missions</h1>

      <MissionForm onMissionAdded={fetchMissions} />

      <MissionFilter missions={missions} onFilter={setMissionsFiltrees} />

      <div className="my-4 text-right">
        <button onClick={exportToExcel} className="bg-green-600 text-white px-4 py-2 rounded">
          📤 Exporter en Excel
        </button>
      </div>

      <MissionList
        missions={missionsFiltrees}
        editMission={handleEditMission}
        onDeleteMission={fetchMissions}
      />

      <MissionEditModal
        mission={currentMission}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

export default MissionsPage;
