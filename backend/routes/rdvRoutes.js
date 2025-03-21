const express = require("express");
const router = express.Router();
const rdvController = require("../controllers/rdvController");

router.get("/", rdvController.getAllRdvs);
router.post("/", rdvController.createRdv);
router.put("/:id", rdvController.updateRdv);
router.delete("/:id", rdvController.deleteRdv);

module.exports = router;
