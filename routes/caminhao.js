const express = require("express");
const router = express.Router();
const CaminhaoController = require("../controllers/CaminhaoController.js");

router.get("/", CaminhaoController.getAllCaminhoes);
router.get("/frota/:frota", CaminhaoController.getCaminhoesByFrota);
router.post("/", CaminhaoController.createCaminhao);
router.delete("/:id", CaminhaoController.deleteCaminhao);

module.exports = router;
