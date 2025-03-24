const db = require("../models/database");
const generateDevisPDF = require("../utils/generateDevisPDF");
const path = require("path");

// 📌 Récupérer tous les devis
exports.getAllDevis = (req, res) => {
  db.all("SELECT * FROM devis", [], (err, rows) => {
    if (err) {
      console.error("❌ Erreur lors de la récupération des devis :", err);
      return res.status(500).json({ error: "Erreur serveur." });
    }
    res.json(rows);
  });
};

// 📌 Ajouter un devis
exports.createDevis = (req, res) => {
  const {
    numero,
    client_nom,
    client_adresse,
    client_ville,
    date,
    prestations,
    totalHT,
    totalTVA,
    totalTTC,
  } = req.body;

  if (
    !numero ||
    !client_nom ||
    !client_adresse ||
    !client_ville ||
    !date ||
    !prestations
  ) {
    return res
      .status(400)
      .json({ error: "⚠️ Tous les champs obligatoires doivent être remplis." });
  }

  const prestationsJSON = JSON.stringify(prestations);

  db.run(
    `
    INSERT INTO devis (numero, client_nom, client_adresse, client_ville, date, prestations, totalHT, totalTVA, totalTTC)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      numero,
      client_nom,
      client_adresse,
      client_ville,
      date,
      prestationsJSON,
      totalHT,
      totalTVA,
      totalTTC,
    ],
    function (err) {
      if (err) {
        console.error("🚨 Erreur lors de l'ajout du devis :", err);
        return res.status(500).json({ error: "Erreur serveur." });
      }
      res.json({ success: true, id: this.lastID });
    }
  );
};

// 📌 Générer le PDF d’un devis
exports.generateDevisPDF = (req, res) => {
  const { id } = req.params;

  db.get("SELECT * FROM devis WHERE id = ?", [id], async (err, devis) => {
    if (err || !devis) {
      console.error("❌ Erreur lors de la récupération du devis :", err);
      return res
        .status(500)
        .json({ error: "Erreur serveur ou devis introuvable." });
    }

    try {
      devis.prestations = JSON.parse(devis.prestations);
    } catch (parseError) {
      console.error("❌ Erreur lors du parsing des prestations :", parseError);
      devis.prestations = [];
    }

    const fileName = `Devis-${devis.numero}.pdf`;
    const outputPath = path.join(__dirname, "../public/devis", fileName);

    try {
      await generateDevisPDF(devis, outputPath);
      res.download(outputPath, fileName);
    } catch (pdfError) {
      console.error("Erreur PDF :", pdfError);
      res.status(500).json({ error: "Erreur lors de la génération du PDF." });
    }
  });
};
