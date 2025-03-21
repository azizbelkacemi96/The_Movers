const db = require("../models/database");

// 📌 Récupérer tous les investissements
exports.getAllInvestissements = (req, res) => {
    db.all("SELECT * FROM investissements", [], (err, rows) => {
        if (err) {
            console.error("❌ Erreur lors de la récupération des investissements :", err);
            return res.status(500).json({ error: "Erreur serveur." });
        }
        res.json(rows);
    });
};

// 📌 Ajouter un investissement
exports.createInvestissement = (req, res) => {
    const { nom, montant, date, categorie } = req.body;

    if (!nom || !montant || !date || !categorie) {
        return res.status(400).json({ error: "⚠️ Tous les champs obligatoires doivent être remplis." });
    }

    console.log("📥 Données reçues pour ajout d'investissement :", req.body);

    db.run(
        `INSERT INTO investissements (nom, montant, date, categorie) VALUES (?, ?, ?, ?)`,
        [nom, montant, date, categorie],
        function (err) {
            if (err) {
                console.error("🚨 Erreur lors de l'ajout de l'investissement :", err);
                return res.status(500).json({ error: "Erreur serveur lors de l'ajout de l'investissement." });
            }
            console.log(`✅ Investissement ajouté avec succès (ID ${this.lastID})`);
            res.json({ success: true, id: this.lastID });
        }
    );
};

// 📌 Modifier un investissement (Vérification de l'ID avant mise à jour)
exports.updateInvestissement = (req, res) => {
    const { nom, montant, date, categorie } = req.body;
    const { id } = req.params;

    if (!id) {
        console.error("❌ ID d'investissement non fourni.");
        return res.status(400).json({ error: "❌ ID d'investissement non fourni." });
    }

    // Vérifier si l'ID existe avant modification
    db.get("SELECT * FROM investissements WHERE id = ?", [id], (err, row) => {
        if (err) {
            console.error("🚨 Erreur lors de la vérification de l'investissement :", err);
            return res.status(500).json({ error: "Erreur serveur." });
        }
        if (!row) {
            console.warn(`❌ Avertissement : L'investissement ID ${id} n'existe pas.`);
            return res.status(404).json({ error: `❌ Investissement ID ${id} introuvable.` });
        }

        // L'investissement existe, on peut le modifier
        console.log("📥 Données reçues pour modification d'investissement :", req.body);
        db.run(
            `UPDATE investissements SET nom = ?, montant = ?, date = ?, categorie = ? WHERE id = ?`,
            [nom, montant, date, categorie, id],
            function (err) {
                if (err) {
                    console.error("🚨 Erreur lors de la mise à jour de l'investissement :", err);
                    return res.status(500).json({ error: "Erreur serveur lors de la modification de l'investissement." });
                }

                console.log(`✅ Investissement ID ${id} mis à jour avec succès`);
                res.json({ success: true, message: `✅ Investissement ID ${id} mis à jour avec succès.` });
            }
        );
    });
};

// 📌 Supprimer un investissement (Vérification de l'ID avant suppression)
exports.deleteInvestissement = (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "❌ ID d'investissement non fourni." });
    }

    // Vérifier si l'ID existe avant suppression
    db.get("SELECT * FROM investissements WHERE id = ?", [id], (err, row) => {
        if (err) {
            console.error("🚨 Erreur lors de la vérification de l'investissement :", err);
            return res.status(500).json({ error: "Erreur serveur." });
        }
        if (!row) {
            console.warn(`❌ Avertissement : L'investissement ID ${id} n'existe pas.`);
            return res.status(404).json({ error: `❌ Investissement ID ${id} introuvable.` });
        }

        // L'investissement existe, on peut le supprimer
        db.run("DELETE FROM investissements WHERE id = ?", id, function (err) {
            if (err) {
                console.error("🚨 Erreur lors de la suppression :", err);
                return res.status(500).json({ error: "Erreur serveur." });
            }

            console.log(`✅ Investissement ID ${id} supprimé avec succès`);
            res.json({ success: true, message: `✅ Investissement ID ${id} supprimé avec succès.` });
        });
    });
};
