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
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    client: "",
    adresse: "",
    telephone: "",
    type: "Déménagement",
    date: "",
  });

  const fetchEvents = () => {
    api.get("/rdvs").then((res) => {
      const mapped = res.data.map((r) => ({
        id: r.id,
        title: `${r.type} - ${r.client}`,
        start: r.date,
        extendedProps: {
          adresse: r.adresse,
          telephone: r.telephone,
          type: r.type,
          client: r.client,
        },
      }));
      setEvents(mapped);
    });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDateClick = (arg) => {
    setNewEvent({
      client: "",
      adresse: "",
      telephone: "",
      type: "Déménagement",
      date: arg.dateStr,
    });
    setSelectedEvent(null);
    setModalIsOpen(true);
  };

  const handleEventClick = (arg) => {
    const e = arg.event;
    setSelectedEvent(e);
    setNewEvent({
      client: e.extendedProps.client,
      adresse: e.extendedProps.adresse,
      telephone: e.extendedProps.telephone,
      type: e.extendedProps.type,
      date: e.startStr,
    });
    setModalIsOpen(true);
  };

  const handleSave = () => {
    if (selectedEvent) {
      api.put(`/rdvs/${selectedEvent.id}`, newEvent).then(() => {
        fetchEvents();
        setModalIsOpen(false);
      });
    } else {
      api.post("/rdvs", newEvent).then(() => {
        fetchEvents();
        setModalIsOpen(false);
      });
    }
  };

  const handleDelete = () => {
    if (selectedEvent) {
      api.delete(`/rdvs/${selectedEvent.id}`).then(() => {
        fetchEvents();
        setModalIsOpen(false);
      });
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">📅 Gestion des RDV</h1>

      <Tabs>
        <TabList>
          <Tab>📅 Vue Calendrier</Tab>
          <Tab>📋 Vue Liste</Tab>
        </TabList>

        {/* 📅 Vue Calendrier */}
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
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            locale="fr"
            height="auto"
          />
        </TabPanel>

        {/* 📋 Vue Liste */}
        <TabPanel>
          <div className="overflow-x-auto mt-6">
            <table className="min-w-full table-auto border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">📅 Date</th>
                  <th className="border p-2">👤 Client</th>
                  <th className="border p-2">📍 Adresse</th>
                  <th className="border p-2">📞 Téléphone</th>
                  <th className="border p-2">🧾 Type</th>
                  <th className="border p-2">⚙️ Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e) => (
                  <tr key={e.id}>
                    <td className="border p-2">{e.start.split("T")[0]}</td>
                    <td className="border p-2">{e.extendedProps.client}</td>
                    <td className="border p-2">{e.extendedProps.adresse}</td>
                    <td className="border p-2">{e.extendedProps.telephone}</td>
                    <td className="border p-2">{e.extendedProps.type}</td>
                    <td className="border p-2 space-x-2">
                      <button
                        onClick={() => {
                          setSelectedEvent(e);
                          setNewEvent({
                            client: e.extendedProps.client,
                            adresse: e.extendedProps.adresse,
                            telephone: e.extendedProps.telephone,
                            type: e.extendedProps.type,
                            date: e.start.split("T")[0],
                          });
                          setModalIsOpen(true);
                        }}
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                      >
                        ✏️ Modifier
                      </button>
                      <button
                        onClick={() => {
                          setSelectedEvent(e);
                          handleDelete();
                        }}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        🗑 Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabPanel>
      </Tabs>

      {/* 🪟 Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="bg-white p-6 max-w-lg mx-auto mt-20 rounded shadow-lg z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40"
      >
        <h2 className="text-xl font-semibold mb-4">
          {selectedEvent ? "✏️ Modifier le RDV" : "➕ Ajouter un RDV"}
        </h2>
        <div className="grid grid-cols-1 gap-3">
          <input
            className="border p-2 rounded"
            placeholder="👤 Nom du client"
            value={newEvent.client}
            onChange={(e) => setNewEvent({ ...newEvent, client: e.target.value })}
          />
          <input
            className="border p-2 rounded"
            placeholder="📍 Adresse"
            value={newEvent.adresse}
            onChange={(e) => setNewEvent({ ...newEvent, adresse: e.target.value })}
          />
          <input
            className="border p-2 rounded"
            placeholder="📞 Téléphone"
            value={newEvent.telephone}
            onChange={(e) => setNewEvent({ ...newEvent, telephone: e.target.value })}
          />
          <select
            className="border p-2 rounded"
            value={newEvent.type}
            onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
          >
            <option value="Déménagement">🚚 Déménagement</option>
            <option value="Livraison">📦 Livraison</option>
          </select>
          <input
            className="border p-2 rounded"
            type="date"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
          />
          <div className="flex justify-between mt-4">
            {selectedEvent && (
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                🗑 Supprimer
              </button>
            )}
            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => setModalIsOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                💾 Enregistrer
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CalendarView;
