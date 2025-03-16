import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import MissionForm from './components/MissionForm';
import MissionList from './components/MissionList';
import MissionFilter from './components/MissionFilter';
import Finance from './components/Finance';

function App() {
  const [missions, setMissions] = useState([]);
  const [missionsFiltrees, setMissionsFiltrees] = useState([]);
  const [missionToEdit, setMissionToEdit] = useState(null); // ✅ Stocker la mission à modifier

  // ✅ Fonction pour modifier une mission
  const editMission = (index) => {
    const selectedMission = missions[index];
    setMissionToEdit({ ...selectedMission, index }); // Ajout d'un index pour identifier la mission
  };

  // ✅ Fonction pour mettre à jour une mission
  const updateMission = (updatedMission) => {
    const updatedMissions = missions.map((mission, index) =>
      index === updatedMission.index ? updatedMission : mission
    );
    setMissions(updatedMissions);
    setMissionToEdit(null); // Réinitialiser l'édition après mise à jour
  };

  const deleteMission = (index) => {
    setMissions(missions.filter((_, i) => i !== index));
  };

  const addMission = (mission) => {
    setMissions([...missions, mission]);
  };

  return (
    <Router>
      <div className="container mx-auto p-4">
        <nav className="bg-gray-800 p-4 mb-4 text-white flex justify-between">
          <div>
            <Link to="/" className="mr-4">📋 Gestion des Missions</Link>
            <Link to="/finance">💰 Suivi Financier</Link>
          </div>
        </nav>

        <Routes>
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
                <MissionList missions={missions} deleteMission={deleteMission} editMission={editMission} />
              </>
            }
          />
          <Route path="/finance" element={<Finance />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
