const {request, response} = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const { getMenuFrontEnd } = require('../helpers/menu-frontend');

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

    //Generar el TOKEN del usuario

    const token = await generarJWT(usuarioDB._id);

    return res.json({
      ok: true,
      token,
      menu: getMenuFrontEnd(usuarioDB.role)
    })

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const googleSignIn = async (req = request, res = response, next) => {
  const googleToken = req.body.token;

  try {
    const { name, email, picture } = await googleVerify(googleToken);

    const usuarioDB = await Usuario.findOne({email});
    let usuario;

    if (usuarioDB) {
      usuario = usuarioDB;
      usuario.google = true;
      usuario.password = '@@@';
    } else {
      usuario = new Usuario({
        nombre: name,
        email,
        password: '@@@',
        img: picture,
        google: true
      });
    }

    //Guardar en DB
    await usuario.save();

    //Generar el TOKEN del usuario

    const token = await generarJWT(usuario._id);

    res.json({
      ok: true,
      token,
      menu: getMenuFrontEnd(usuarioDB.role)
    });
    
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 401;
    }
    err.message = 'Token no es correcto';
    next(err);
  }
};

const renewToken = async (req = request, res = response, next) => {
  const uid = req.uid;

  //Generar el TOKEN del usuario

  try {
    const token = await generarJWT(uid);
  
  
    const usuario = await Usuario.findById(uid);

    if (!usuario) {
      const error = new Error();
      error.statusCode = 400;
      error.message = "Usuario no econtrado"
      throw error;
    }
    
    res.json({
      ok: true,
      usuario,
      token,
      menu: getMenuFrontEnd(usuario.role)
    });
    
  } catch (error) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }

};

module.exports = {
  login,
  googleSignIn,
  renewToken
};