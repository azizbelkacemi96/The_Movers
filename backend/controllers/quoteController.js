const db = require("../models/database");
const path = require("path");
const fs = require("fs");
const generateQuotePDF = require("../utils/generateQuotePDF");

// 📥 Get all quotes
exports.getAllQuotes = (req, res) => {
  db.all("SELECT * FROM quotes", [], (err, rows) => {
    if (err) {
      console.error("❌ Error fetching quotes:", err);
      return res.status(500).json({ error: "Server error." });
    }
    res.json(rows);
  });
};

// ➕ Create a new quote
exports.createQuote = (req, res) => {
  const {
    client_name,
    client_address,
    client_city,
    date,
    prestations,
    totalHT,
    totalTVA,
    totalTTC,
  } = req.body;

  console.log("📥 Received data for new quote:", req.body);

  if (!client_name || !client_address || !client_city || !date || !prestations) {
    return res.status(400).json({ error: "All required fields must be provided." });
  }

  const prestationsJSON = JSON.stringify(prestations);

  db.run(
    `
    INSERT INTO quotes (client_name, client_address, client_city, date, prestations, totalHT, totalTVA, totalTTC)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `,
    [
      client_name,
      client_address,
      client_city,
      date,
      prestationsJSON,
      totalHT,
      totalTVA,
      totalTTC,
    ],
    function (err) {
      if (err) {
        console.error("🚨 Error creating quote:", err);
        return res.status(500).json({ error: "Server error." });
      }
      console.log(`✅ Quote created successfully (ID ${this.lastID})`);
      res.json({ success: true, id: this.lastID });
    }
  );
};

// 🔄 Update an existing quote
exports.updateQuote = (req, res) => {
  const { id } = req.params;
  const {
    client_name,
    client_address,
    client_city,
    date,
    prestations,
    totalHT,
    totalTVA,
    totalTTC,
  } = req.body;

  const prestationsJSON = JSON.stringify(prestations);

  console.log(`🔄 Updating quote ID ${id} with data:`, req.body);

  db.run(
    `
    UPDATE quotes
    SET client_name = ?, client_address = ?, client_city = ?, date = ?, prestations = ?, totalHT = ?, totalTVA = ?, totalTTC = ?
    WHERE id = ?
  `,
    [
      client_name,
      client_address,
      client_city,
      date,
      prestationsJSON,
      totalHT,
      totalTVA,
      totalTTC,
      id,
    ],
    function (err) {
      if (err) {
        console.error("❌ Error updating quote:", err);
        return res.status(500).json({ error: "Server error" });
      }

      res.json({ success: true });
    }
  );
};

// 🗑️ Delete a quote
exports.deleteQuote = (req, res) => {
  const { id } = req.params;

  console.log(`🗑️ Deleting quote ID ${id}`);

  db.run("DELETE FROM quotes WHERE id = ?", [id], function (err) {
    if (err) {
      console.error("❌ Error deleting quote:", err);
      return res.status(500).json({ error: "Server error" });
    }

    console.log(`✅ Quote ID ${id} deleted`);
    res.json({ success: true });
  });
};

// 📄 Generate quote PDF
exports.generateQuotePDF = (req, res) => {
  const { id } = req.params;

  db.get("SELECT * FROM quotes WHERE id = ?", [id], async (err, quote) => {
    if (err || !quote) {
      console.error("❌ Error fetching quote:", err);
      return res.status(500).json({ error: "Quote not found or server error." });
    }

    try {
      quote.prestations = JSON.parse(quote.prestations);
    } catch (parseError) {
      console.error("❌ Error parsing prestations:", parseError);
      quote.prestations = [];
    }

    const fileName = `Quote-${quote.id}.pdf`;
    const outputDir = path.join(__dirname, "../public/quotes");
    const outputPath = path.join(outputDir, fileName);

    try {
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      await generateQuotePDF(quote, outputPath);

      if (!fs.existsSync(outputPath)) {
        return res.status(500).json({ error: "❌ PDF could not be generated." });
      }

      console.log(`📄 PDF generated for quote ID ${quote.id}: ${outputPath}`);
      res.download(outputPath, fileName);
    } catch (pdfError) {
      console.error("PDF Error:", pdfError);
      res.status(500).json({ error: "Error generating the PDF." });
    }
  });
};
