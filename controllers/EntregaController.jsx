const Entrega = require("../models/Entrega.jsx");
const EntregaArquivada = require("../models/EntregaArquivada.jsx");
const Caminhao = require("../models/Caminhao.jsx");

// Obtém todas as entregas
exports.getAllEntregas = async (req, res) => {
  try {
    const entregas = await Entrega.find().populate(
      "placaCaminhao nomeMotorista"
    );
    res.status(200).json(entregas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cria uma entrega - AS REGRAS DE NEGÓCIO SÃO CRIADAS AQUI!!
// Questão 1 - no Modelo da Entrega a placa é unique assim um caminhão poderá estar associado a apenas uma entrega.
exports.createEntrega = async (req, res) => {
  const {
    placaCaminhao,
    nomeMotorista,
    motoristaId,
    tipoCarga,
    valor,
    dataEntrega,
    destino,
    taxaFrete,
    possuiSeguro,
  } = req.body;
  try {
    // Verifica se o Caminhao  está cadastrado no sistema
    const caminhao = await Caminhao.findOne({ placa: placaCaminhao });
    if (!caminhao) {
      return res
        .status(400)
        .json({ message: "Caminhão com placa especificada não encontrado." });
    }

    // Calcula o primeiro e último dia do mês atual
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    const endOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0
    );

    // Contar as entregas ativas e arquivadas do motorista no mês atual
    const entregasAtivasCount = await Entrega.countDocuments({
      motoristaId,
      dataEntrega: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const entregasArquivadasCount = await EntregaArquivada.countDocuments({
      motoristaId,
      dataEntrega: { $gte: startOfMonth, $lte: endOfMonth },
    });

    // Questão 6 - Verifica quantas entregas o Motorista fez no mês, sendo 2 o máximo permitido
    const totalEntregas = entregasAtivasCount + entregasArquivadasCount;

    if (totalEntregas >= 2) {
      return res
        .status(400)
        .json({ message: "O motorista só pode ter 2 entregas por mês." });
    }

    // Questão 10 - Verifica se o motorista já fez uma entrega para o Nordeste no mês, sendo 1 entrega o máximo permitido
    if (destino === "Nordeste") {
      const entregasNordeste = await Entrega.countDocuments({
        motoristaId,
        destino: "Nordeste",
        dataEntrega: { $gte: startOfMonth, $lte: endOfMonth },
      });
      const entregasNordesteArquivada = await EntregaArquivada.countDocuments({
        motoristaId,
        destino: "Nordeste",
        dataEntrega: { $gte: startOfMonth, $lte: endOfMonth },
      });

      const totalEntregasNordeste =
        entregasNordeste + entregasNordesteArquivada;

      if (totalEntregasNordeste >= 1) {
        return res.status(400).json({
          error: "Motorista já fez uma entrega para o Nordeste este mês.",
        });
      }
    }

    //Questão 5 - Verifica quantas entregas um caminhão já fez no mês, sendo o máximo permitido 4
    const entregasCaminhao = await Entrega.countDocuments({
      placaCaminhao,
      dataEntrega: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const entregasCaminhaoArquivada = await EntregaArquivada.countDocuments({
      placaCaminhao,
      dataEntrega: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const totalEntregasCaminhao = entregasCaminhao + entregasCaminhaoArquivada;

    if (totalEntregasCaminhao >= 4) {
      return res
        .status(400)
        .json({ message: "O caminhão já fez 4 entregas este mês." });
    }

    const novaEntrega = new Entrega({
      placaCaminhao,
      nomeMotorista,
      motoristaId,
      tipoCarga,
      valor,
      dataEntrega,
      destino,
      taxaFrete,
      possuiSeguro,
    });

    //Questão 2 -
    if (valor > 30000) novaEntrega.indicadores.valiosa = true;

    //Questão 3 - Note que o modelo Entrega possui um capo possuiSeguro que somente será ativado se o seguro for True
    if (tipoCarga === "Eletrônicos") novaEntrega.indicadores.seguro = true;

    //Questão 4 -
    if (tipoCarga === "Combustível") novaEntrega.indicadores.perigosa = true;

    switch (destino) {
      //Questão 7 -
      case "Nordeste":
        novaEntrega.taxaFrete += taxaFrete * 0.2;
        break;
      //Questão 8 -
      case "Argentina":
        novaEntrega.taxaFrete += taxaFrete * 0.4;
        break;
      //Questão 9
      case "Amazônia":
        novaEntrega.taxaFrete += taxaFrete * 0.3;
        break;
      default:
        novaEntrega.taxaFrete = taxaFrete;
    }

    const entregaSalva = await novaEntrega.save();
    res.status(201).json(entregaSalva);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Finaliza a entrega e envia para o arquivo de entregas
exports.finalizarEntrega = async (req, res) => {
  const { placa } = req.params;

  try {
    // Encontrar a entrega pela placa do caminhão
    const entrega = await Entrega.findOne({
      placaCaminhao: placa,
    });

    if (!entrega) {
      return res.status(404).json({ message: "Entrega não encontrada." });
    }

    // Arquivar a entrega
    const entregaArquivada = new EntregaArquivada(entrega.toObject());
    await entregaArquivada.save();

    await Entrega.deleteOne({ _id: entrega._id });

    res.status(200).json({ message: "Entrega finalizada com sucesso." });
  } catch (err) {
    console.error("Erro ao finalizar entrega:", err);
    res.status(500).json({
      message:
        "Erro ao finalizar entrega. Por favor, tente novamente mais tarde.",
    });
  }
};

// Obtém as entregas arquivadas
exports.getEntregasArquivadas = async (req, res) => {
  try {
    const entregasArquivadas = await EntregaArquivada.find();
    res.status(200).json(entregasArquivadas);
  } catch (err) {
    console.error("Erro ao buscar entregas arquivadas:", err);
    res.status(500).json({
      message:
        "Erro ao buscar entregas arquivadas. Por favor, tente novamente mais tarde.",
    });
  }
};

// Lista as entregas com relação a placa do caminhão
exports.ListEntregasPorPlaca = async (req, res) => {
  const { placa } = req.params;

  try {
    const entregasAtuais = await Entrega.find({ placaCaminhao: placa });
    const entregasArquivadas = await EntregaArquivada.find({
      placaCaminhao: placa,
    });

    const entregasComStatus = [
      ...entregasAtuais.map((entrega) => ({
        ...entrega.toObject(),
        status: "ACTIVE",
      })),
      ...entregasArquivadas.map((entrega) => ({
        ...entrega.toObject(),
        status: "FINISHED",
      })),
    ];

    res.status(200).json(entregasComStatus);
  } catch (err) {
    console.error("Erro ao buscar entregas:", err);
    res.status(500).json({
      message:
        "Erro ao buscar entregas. Por favor, tente novamente mais tarde.",
    });
  }
};
