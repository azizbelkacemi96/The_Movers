const express = require("express");
const router = express.Router();
const investorController = require("../controllers/investorController");

router.get("/", investorController.getAllInvestors);
router.post("/", investorController.addInvestor);
router.put("/:id", investorController.updateInvestor);
router.delete("/:id", investorController.deleteInvestor);

module.exports = router;
