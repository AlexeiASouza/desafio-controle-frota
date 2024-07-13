const express = require("express");
const router = express.Router();
const EntregaController = require("../controllers/EntregaController.jsx");

router.get("/", EntregaController.getAllEntregas);
router.get("/arquivadas", EntregaController.getEntregasArquivadas);
router.get("/placa/:placa", EntregaController.ListEntregasPorPlaca);
router.post("/", EntregaController.createEntrega);
router.post("/finalizar/:placa", EntregaController.finalizarEntrega);

module.exports = router;
