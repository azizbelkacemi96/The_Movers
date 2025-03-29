const express = require("express");
const router = express.Router();
const quoteController = require("../controllers/quoteController");

router.get("/", quoteController.getAllQuotes);
router.post("/", quoteController.createQuote);
router.put("/:id", quoteController.updateQuote);
router.delete("/:id", quoteController.deleteQuote);
router.get("/generate/:id", quoteController.generateQuotePDF);

module.exports = router;
