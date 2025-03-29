const db = require("../models/database");

// GET all missions
exports.getAllMissions = (req, res) => {
  db.all("SELECT * FROM missions", [], (err, rows) => {
    if (err) {
      console.error("❌ Error fetching missions:", err);
      return res.status(500).json({ error: "Server error" });
    }
    res.json(rows);
  });
};

// CREATE a mission
exports.createMission = (req, res) => {
  const { type, client, address, date, priceHT, priceTTC, salary, charges, employee } = req.body;

  const profit = parseFloat(priceHT || 0) - parseFloat(salary || 0) - parseFloat(charges || 0);
  console.log("📥 Received data for new mission:", req.body, "➡️ Profit:", profit);

  const sql = `
    INSERT INTO missions (type, client, address, date, priceHT, priceTTC, salary, charges, employee, profit)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [type, client, address, date, priceHT, priceTTC, salary, charges, employee, profit], function (err) {
    if (err) {
      console.error("❌ Error creating mission:", err);
      return res.status(500).json({ error: "Failed to create mission" });
    }
    console.log(`✅ Mission created successfully (ID ${this.lastID})`);
    res.json({ success: true, id: this.lastID });
  });
};

// UPDATE a mission
exports.updateMission = (req, res) => {
  const { id } = req.params;
  const { type, client, address, date, priceHT, priceTTC, salary, charges, employee } = req.body;

  const profit = parseFloat(priceHT || 0) - parseFloat(salary || 0) - parseFloat(charges || 0);
  console.log(`🔄 Updating mission ID ${id} with data:`, req.body, "➡️ New profit:", profit);

  const sql = `
    UPDATE missions
    SET type = ?, client = ?, address = ?, date = ?, priceHT = ?, priceTTC = ?, salary = ?, charges = ?, employee = ?, profit = ?
    WHERE id = ?
  `;

  db.run(sql, [type, client, address, date, priceHT, priceTTC, salary, charges, employee, profit, id], function (err) {
    if (err) {
      console.error("❌ Error updating mission:", err);
      return res.status(500).json({ error: "Failed to update mission" });
    }
    console.log(`✅ Mission ID ${id} updated successfully`);
    res.json({ success: true });
  });
};

// DELETE a mission
exports.deleteMission = (req, res) => {
  const { id } = req.params;

  console.log(`🗑️ Deleting mission ID ${id}`);

  db.run("DELETE FROM missions WHERE id = ?", [id], function (err) {
    if (err) {
      console.error("❌ Error deleting mission:", err);
      return res.status(500).json({ error: "Failed to delete mission" });
    }
    console.log(`✅ Mission ID ${id} deleted`);
    res.json({ success: true });
  });
};
