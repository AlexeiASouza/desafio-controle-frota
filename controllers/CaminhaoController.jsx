const Caminhao = require("../models/Caminhao.jsx");

// Obtém todos os caminhões
exports.getAllCaminhoes = async (req, res) => {
  try {
    const caminhoes = await Caminhao.find();
    res.status(200).json(caminhoes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtém todos os caminhões de uma frota
exports.getCaminhoesByFrota = async (req, res) => {
  try {
    const caminhoes = await Caminhao.find({ frota: req.params.frota });
    res.status(200).json(caminhoes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cria um caminhão
exports.createCaminhao = async (req, res) => {
  const { placa, frota } = req.body;

  try {
    const novoCaminhao = new Caminhao({ placa, frota });
    const caminhaoSalvo = await novoCaminhao.save();
    res.status(201).json(caminhaoSalvo);
  } catch (err) {
    res.status(400).json({ message: "Caminhão já cadastrado?" });
  }
};

// Deleta um caminhão
exports.deleteCaminhao = async (req, res) => {
  try {
    await Caminhao.findOneAndDelete(req.params.placa);
    res.status(200).json({ message: "Caminhão deletado com sucesso" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
