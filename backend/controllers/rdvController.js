const db = require("../models/database");

// 📌 Récupérer tous les RDVs
exports.getAllRdvs = (req, res) => {
    db.all("SELECT * FROM rdvs", [], (err, rows) => {
        if (err) {
            console.error("❌ Erreur lors de la récupération des RDVs :", err);
            return res.status(500).json({ error: "Erreur serveur." });
        }
        res.json(rows);
    });
};

// 📌 Ajouter un RDV
exports.createRdv = (req, res) => {
    const { client, telephone, adresse, date, type } = req.body;

    if (!client || !date || !type) {
        return res.status(400).json({ error: "⚠️ Tous les champs obligatoires doivent être remplis." });
    }

    db.run(`INSERT INTO rdvs (client, telephone, adresse, date, type) VALUES (?, ?, ?, ?, ?)`,
        [client, telephone || "", adresse || "", date, type],
        function (err) {
            if (err) {
                console.error("🚨 Erreur lors de l'ajout du RDV :", err);
                return res.status(500).json({ error: "Erreur serveur." });
            }
            res.json({ success: true, id: this.lastID });
        }
    );
};

// 📌 Modifier un RDV
exports.updateRdv = (req, res) => {
    const { client, telephone, adresse, date, type } = req.body;
    const { id } = req.params;

    db.run(`UPDATE rdvs SET client = ?, telephone = ?, adresse = ?, date = ?, type = ? WHERE id = ?`,
        [client, telephone || "", adresse || "", date, type, id],
        function (err) {
            if (err) {
                console.error("🚨 Erreur lors de la mise à jour :", err);
                return res.status(500).json({ error: "Erreur serveur." });
            }
            res.json({ success: true, message: "RDV mis à jour avec succès." });
        }
    );
};

// 📌 Supprimer un RDV
exports.deleteRdv = (req, res) => {
    db.run("DELETE FROM rdvs WHERE id = ?", req.params.id, function (err) {
        if (err) {
            console.error("🚨 Erreur lors de la suppression :", err);
            return res.status(500).json({ error: "Erreur serveur." });
        }
        res.json({ success: true, message: "RDV supprimé avec succès." });
    });
};
