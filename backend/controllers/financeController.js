const db = require("../models/database");

// 🔍 Get all investments
exports.getAllInvestments = (req, res) => {
  db.all("SELECT * FROM investments", [], (err, rows) => {
    if (err) {
      console.error("❌ Error fetching investments:", err);
      return res.status(500).json({ error: "Server error." });
    }
    res.json(rows);
  });
};

// ➕ Create a new investment
exports.createInvestment = (req, res) => {
  const { name, amount, date, category } = req.body;

  if (!name || !amount || !date || !category) {
    return res.status(400).json({ error: "⚠️ All required fields must be filled." });
  }

  console.log("📥 Received data for new investment:", req.body);

  db.run(
    `INSERT INTO investments (name, amount, date, category) VALUES (?, ?, ?, ?)`,
    [name, amount, date, category],
    function (err) {
      if (err) {
        console.error("🚨 Error inserting investment:", err);
        return res.status(500).json({ error: "Server error while creating investment." });
      }
      console.log(`✅ Investment added successfully (ID ${this.lastID})`);
      res.json({ success: true, id: this.lastID });
    }
  );
};

// ✏️ Update an investment
exports.updateInvestment = (req, res) => {
  const { id } = req.params;
  const { name, amount, date, category } = req.body;

  if (!id) {
    console.error("❌ Investment ID not provided.");
    return res.status(400).json({ error: "Investment ID is required." });
  }

  db.get("SELECT * FROM investments WHERE id = ?", [id], (err, row) => {
    if (err) {
      console.error("🚨 Error checking investment existence:", err);
      return res.status(500).json({ error: "Server error." });
    }

    if (!row) {
      console.warn(`❌ Investment ID ${id} not found.`);
      return res.status(404).json({ error: `Investment ID ${id} not found.` });
    }

    console.log("🔄 Updating investment with data:", req.body);
    db.run(
      `UPDATE investments SET name = ?, amount = ?, date = ?, category = ? WHERE id = ?`,
      [name, amount, date, category, id],
      function (err) {
        if (err) {
          console.error("🚨 Error updating investment:", err);
          return res.status(500).json({ error: "Server error while updating investment." });
        }

        console.log(`✅ Investment ID ${id} updated successfully`);
        res.json({ success: true, message: `Investment ID ${id} updated.` });
      }
    );
  });
};

// ❌ Delete an investment
exports.deleteInvestment = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Investment ID is required." });
  }

  db.get("SELECT * FROM investments WHERE id = ?", [id], (err, row) => {
    if (err) {
      console.error("🚨 Error checking investment existence:", err);
      return res.status(500).json({ error: "Server error." });
    }

    if (!row) {
      console.warn(`❌ Investment ID ${id} not found.`);
      return res.status(404).json({ error: `Investment ID ${id} not found.` });
    }

    db.run("DELETE FROM investments WHERE id = ?", id, function (err) {
      if (err) {
        console.error("🚨 Error deleting investment:", err);
        return res.status(500).json({ error: "Server error while deleting investment." });
      }

      console.log(`🗑️ Investment ID ${id} deleted successfully`);
      res.json({ success: true, message: `Investment ID ${id} deleted.` });
    });
  });
};
