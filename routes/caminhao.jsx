const express = require("express");
const router = express.Router();
const CaminhaoController = require("../controllers/CaminhaoController.jsx");

router.get("/", CaminhaoController.getAllCaminhoes);
router.get("/frota/:frota", CaminhaoController.getCaminhoesByFrota);
router.post("/", CaminhaoController.createCaminhao);
router.delete("/:id", CaminhaoController.deleteCaminhao);

module.exports = router;
