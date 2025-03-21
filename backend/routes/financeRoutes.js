const express = require("express");
const router = express.Router();
const financeController = require("../controllers/financeController");

router.get("/", financeController.getAllInvestissements);
router.post("/", financeController.createInvestissement);
router.put("/:id", financeController.updateInvestissement);
router.delete("/:id", financeController.deleteInvestissement);

module.exports = router;
