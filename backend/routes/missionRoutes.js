const express = require("express");
const router = express.Router();
const missionController = require("../controllers/missionController");

router.get("/", missionController.getAllMissions);
router.post("/", missionController.createMission);
router.put("/:id", missionController.updateMission);
router.delete("/:id", missionController.deleteMission);

module.exports = router;
