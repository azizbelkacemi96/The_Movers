import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Modal from "react-modal";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import api from "../api";

Modal.setAppElement("#root");

const CalendarView = () => {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [form, setForm] = useState({
    client: "",
    address: "",
    phone: "",
    type: "Moving",
    date: "",
    time: "",
  });

  const fetchEvents = async () => {
    try {
      const res = await api.get("/appointments");
      const mapped = res.data.map((r) => ({
        id: r.id,
        title: `${r.type} - ${r.client}`,
        start: r.date,
        extendedProps: {
          address: r.address,
          phone: r.phone,
          type: r.type,
          client: r.client,
        },
      }));
      setEvents(mapped);
    } catch (err) {
      console.error("❌ Error fetching appointments:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openModalForNew = (arg) => {
    setSelectedEvent(null);
    setForm({
      client: "",
      address: "",
      phone: "",
      type: "Moving",
      date: arg.dateStr,
      time: "",
    });
    setModalOpen(true);
  };

  const openModalForEdit = (arg) => {
    const e = arg.event || arg;
    const rawDate = e.startStr || e.start || "";
    const fullDate = typeof rawDate === "string" ? rawDate : new Date(rawDate).toISOString();
    const [datePart, timePart] = fullDate.split("T");

    setSelectedEvent(e);
    setForm({
      client: e.extendedProps.client,
      address: e.extendedProps.address,
      phone: e.extendedProps.phone,
      type: e.extendedProps.type,
      date: datePart,
      time: timePart?.substring(0, 5) || "",
    });
    setModalOpen(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const datetime = `${form.date}T${form.time}`;
      const payload = { ...form, date: datetime };

      if (selectedEvent) {
        await api.put(`/appointments/${selectedEvent.id}`, payload);
      } else {
        await api.post("/appointments", payload);
      }

      setModalOpen(false);
      fetchEvents();
    } catch (err) {
      console.error("❌ Error saving appointment:", err);
    }
  };

  const handleDelete = async () => {
    try {
      if (selectedEvent) {
        await api.delete(`/appointments/${selectedEvent.id}`);
        setModalOpen(false);
        fetchEvents();
      }
    } catch (err) {
      console.error("❌ Error deleting appointment:", err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">📅 Appointment Calendar</h1>

      <Tabs>
        <TabList>
          <Tab>📆 Calendar View</Tab>
          <Tab>📋 List View</Tab>
        </TabList>

        <TabPanel>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek",
            }}
            events={events}
            dateClick={openModalForNew}
            eventClick={openModalForEdit}
            height="auto"
          />
        </TabPanel>

        <TabPanel>
          <div className="overflow-x-auto mt-6">
            <table className="min-w-full border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">📅 Date</th>
                  <th className="border p-2">⏰ Time</th>
                  <th className="border p-2">👤 Client</th>
                  <th className="border p-2">📍 Address</th>
                  <th className="border p-2">📞 Phone</th>
                  <th className="border p-2">📦 Type</th>
                  <th className="border p-2">⚙️ Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e) => (
                  <tr key={e.id}>
                    <td className="border p-2">{e.start?.split("T")[0]}</td>
                    <td className="border p-2">
                      {e.start
                        ? new Date(e.start).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </td>
                    <td className="border p-2">{e.extendedProps.client}</td>
                    <td className="border p-2">{e.extendedProps.address}</td>
                    <td className="border p-2">{e.extendedProps.phone}</td>
                    <td className="border p-2">{e.extendedProps.type}</td>
                    <td className="border p-2 space-x-2">
                      <button
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                        onClick={() => openModalForEdit(e)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded"
                        onClick={() => {
                          setSelectedEvent(e);
                          handleDelete();
                        }}
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabPanel>
      </Tabs>

      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        className="bg-white w-[95%] max-w-xl rounded p-6 shadow-lg mx-auto relative"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <h2 className="text-xl font-bold mb-4">
          {selectedEvent ? "✏️ Edit Appointment" : "➕ New Appointment"}
        </h2>
        <div className="grid gap-3">
          <input
            name="client"
            placeholder="👤 Client Name"
            value={form.client}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="address"
            placeholder="📍 Address"
            value={form.address}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="phone"
            placeholder="📞 Phone"
            value={form.phone}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="Moving">🚚 Moving</option>
            <option value="Delivery">📦 Delivery</option>
          </select>
          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="time"
            type="time"
            value={form.time}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>

        <div className="flex justify-between mt-6">
          {selectedEvent && (
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              🗑 Delete
            </button>
          )}
          <div className="ml-auto space-x-2">
            <button
              onClick={() => setModalOpen(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              💾 Save
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CalendarView;
