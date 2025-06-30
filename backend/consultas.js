const bcrypt = require("bcryptjs");
const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "tu_contraseña",
  database: "softjobs",
  port: 5432,
});

const registrarUsuario = async ({ email, password, rol, lenguage }) => {
  const passwordEncriptada = bcrypt.hashSync(password);
  const values = [email, passwordEncriptada, rol, lenguage];
  const consulta = "INSERT INTO usuarios VALUES (DEFAULT, $1, $2, $3, $4)";
  await pool.query(consulta, values);
};

const verificarCredenciales = async (email, password) => {
  const values = [email];
  const consulta = "SELECT * FROM usuarios WHERE email = $1";
  const { rows, rowCount } = await pool.query(consulta, values);

  if (!rowCount) throw { code: 401, message: "Email o contraseña incorrecta" };

  const { password: passwordEncriptada } = rows[0];
  const passwordEsCorrecta = bcrypt.compareSync(password, passwordEncriptada);

  if (!passwordEsCorrecta) {
    throw { code: 401, message: "Email o contraseña incorrecta" };
  }
};

const obtenerDatosUsuario = async (email) => {
  const consulta = "SELECT * FROM usuarios WHERE email = $1";
  const values = [email];
  const { rows } = await pool.query(consulta, values);
  return rows[0];
};

module.exports = {
  registrarUsuario,
  verificarCredenciales,
  obtenerDatosUsuario,
};
