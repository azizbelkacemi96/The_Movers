const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("database.sqlite", (err) => {
  if (err) {
    console.error("❌ Failed to open database:", err.message);
  } else {
    console.log("✅ Successfully connected to the database.");
  }
});

db.serialize(() => {
  // 🗓️ Appointments table
  db.run(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client TEXT NOT NULL,
      phone TEXT,
      address TEXT,
      date TEXT NOT NULL,
      type TEXT NOT NULL
    )
  `);

  // 📦 Missions table
  db.run(`
    CREATE TABLE IF NOT EXISTS missions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      client TEXT NOT NULL,
      address TEXT DEFAULT '',
      date TEXT NOT NULL,
      priceHT REAL DEFAULT 0,
      priceTTC REAL DEFAULT 0,
      salary REAL DEFAULT 0,
      charges REAL DEFAULT 0,
      employee TEXT DEFAULT ''
    )
  `);

  // 💰 Investments table
  db.run(`
    CREATE TABLE IF NOT EXISTS investments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      amount REAL NOT NULL,
      date TEXT NOT NULL,
      category TEXT NOT NULL
    )
  `);

  // 📜 Quotes table
  db.run(`
    CREATE TABLE IF NOT EXISTS quotes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_name TEXT NOT NULL,
      client_address TEXT NOT NULL,
      client_city TEXT NOT NULL,
      date TEXT NOT NULL,
      prestations TEXT NOT NULL,
      totalHT REAL,
      totalTVA REAL,
      totalTTC REAL
    )
  `);
});

module.exports = db;
