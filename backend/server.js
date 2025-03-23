const express = require("express");
const cors = require("cors");
const db = require("./models/database");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// 📌 Servir les fichiers statiques (logos, PDF de devis, etc.)
app.use("/public", express.static(path.join(__dirname, "public")));

// 📌 Importer les routes
const rdvRoutes = require("./routes/rdvRoutes");
const missionRoutes = require("./routes/missionRoutes");
const financeRoutes = require("./routes/financeRoutes");
const devisRoutes = require("./routes/devisRoutes");


app.use("/rdvs", rdvRoutes);
app.use("/missions", missionRoutes);
app.use("/finance", financeRoutes);
app.use("/devis", devisRoutes);

// 📌 Démarrer le serveur
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Serveur en écoute sur http://localhost:${PORT}`));
