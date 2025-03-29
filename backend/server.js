const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./models/database");

const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "public")));

// Routes
app.use("/appointments", require("./routes/appointmentRoutes"));
app.use("/missions", require("./routes/missionRoutes"));
app.use("/quote", require("./routes/quoteRoutes"));
app.use("/investors", require("./routes/investorRoutes"));
app.use("/transactions", require("./routes/transactionRoutes"));

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
