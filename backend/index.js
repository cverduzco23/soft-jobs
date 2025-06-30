const express = require("express");
const jwt = require("jsonwebtoken");
const { registrarUsuario, verificarCredenciales, obtenerDatosUsuario } = require("./consultas");
const { verificarCredencialesMiddleware, validarTokenMiddleware, loggerMiddleware } = require("./middlewares");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

app.post("/usuarios", async (req, res) => {
  try {
    const usuario = req.body;
    await registrarUsuario(usuario);
    res.send("Usuario creado con éxito");
  } catch (error) {
    res.status(error.code || 500).send(error);
  }
});

app.post("/login", verificarCredencialesMiddleware, async (req, res) => {
  try {
    const { email, password } = req.body;
    await verificarCredenciales(email, password);
    const token = jwt.sign({ email }, "az_AZ", { expiresIn: 30 }); // 30 segundos
    res.send(token);
  } catch (error) {
    res.status(error.code || 500).send(error);
  }
});

app.get("/usuarios", validarTokenMiddleware, async (req, res) => {
  try {
    const { email } = req;
    const usuario = await obtenerDatosUsuario(email);
    res.json(usuario);
  } catch (error) {
    res.status(error.code || 500).send(error);
  }
});

app.listen(3000, () => console.log("Servidor encendido en puerto 3000"));
