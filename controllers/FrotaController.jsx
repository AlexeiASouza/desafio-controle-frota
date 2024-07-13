const Caminhao = require("../models/Caminhao.jsx");
const Entrega = require("../models/Entrega.jsx");
const EntregaArquivada = require("../models/EntregaArquivada.jsx");

// Obtém os dados para uma determinada frota de caminhões
exports.getFrotaList = async (req, res) => {
  try {
    const { frota } = req.params;
    const caminhoes = await Caminhao.find({ frota });
    const caminhoesData = await Promise.all(
      caminhoes.map(async (caminhao) => {
        // Busca entrega ativa do caminhão
        const entregaAtiva = await Entrega.findOne({
          placaCaminhao: caminhao.placa,
        });
        if (entregaAtiva) {
          // Se há entrega ativa, mostra os detalhes da entrega ativa
          return {
            placa: caminhao.placa,
            status: "Ativo",
            dataEntrega: entregaAtiva.dataEntrega,
            tipoCarga: entregaAtiva.tipoCarga,
            valiosa: entregaAtiva.indicadores.valiosa,
            seguro: entregaAtiva.indicadores.seguro,
            perigosa: entregaAtiva.indicadores.perigosa,
            possuiSeguro: entregaAtiva.possuiSeguro,
          };
        } else {
          // Se não há entrega ativa, retorna status Inativo
          return {
            placa: caminhao.placa,
            status: "Inativo",
          };
        }
      })
    );
    const numCaminhoes = caminhoes.length;

    const entregasHoje = await Entrega.find({
      placaCaminhao: { $in: caminhoes.map((c) => c.placa) },
      dataEntrega: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lt: new Date().setHours(23, 59, 59, 999),
      },
    });

    const entregasArquivadasHoje = await EntregaArquivada.find({
      placaCaminhao: { $in: caminhoes.map((c) => c.placa) },
      dataEntrega: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lt: new Date().setHours(23, 59, 59, 999),
      },
    });

    const valorTotalEntregas = [
      ...entregasHoje,
      ...entregasArquivadasHoje,
    ].reduce((total, entrega) => total + entrega.valor, 0);

    res.json({ caminhoesData, numCaminhoes, valorTotalEntregas });
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar dados da frota." });
  }
};
