const {request, response} = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');


const isAuth = async (req = request, res = response, next) => {

  try {
    if (req.header('Authorization') === undefined) {
      const error = new Error();
      error.statusCode = 401;
      error.message = 'Token inválido';
      throw error;
    }

    const token = req.header('Authorization').split(' ')[1];

    if (!token) {
      const error = new Error();
      error.statusCode = 401;
      error.message = 'Usuario no autenticado';
      throw error;
    }
    //Validar JWT
    const { uid }= jwt.verify(token, process.env.JWT_SECRET);

    req.uid = uid;

    next();
    
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
  
  
};

const isAdminOrSameUser = async (req = reques, res = response, next) => {
  const uid = req.uid;
  const id = req.params.id;
  try {

    const usuarioDB = await Usuario.findById(uid);

    if (!usuarioDB) {
      const error = new Error();
      error.statusCode = 401;
      error.message = 'Usuario no existe';
      throw error;
    }

    if (usuarioDB.role === 'ADMIN_ROLE' || uid === id) {
      next();
    } else {
      const error = new Error();
      error.statusCode = 403;
      error.message = 'Usuario no tiene los permisos necesarios para esta acción';
      throw error;
    }
    
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const isAdmin = async (req = reques, res = response, next) => {
  const uid = req.uid;
  try {

    const usuarioDB = await Usuario.findById(uid);

    if (!usuarioDB) {
      const error = new Error();
      error.statusCode = 401;
      error.message = 'Usuario no existe';
      throw error;
    }

    if (usuarioDB.role !== 'ADMIN_ROLE') {
      const error = new Error();
      error.statusCode = 403;
      error.message = 'Usuario no tiene los permisos necesarios para esta acción';
      throw error;
    } 
    
    next();
    
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = {
  isAuth,
  isAdmin,
  isAdminOrSameUser
}