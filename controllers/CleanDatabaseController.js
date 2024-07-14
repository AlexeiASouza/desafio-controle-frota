const Entrega = require("../models/Entrega.js");
const EntregaArquivada = require("../models/EntregaArquivada.js");
const Caminhao = require("../models/Caminhao.js");

// Limpa TODOS os dados do Banco!
exports.cleanDatabase = async (req, res) => {
  try {
    await Entrega.deleteMany({});
    await EntregaArquivada.deleteMany({});
    await Caminhao.deleteMany({});

    res.status(200).json({ message: "Banco de dados limpo com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao limpar o banco de dados." });
  }
};
