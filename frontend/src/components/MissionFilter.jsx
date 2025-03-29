import React, { useMemo, useState } from "react";

const MissionFilter = ({ missions, onFilter }) => {
  const [filters, setFilters] = useState({
    type: "",
    client: "",
    employee: "",
    startDate: "",
    endDate: ""
  });

  // 🧠 Mémorisation unique des clients et employés
  const uniqueClients = useMemo(() => [...new Set(missions.map(m => m.client).filter(Boolean))], [missions]);
  const uniqueEmployees = useMemo(() => [...new Set(missions.map(m => m.employee).filter(Boolean))], [missions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    applyFilters(updatedFilters);
  };

  const resetFilters = () => {
    const reset = {
      type: "",
      client: "",
      employee: "",
      startDate: "",
      endDate: ""
    };
    setFilters(reset);
    applyFilters(reset);
  };

  const applyFilters = (filterSet) => {
    const filtered = missions.filter((m) => {
      const typeMatch = filterSet.type ? m.type === filterSet.type : true;
      const clientMatch = filterSet.client ? m.client === filterSet.client : true;
      const employeeMatch = filterSet.employee ? m.employee === filterSet.employee : true;

      const date = new Date(m.date);
      const startMatch = filterSet.startDate ? date >= new Date(filterSet.startDate) : true;
      const endMatch = filterSet.endDate ? date <= new Date(filterSet.endDate) : true;

      return typeMatch && clientMatch && employeeMatch && startMatch && endMatch;
    });

    onFilter(filtered);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
      <select name="type" value={filters.type} onChange={handleChange} className="p-2 border rounded">
        <option value="">All Types</option>
        <option value="Moving">🚚 Moving</option>
        <option value="Delivery">📦 Delivery</option>
      </select>

      <select name="client" value={filters.client} onChange={handleChange} className="p-2 border rounded">
        <option value="">All Clients</option>
        {uniqueClients.map((c) => <option key={c}>{c}</option>)}
      </select>

      <select name="employee" value={filters.employee} onChange={handleChange} className="p-2 border rounded">
        <option value="">All Employees</option>
        {uniqueEmployees.map((e) => <option key={e}>{e}</option>)}
      </select>

      <input type="date" name="startDate" value={filters.startDate} onChange={handleChange} className="p-2 border rounded" />
      <input type="date" name="endDate" value={filters.endDate} onChange={handleChange} className="p-2 border rounded" />

      <button onClick={resetFilters} className="bg-gray-200 px-4 py-2 rounded">♻️ Reset</button>
    </div>
  );
};

export default MissionFilter;
