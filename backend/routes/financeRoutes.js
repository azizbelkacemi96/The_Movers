const express = require("express");
const router = express.Router();
const financeController = require("../controllers/financeController");

router.get("/", financeController.getAllInvestments);
router.post("/", financeController.createInvestment);
router.put("/:id", financeController.updateInvestment);
router.delete("/:id", financeController.deleteInvestment);

module.exports = router;
