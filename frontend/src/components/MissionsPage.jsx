import React, { useEffect, useState } from "react";
import api from "../api";
import MissionForm from "./MissionForm";
import MissionList from "./MissionList";
import MissionFilter from "./MissionFilter";
import MissionEditModal from "./MissionEditModal";
import { toast } from "react-toastify";

const MissionsPage = () => {
  const [missions, setMissions] = useState([]);
  const [filteredMissions, setFilteredMissions] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedMission, setSelectedMission] = useState(null);

  const fetchMissions = async () => {
    try {
      const res = await api.get("/missions");
      setMissions(res.data);
      setFilteredMissions(res.data);
    } catch (err) {
      console.error("❌ Error fetching missions:", err);
      toast.error("Failed to fetch missions.");
    }
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  const handleCreate = () => {
    fetchMissions();
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/missions/${id}`);
      toast.success("Mission deleted.");
      fetchMissions();
    } catch (err) {
      console.error("❌ Error deleting mission:", err);
      toast.error("Failed to delete mission.");
    }
  };

  const handleEdit = (mission) => {
    setSelectedMission(mission);
    setEditModalOpen(true);
  };

  const handleEditSave = async (updated) => {
    try {
      const ttc = parseFloat(updated.priceHT || 0) * 1.2;
      const payload = { ...updated, priceTTC: ttc };

      await api.put(`/missions/${updated.id}`, payload);
      toast.success("Mission updated.");
      setEditModalOpen(false);
      fetchMissions();
    } catch (err) {
      console.error("❌ Error updating mission:", err);
      toast.error("Failed to update mission.");
    }
  };

  const handleFilter = (filtered) => {
    setFilteredMissions(filtered);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🚚 Mission Management</h1>

      <MissionForm onCreated={handleCreate} />

      <hr className="my-6" />

      <MissionFilter missions={missions} onFilter={handleFilter} />

      <MissionList missions={filteredMissions} onDelete={handleDelete} onEdit={handleEdit} />

      <MissionEditModal
        isOpen={editModalOpen}
        mission={selectedMission}
        onClose={() => setEditModalOpen(false)}
        onSave={handleEditSave}
      />
    </div>
  );
};

export default MissionsPage;
