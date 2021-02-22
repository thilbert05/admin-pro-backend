const {request, response} = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const login = async (req = request, res = response, next) => {
  const {email, password} = req.body;

  try {

    // Verificar email
    const usuarioDB = await Usuario.findOne({ email });

    if (!usuarioDB) {
      const error = new Error();
      error.statusCode = 404;
      error.message = "No se encontró un usuario con este correo electrónico"
      throw error;
    }
    
    //Verificar contraseña
    const passwordMatch = await bcrypt.compare(password, usuarioDB.password);

    if (!passwordMatch) {
      const error = new Error();
      error.statusCode = 401;
      error.message = "Contraseña inválida"
      throw error;
    }

    //TODO Generar el TOKEN del usuario

    const token = await generarJWT(usuarioDB._id);

    return res.json({
      ok: true,
      token
    })

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = {
  login
};