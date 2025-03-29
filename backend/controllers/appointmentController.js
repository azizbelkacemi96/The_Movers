const db = require("../models/database");

// Get all appointments
exports.getAllAppointments = (req, res) => {
  db.all("SELECT * FROM appointments", [], (err, rows) => {
    if (err) {
      console.error("❌ Error retrieving appointments:", err);
      return res.status(500).json({ error: "Server error." });
    }
    res.json(rows);
  });
};

// Create a new appointment
exports.createAppointment = (req, res) => {
  const { client, phone, address, date, type } = req.body;

  console.log("📥 Received data for appointment:", req.body);

  if (!client || !date || !type) {
    return res
      .status(400)
      .json({ error: "⚠️ 'client', 'date', and 'type' are required." });
  }

  db.run(
    `INSERT INTO appointments (client, phone, address, date, type)
     VALUES (?, ?, ?, ?, ?)`,
    [client, phone, address, date, type],
    function (err) {
      if (err) {
        console.error("❌ Error creating appointment:", err);
        return res.status(500).json({ error: "Server error." });
      }
      res.json({ success: true, id: this.lastID });
    }
  );
};

// Update an appointment
exports.updateAppointment = (req, res) => {
  const { id } = req.params;
  const { client, phone, address, date, type } = req.body;

  console.log(`🔄 Updating appointment ID ${id} with data:`, req.body);

  db.run(
    `UPDATE appointments
     SET client = ?, phone = ?, address = ?, date = ?, type = ?
     WHERE id = ?`,
    [client, phone, address, date, type, id],
    function (err) {
      if (err) {
        console.error("❌ Error updating appointment:", err);
        return res.status(500).json({ error: "Server error." });
      }
      res.json({ success: true });
    }
  );
};

// Delete an appointment
exports.deleteAppointment = (req, res) => {
  const { id } = req.params;
  console.log(`🗑️ Deleting appointment ID ${id}`);

  db.run("DELETE FROM appointments WHERE id = ?", [id], function (err) {
    if (err) {
      console.error("❌ Error deleting appointment:", err);
      return res.status(500).json({ error: "Server error." });
    }
    res.json({ success: true });
  });
};
