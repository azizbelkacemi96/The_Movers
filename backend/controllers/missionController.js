const db = require("../models/database");

// 📌 Récupérer toutes les missions
exports.getAllMissions = (req, res) => {
    db.all("SELECT * FROM missions", [], (err, rows) => {
        if (err) {
            console.error("❌ Erreur lors de la récupération des missions :", err);
            return res.status(500).json({ error: "Erreur serveur." });
        }
        res.json(rows);
    });
};

// 📌 Ajouter une mission
exports.createMission = (req, res) => {
    const { type, client, adresse, date, prixHT, prixTTC, salaire, charges, employe } = req.body;

    if (!type || !client || !date) {
        return res.status(400).json({ error: "⚠️ Tous les champs obligatoires doivent être remplis." });
    }

    console.log("📥 Données reçues pour ajout mission :", req.body);

    db.run(
        `INSERT INTO missions (type, client, adresse, date, prixHT, prixTTC, salaire, charges, employe) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [type, client, adresse || "", date, prixHT || 0, prixTTC || 0, salaire || 0, charges || 0, employe || ""],
        function (err) {
            if (err) {
                console.error("🚨 Erreur lors de l'ajout de la mission :", err);
                return res.status(500).json({ error: "Erreur serveur." });
            }
            res.json({ success: true, id: this.lastID });
        }
    );
};

// 📌 Modifier une mission
exports.updateMission = (req, res) => {
    const { type, client, adresse, date, prixHT, prixTTC, salaire, charges, employe } = req.body;
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "❌ ID de mission non fourni." });
    }

    db.run(
        `UPDATE missions SET type = ?, client = ?, adresse = ?, date = ?, prixHT = ?, prixTTC = ?, salaire = ?, charges = ?, employe = ? WHERE id = ?`,
        [type, client, adresse || "", date, prixHT || 0, prixTTC || 0, salaire || 0, charges || 0, employe || "", id],
        function (err) {
            if (err) {
                console.error("🚨 Erreur lors de la mise à jour :", err);
                return res.status(500).json({ error: "Erreur serveur." });
            }
            res.json({ success: true, message: `✅ Mission ID ${id} mise à jour avec succès.` });
        }
    );
};

// 📌 Supprimer une mission
exports.deleteMission = (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "❌ ID de mission non fourni." });
    }

    db.run("DELETE FROM missions WHERE id = ?", id, function (err) {
        if (err) {
            console.error("🚨 Erreur lors de la suppression :", err);
            return res.status(500).json({ error: "Erreur serveur." });
        }
        res.json({ success: true, message: `✅ Mission ID ${id} supprimée avec succès.` });
    });
};
