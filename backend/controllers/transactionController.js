const db = require("../models/database");

// ➕ Add transaction
exports.addTransaction = (req, res) => {
  const { investor_id, type, amount, date, category } = req.body;
  if (!investor_id || !type || !amount || !date) {
    console.warn("⚠️ Missing fields in addTransaction");
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql = `
    INSERT INTO investor_transactions (investor_id, type, amount, date, category)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.run(sql, [investor_id, type, amount, date, category], function (err) {
    if (err) {
      console.error("❌ Failed to add transaction:", err.message);
      return res.status(500).json({ error: err.message });
    }
    console.log("✅ Transaction added:", { id: this.lastID, investor_id, type, amount, date });
    res.json({ id: this.lastID });
  });
};

// 📄 Get transactions by investor
exports.getTransactionsByInvestor = (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM investor_transactions WHERE investor_id = ? ORDER BY date DESC";
  db.all(sql, [id], (err, rows) => {
    if (err) {
      console.error("❌ Failed to get transactions:", err.message);
      return res.status(500).json({ error: err.message });
    }
    console.log(`📄 Retrieved ${rows.length} transactions for investor ${id}`);
    res.json(rows.map(r => ({ ...r, investor_id: id })));
  });
};

// ✏️ Update transaction
exports.updateTransaction = (req, res) => {
  const { id } = req.params;
  const { investor_id, type, amount, date, category } = req.body;
  if (!investor_id || !type || !amount || !date) {
    console.warn("⚠️ Missing fields in updateTransaction");
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql = `
    UPDATE investor_transactions
    SET investor_id = ?, type = ?, amount = ?, date = ?, category = ?
    WHERE id = ?
  `;
  db.run(sql, [investor_id, type, amount, date, category, id], function (err) {
    if (err) {
      console.error("❌ Failed to update transaction:", err.message);
      return res.status(500).json({ error: err.message });
    }
    console.log("🔄 Transaction updated:", { id, investor_id, type, amount });
    res.json({ success: true });
  });
};

// 🗑️ Delete transaction
exports.deleteTransaction = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM investor_transactions WHERE id = ?";
  db.run(sql, [id], function (err) {
    if (err) {
      console.error("❌ Failed to delete transaction:", err.message);
      return res.status(500).json({ error: err.message });
    }
    console.log("🗑️ Transaction deleted:", id);
    res.json({ success: true });
  });
};
