const mongoose = require("mongoose");

const CaminhaoSchema = new mongoose.Schema({
  placa: { type: String, required: true, unique: true },
  frota: { type: String, required: true },
});
module.exports = mongoose.model("Caminhao", CaminhaoSchema);
