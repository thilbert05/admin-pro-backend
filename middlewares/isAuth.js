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

module.exports = {
  isAuth
}