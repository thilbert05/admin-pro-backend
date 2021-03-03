const { request, response } = require('express');
const Usuario = require('../models/usuario');

const bcrypt = require('bcrypt');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async (req, res = response, next) => {
  try {
    const desde = +req.query.desde || 0;
    
    const [usuarios, total] = await Promise.all([
      Usuario.find({}, 'nombre email google role').skip(desde).limit(5),
      Usuario.countDocuments(),
    ]);
    
    if (usuarios.length === 0) {
      const error = new Error();
      error.statusCode = 404;
      error.message =
      'No se encontraron registros de usuarios en la base de datos';
      throw error;
    }
    
    //Si se obtiene usuarios en la base de datos envía respuesta exitosa
    return res.json({
      ok: true,
      usuarios,
      total
    });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const postUsuarios = async (req, res = response, next) => {
  const {email, password } = req.body;
  
  try {
    // verifica si el email ya existe en la base de datos
    const existeEmail = await Usuario.findOne({email});

    if (existeEmail) {
      const error = new Error();
      error.statusCode = 400;
      error.message = 'El email ya está tomado por otro usuario';
      throw error;
    }
   
    const usuario = new Usuario(req.body);

    //Encriptar contraseña
    const salt = bcrypt.genSaltSync(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    usuario.password = hashedPassword;

    //Generar Token para usuario
    const token = await generarJWT(usuario._id);

    const usuariosGuardado = await usuario.save();

    if (!usuariosGuardado) {
      const error = new Error();
      error.statusCode = 500;
      error.message = 'Error al guardar el usuario en la base de datos';
      throw error;
    }

    return res.status(201).json({
      ok: true,
      msg: 'Usuario creado con éxito',
      usuario,
      token
    });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const actualizarUsuario = async (req = request, res = response, next) => {
  //TODO: validar token y comprobar si el usuario existe
  const uid = req.params.id;
  
  try {

    const usuarioDB = await Usuario.findById(uid);

    if (!usuarioDB) {
      const error = new Error();
      error.statusCode = 404;
      error.message = 'Error al encontrar el usuario en la base de datos';
      throw error;
    }

    //Actualizaciones
    // const campos = req.body;
    const {password, google, email, ...campos} = req.body;

    if (usuarioDB.email !== email) {
      //confirmar que el email no exista
      const existeEmail = await Usuario.findOne({email});
      
      if (existeEmail) {
        const error = new Error();
        error.statusCode = 400;
        error.message = 'El email ya está tomado por otro usuario';
        throw error;
      }

    }

    campos.email = email;
    // delete campos.password;
    // delete campos.google;

    const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {
      new: true,
    });


    res.json({
      ok: true,
      usuario: usuarioActualizado
    });

  } catch (err) {
    console.log(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const borrarUsuario = async (req = request, res = response, next) => {
  const uid = req.params.id;

  try {
    const usuarioDB = await Usuario.findById(uid);

    if (!usuarioDB) {
      const error = new Error();
      error.statusCode = 404;
      error.message = 'Error al encontrar el usuario en la base de datos';
      throw error;
    }

    const usuarioBorrado = await Usuario.findByIdAndDelete(uid);

    if (!usuarioBorrado) {
      const error = new Error();
      error.statusCode = 404;
      error.message = 'El usuario no se pudo eliminar';
      throw error;
    }

    res.json({
      ok: true,
      msg: 'Usuario eliminado'
    });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = {
  getUsuarios,
  postUsuarios,
  actualizarUsuario,
  borrarUsuario
};