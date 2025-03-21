const express = require("express");
const cors = require("cors");
const db = require("./models/database");

const app = express();
app.use(express.json());
app.use(cors());

// 📌 Importer les routes
const rdvRoutes = require("./routes/rdvRoutes");
const missionRoutes = require("./routes/missionRoutes");
const financeRoutes = require("./routes/financeRoutes");

app.use("/rdvs", rdvRoutes);
app.use("/missions", missionRoutes);
app.use("/finance", financeRoutes);

// 📌 Démarrer le serveur
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Serveur en écoute sur http://localhost:${PORT}`));
