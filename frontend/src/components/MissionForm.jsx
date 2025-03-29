import React, { useState } from "react";
import api from "../api";
import { toast } from "react-toastify";

const MissionForm = ({ onCreated }) => {
  const [form, setForm] = useState({
    type: "Moving",
    date: "",
    client: "",
    address: "",
    priceHT: "",
    employee: "",
    salary: "",
    charges: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const calculateTTC = (ht) => (parseFloat(ht || 0) * 1.2).toFixed(2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        priceHT: parseFloat(form.priceHT),
        priceTTC: parseFloat(calculateTTC(form.priceHT)),
        salary: parseFloat(form.salary),
        charges: parseFloat(form.charges),
      };

      await api.post("/missions", payload);
      toast.success("✅ Mission created");
      onCreated();
      setForm({
        type: "Moving",
        date: "",
        client: "",
        address: "",
        priceHT: "",
        employee: "",
        salary: "",
        charges: "",
      });
    } catch {
      toast.error("❌ Failed to create mission");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-100 p-4 rounded">
      <select name="type" value={form.type} onChange={handleChange} className="p-2 border rounded">
        <option value="Moving">🚚 Moving</option>
        <option value="Delivery">📦 Delivery</option>
      </select>
      <input name="date" type="date" value={form.date} onChange={handleChange} className="p-2 border rounded" />
      <input name="client" placeholder="👤 Client" value={form.client} onChange={handleChange} className="p-2 border rounded" />
      <input name="address" placeholder="📍 Address" value={form.address} onChange={handleChange} className="p-2 border rounded" />
      <input name="priceHT" placeholder="💰 Price HT" type="number" value={form.priceHT} onChange={handleChange} className="p-2 border rounded" />
      <input name="employee" placeholder="👷 Employee" value={form.employee} onChange={handleChange} className="p-2 border rounded" />
      <input name="salary" placeholder="💸 Salary" type="number" value={form.salary} onChange={handleChange} className="p-2 border rounded" />
      <input name="charges" placeholder="📉 Charges" type="number" value={form.charges} onChange={handleChange} className="p-2 border rounded" />
      <div className="col-span-full text-right font-semibold">
        🧾 TTC: {calculateTTC(form.priceHT)} €
      </div>
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded col-span-full">💾 Save</button>
    </form>
  );
};

export default MissionForm;
