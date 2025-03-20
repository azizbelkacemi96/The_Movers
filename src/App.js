import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomeDashboard from './components/HomeDashboard';
import Finance from './components/Finance';
import MissionForm from './components/MissionForm';
import MissionList from './components/MissionList';
import MissionFilter from './components/MissionFilter';
import MissionEditModal from './components/MissionEditModal';
import api from './api';
import * as XLSX from 'xlsx';

function App() {
  const [missions, setMissions] = useState([]);
  const [missionsFiltrees, setMissionsFiltrees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMission, setCurrentMission] = useState(null);

  // Récupération des missions depuis l'API
  const fetchMissions = () => {
    api.get('/missions')
      .then(res => {
        const sortedMissions = res.data.sort((a, b) => new Date(b.date) - new Date(a.date)); 
        setMissions(sortedMissions);
        setMissionsFiltrees(sortedMissions);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  const editMission = (mission) => {
    setCurrentMission(mission);
    setIsModalOpen(true);
  };

  const handleSaveMission = () => {
    fetchMissions();
    setIsModalOpen(false);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(missionsFiltrees);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Missions");
    XLSX.writeFile(wb, "missions.xlsx");
  };

  return (
    <div className="container mx-auto p-4">
      <Navbar />

      <Routes>
        <Route path="/" element={<HomeDashboard />} />
        <Route path="/missions" element={
          <div>
            <h1 className="text-2xl font-bold mb-4">📋 Missions</h1>
            <MissionForm onMissionAdded={fetchMissions} />
            <MissionFilter missions={missions} onFilter={setMissionsFiltrees} />
            <button className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded my-4" onClick={exportToExcel}>
              📊 Exporter Excel
            </button>
            <MissionList missions={missionsFiltrees} editMission={editMission} onDeleteMission={fetchMissions} />
            <MissionEditModal mission={currentMission} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveMission} />
          </div>
        } />
        <Route path="/finance" element={<Finance />} />
      </Routes>
    </div>
  );
}

export default App;
