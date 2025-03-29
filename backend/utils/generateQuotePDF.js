const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const handlebars = require("handlebars");

async function generateQuotePDF(quote, outputPath) {
  try {
    console.log("🔧 Generating PDF for quote:", quote.id);

    const templatePath = path.join(__dirname, "../templates/quoteTemplate.html");
    console.log("📄 Template path resolved:", templatePath);

    const templateHtml = fs.readFileSync(templatePath, "utf-8");
    console.log("📄 HTML template loaded successfully");

    const logoPath = "http://localhost:8080/public/logo.jpg";
    console.log("🖼️ Logo path set to:", logoPath);

    const compiledTemplate = handlebars.compile(templateHtml);

    const prestations = quote.prestations.map(p => ({
      ...p,
      total: (p.prix * p.quantite).toFixed(2),
    }));

    const html = compiledTemplate({
      quote_id: quote.id,
      date: quote.date,
      client_name: quote.client_name,
      client_address: quote.client_address,
      client_city: quote.client_city,
      client_email: quote.client_email || "—",
      prestations,
      totalHT: quote.totalHT.toFixed(2),
      totalTVA: quote.totalTVA.toFixed(2),
      totalTTC: quote.totalTTC.toFixed(2),
      logoPath,
      company: {
        name: "The Movers",
        email: "themovers.contact@gmail.com",
        address: "9 rue de Wattignies",
        city: "Paris",
        zip: "75012",
        phone: "07 52 97 69 34",
      }
    });
    
    console.log("✅ HTML content compiled for rendering");

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    console.log("🌐 Puppeteer browser launched");

    await page.setContent(html, { waitUntil: "networkidle0" });
    console.log("🧾 HTML content set on Puppeteer page");

    await page.pdf({ path: outputPath, format: "A4", printBackground: true });
    console.log("✅ PDF generated and saved to:", outputPath);

    await browser.close();
    console.log("🛑 Puppeteer browser closed");

    return outputPath;

  } catch (error) {
    console.error("❌ Error while generating PDF:", error);
    throw error;
  }
}

module.exports = generateQuotePDF;
