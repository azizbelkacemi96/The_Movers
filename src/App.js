import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink, useLocation } from 'react-router-dom';
import MissionForm from './components/MissionForm';
import MissionList from './components/MissionList';
import MissionFilter from './components/MissionFilter';
import Finance from './components/Finance';

function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

function MainLayout() {
  const [missions, setMissions] = useState([]);
  const [missionsFiltrees, setMissionsFiltrees] = useState([]);
  const [missionToEdit, setMissionToEdit] = useState(null);

  const location = useLocation();

  // 🔄 Force le re-render lors du changement d'URL
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const addMission = (mission) => {
    setMissions([...missions, mission]);
  };

  const deleteMission = (index) => {
    setMissions(missions.filter((_, i) => i !== index));
  };

  const editMission = (index) => {
    const selectedMission = missions[index];
    setMissionToEdit({ ...selectedMission, index });
  };

  const updateMission = (updatedMission) => {
    const updatedMissions = missions.map((mission, index) =>
      index === updatedMission.index ? updatedMission : mission
    );
    setMissions(updatedMissions);
    setMissionToEdit(null);
  };

  return (
    <div className="container mx-auto p-4">
      {/* ✅ Fix de la NavBar avec `NavLink` */}
      <nav className="bg-gray-800 p-4 mb-4 text-white flex justify-between">
        <div>
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? "text-yellow-400 font-bold mr-4" : "mr-4"}
            end
          >
            📋 Gestion des Missions
          </NavLink>
          <NavLink 
            to="/finance" 
            className={({ isActive }) => isActive ? "text-yellow-400 font-bold" : ""}
          >
            💰 Suivi Financier
          </NavLink>
        </div>
      </nav>

      {/* ✅ Routes qui fonctionnent sans bug */}
      <Routes key={location.pathname}>
        <Route
          path="/"
          element={
            <>
              <MissionForm
                addMission={addMission}
                updateMission={updateMission}
                missionToEdit={missionToEdit}
                cancelEdit={() => setMissionToEdit(null)}
              />
              <MissionFilter
                onFilter={(filters) => {
                  let resultats = [...missions];

                  if (filters.type && filters.type !== 'Tous') {
                    resultats = resultats.filter(m => m.type === filters.type);
                  }

                  if (filters.employe) {
                    resultats = resultats.filter(m => m.employe && m.employe.toLowerCase().includes(filters.employe.toLowerCase()));
                  }

                  if (filters.client) {
                    resultats = resultats.filter(m => m.client && m.client.toLowerCase().includes(filters.client.toLowerCase()));
                  }

                  if (filters.dateDebut) {
                    resultats = resultats.filter(m => m.date && new Date(m.date) >= new Date(filters.dateDebut));
                  }

                  if (filters.dateFin) {
                    resultats = resultats.filter(m => m.date && new Date(m.date) <= new Date(filters.dateFin));
                  }

                  setMissionsFiltrees(resultats);
                }}
                employes={missions.map(m => m.employe).filter(Boolean)}
                clients={missions.map(m => m.client).filter(Boolean)}
              />
              <MissionList missions={missionsFiltrees.length > 0 ? missionsFiltrees : missions} deleteMission={deleteMission} editMission={editMission} />
            </>
          }
        />
        <Route path="/finance" element={<Finance />} />
      </Routes>
    </div>
  );
}

export default App;
