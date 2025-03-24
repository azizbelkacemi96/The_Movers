const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const handlebars = require("handlebars");

async function generateDevisPDF(devis) {
  const templatePath = path.join(__dirname, "../templates/devisTemplate.html");
  const templateHtml = fs.readFileSync(templatePath, "utf-8");

  // Détermine le chemin vers le logo
  const logoPath = `http://localhost:5000/public/logo.jpg`;

  const compiledTemplate = handlebars.compile(templateHtml);

  // Formate les prestations avec total TTC par ligne
  const prestations = devis.prestations.map(p => ({
    ...p,
    total: (p.prix * p.quantite).toFixed(2)
  }));

  const html = compiledTemplate({
    numero: devis.numero,
    date: devis.date,
    echeance: devis.echeance || devis.date,
    client_nom: devis.client_nom,
    client_adresse: devis.client_adresse,
    client_ville: devis.client_ville,
    client_email: devis.client_email || "—",
    prestations,
    totalHT: devis.totalHT.toFixed(2),
    totalTVA: devis.totalTVA.toFixed(2),
    totalTTC: devis.totalTTC.toFixed(2),
    logoPath,
    societe: {
      nom: "The Movers",
      email: "contact@themovers.fr",
      adresse: "12 Rue des Exemples",
      ville: "Paris",
      banque: "BNP Paribas",
      iban: "FR76 3000 4000 0001 2345 6789 123",
      bic: "BNPAFRPP"
    }
  });

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const outputDir = path.join(__dirname, "../public/devis");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const filePath = path.join(outputDir, `Devis-${devis.numero}.pdf`);
  await page.pdf({ path: filePath, format: "A4", printBackground: true });

  await browser.close();

  return filePath;
}

module.exports = generateDevisPDF;
