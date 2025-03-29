const db = require("../models/database");

// 📥 Add investor
exports.addInvestor = (req, res) => {
  const { name } = req.body;
  if (!name) {
    console.warn("⚠️ Missing name in addInvestor");
    return res.status(400).json({ error: "Name is required" });
  }

  const sql = "INSERT INTO investors (name) VALUES (?)";
  db.run(sql, [name], function (err) {
    if (err) {
      console.error("❌ Failed to add investor:", err.message);
      return res.status(500).json({ error: err.message });
    }
    console.log("✅ Investor added:", { id: this.lastID, name });
    res.json({ id: this.lastID, name });
  });
};

// 📋 Get all investors with balances
exports.getAllInvestors = (req, res) => {
  const sql = `
    SELECT i.id, i.name,
      IFNULL(SUM(CASE WHEN t.type = 'deposit' THEN t.amount ELSE 0 END), 0) AS totalDeposits,
      IFNULL(SUM(CASE WHEN t.type = 'withdrawal' THEN t.amount ELSE 0 END), 0) AS totalWithdrawals,
      IFNULL(SUM(CASE WHEN t.type = 'deposit' THEN t.amount ELSE 0 END), 0)
        - IFNULL(SUM(CASE WHEN t.type = 'withdrawal' THEN t.amount ELSE 0 END), 0) AS balance
    FROM investors i
    LEFT JOIN investor_transactions t ON i.id = t.investor_id
    GROUP BY i.id, i.name
    ORDER BY i.name ASC
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("❌ Failed to get investors:", err.message);
      return res.status(500).json({ error: err.message });
    }
    console.log("📄 Retrieved investors:", rows.length);
    res.json(rows);
  });
};

// 📝 Update investor
exports.updateInvestor = (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) {
    console.warn("⚠️ Missing name in updateInvestor");
    return res.status(400).json({ error: "Name is required" });
  }

  const sql = "UPDATE investors SET name = ? WHERE id = ?";
  db.run(sql, [name, id], function (err) {
    if (err) {
      console.error("❌ Failed to update investor:", err.message);
      return res.status(500).json({ error: err.message });
    }
    console.log("🔄 Investor updated:", { id, name });
    res.json({ success: true });
  });
};

// ❌ Delete investor
exports.deleteInvestor = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM investors WHERE id = ?";
  db.run(sql, [id], function (err) {
    if (err) {
      console.error("❌ Failed to delete investor:", err.message);
      return res.status(500).json({ error: err.message });
    }
    console.log("🗑️ Investor deleted:", id);
    res.json({ success: true });
  });
};
