const { response } = require('express');
const { validationResult } = require('express-validator');

const validarCampos = (req, res = response, next) => {
  try {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
  
    const error = new Error();
      error.statusCode = 400;
      error.errores = errores.mapped();
      throw error;
    }
  } catch (err) {
    next(err);
  }
  next();
};

module.exports = {
  validarCampos
}