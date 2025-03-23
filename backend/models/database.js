const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("database.sqlite", (err) => {
    if (err) {
        console.error("❌ Erreur lors de l'ouverture de la base de données :", err.message);
    } else {
        console.log("✅ Connexion réussie à la base de données.");
    }
});

// 📌 Création des tables si elles n'existent pas
db.serialize(() => {
    // 📆 Table des rendez-vous
    db.run(`
        CREATE TABLE IF NOT EXISTS rdvs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client TEXT NOT NULL,
            telephone TEXT,
            adresse TEXT,
            date TEXT NOT NULL,
            type TEXT NOT NULL
        )
    `);

    // 📦 Table des missions
    db.run(`
        CREATE TABLE IF NOT EXISTS missions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL,
            client TEXT NOT NULL,
            adresse TEXT DEFAULT '',
            date TEXT NOT NULL,
            prixHT REAL DEFAULT 0,
            prixTTC REAL DEFAULT 0,
            salaire REAL DEFAULT 0,
            charges REAL DEFAULT 0
        )
    `);
    
    // 💰 Table des investissements
    db.run(`
        CREATE TABLE IF NOT EXISTS investissements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nom TEXT NOT NULL,
            montant REAL NOT NULL,
            date TEXT NOT NULL,
            categorie TEXT NOT NULL
        )
    `);

    // 📜 Table des devis
    db.run(`
        CREATE TABLE IF NOT EXISTS devis (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            numero TEXT NOT NULL UNIQUE,
            client_nom TEXT NOT NULL,
            client_adresse TEXT NOT NULL,
            client_ville TEXT NOT NULL,
            date TEXT NOT NULL,
            prestations TEXT NOT NULL,  -- Stocke sous forme JSON
            totalHT REAL NOT NULL,
            totalTVA REAL NOT NULL,
            totalTTC REAL NOT NULL
        )
    `);
});

module.exports = db;
