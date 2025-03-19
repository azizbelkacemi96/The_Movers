const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const db = new sqlite3.Database('./database.sqlite');

// Initialisation de la table missions
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS missions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT,
    date TEXT,
    client TEXT,
    prixHT REAL,
    prixTTC REAL,
    employe TEXT,
    salaire REAL,
    charges REAL
  )`);
});

// Obtenir toutes les missions
app.get('/missions', (req, res) => {
  db.all("SELECT * FROM missions ORDER BY date DESC", [], (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
});

// Ajouter une mission
app.post('/missions', (req, res) => {
  const { type, date, client, prixHT, prixTTC, employe, salaire, charges } = req.body;
  const stmt = db.prepare("INSERT INTO missions (type, date, client, prixHT, prixTTC, employe, salaire, charges) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
  stmt.run(type, date, client, prixHT, prixTTC, employe, salaire, charges, function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

// Modifier une mission par ID
app.put('/missions/:id', (req, res) => {
  const { type, date, client, prixHT, prixTTC, employe, salaire, charges } = req.body;
  db.run(
    "UPDATE missions SET type=?, date=?, client=?, prixHT=?, prixTTC=?, employe=?, salaire=?, charges=? WHERE id=?",
    [type, date, client, prixHT, prixTTC, employe, salaire, charges, req.params.id],
    (err) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ updated: true });
    }
  );
});

// Supprimer une mission par ID
app.delete('/missions/:id', (req, res) => {
  db.run("DELETE FROM missions WHERE id = ?", req.params.id, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ deleted: true });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ API démarrée sur le port ${PORT}`);
});
