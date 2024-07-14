const mongoose = require("mongoose");

const EntregaSchema = new mongoose.Schema({
  placaCaminhao: {
    type: String,
    required: true,
    unique: true,
  },
  nomeMotorista: {
    type: String,
    required: true,
  },
  motoristaId: {
    type: String,
    required: true,
    unique: true,
  },
  tipoCarga: { type: String, required: true },
  valor: { type: Number, required: true },
  dataEntrega: { type: Date, required: true },
  destino: { type: String, required: true },
  indicadores: {
    valiosa: { type: Boolean, default: false },
    seguro: { type: Boolean, default: false },
    perigosa: { type: Boolean, default: false },
  },
  taxaFrete: { type: Number, required: true },
  possuiSeguro: { type: Boolean, default: false },
});

module.exports = mongoose.model("Entrega", EntregaSchema);
