require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

app.use(cors());
app.use(express.json());

mongoose.connect(
  `mongodb+srv://${dbUser}:${dbPassword}@desafiodb.hi4ts7z.mongodb.net/?retryWrites=true&w=majority&appName=DesafioDB`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const caminhaoRoutes = require("./routes/caminhao.js");
const entregaRoutes = require("./routes/entrega.js");
const frotaRoutes = require("./routes/frota.js");
const CleanDatabaseController = require("./controllers/CleanDatabaseController.js");

app.use("/caminhoes", caminhaoRoutes);
app.use("/entregas", entregaRoutes);
app.use("/frotas", frotaRoutes);
app.use("/clean", CleanDatabaseController.cleanDatabase);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
