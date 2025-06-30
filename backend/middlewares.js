const jwt = require("jsonwebtoken");

const verificarCredencialesMiddleware = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("Faltan credenciales");
  }
  next();
};

const validarTokenMiddleware = (req, res, next) => {
  try {
    const Authorization = req.header("Authorization");
    if (!Authorization) throw { code: 401, message: "Token no proporcionado" };

    const token = Authorization.split("Bearer ")[1];
    const verificado = jwt.verify(token, "az_AZ");
    const { email } = jwt.decode(token);
    req.email = email;
    next();
  } catch (error) {
    res.status(error.code || 500).send(error);
  }
};

const loggerMiddleware = (req, res, next) => {
  console.log(`Consulta recibida: ${req.method} ${req.url}`);
  next();
};

module.exports = {
  verificarCredencialesMiddleware,
  validarTokenMiddleware,
  loggerMiddleware,
};
