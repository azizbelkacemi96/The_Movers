import React, { useState, useEffect } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const MissionEditModal = ({ isOpen, mission, onClose, onSave }) => {
  const [form, setForm] = useState({});

  useEffect(() => {
    if (mission) setForm(mission);
  }, [mission]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = () => {
    const updated = {
      ...form,
      priceHT: parseFloat(form.priceHT),
      priceTTC: parseFloat((form.priceHT || 0) * 1.2),
      salary: parseFloat(form.salary),
      charges: parseFloat(form.charges),
    };
    onSave(updated);
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="bg-white p-6 max-w-lg mx-auto mt-20 rounded shadow-lg" overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <h2 className="text-xl font-bold mb-4">✏️ Edit Mission</h2>
      <div className="grid grid-cols-2 gap-4">
        <select name="type" value={form.type || ""} onChange={handleChange} className="p-2 border rounded">
          <option value="Moving">🚚 Moving</option>
          <option value="Delivery">📦 Delivery</option>
        </select>
        <input name="date" type="date" value={form.date || ""} onChange={handleChange} className="p-2 border rounded" />
        <input name="client" value={form.client || ""} onChange={handleChange} placeholder="👤 Client" className="p-2 border rounded" />
        <input name="address" value={form.address || ""} onChange={handleChange} placeholder="📍 Address" className="p-2 border rounded" />
        <input name="priceHT" value={form.priceHT || ""} onChange={handleChange} type="number" placeholder="💰 HT" className="p-2 border rounded" />
        <input name="employee" value={form.employee || ""} onChange={handleChange} placeholder="👷 Employee" className="p-2 border rounded" />
        <input name="salary" value={form.salary || ""} onChange={handleChange} type="number" placeholder="💸 Salary" className="p-2 border rounded" />
        <input name="charges" value={form.charges || ""} onChange={handleChange} type="number" placeholder="📉 Charges" className="p-2 border rounded" />
      </div>
      <div className="flex justify-between mt-6">
        <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
        <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
      </div>
    </Modal>
  );
};

export default MissionEditModal;
