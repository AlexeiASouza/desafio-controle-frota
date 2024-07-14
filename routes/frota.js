const express = require("express");
const router = express.Router();
const FrotaController = require("../controllers/FrotaController.js");

router.get("/frota/:frota", FrotaController.getFrotaList);

module.exports = router;
