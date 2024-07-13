const mongoose = require("mongoose");

// Note que os parâmetros unique são false pois no arquivo pode haver repetição
const EntregaArquivadaSchema = new mongoose.Schema({
  placaCaminhao: {
    type: String,
    required: true,
    unique: false,
  },
  nomeMotorista: {
    type: String,
    required: true,
  },
  motoristaId: {
    type: String,
    required: true,
    unique: false,
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

module.exports = mongoose.model("EntregaArquivada", EntregaArquivadaSchema);
