const {request, response} = require('express');

const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

const getTodo = async (req = request, res = response, next) => {
  const busqueda = req.params.busqueda;
  const regex = new RegExp(busqueda, 'i');
  try {
    const [usuarios, medicos, hospitales] = await Promise.all([
      Usuario.find({ nombre: regex }),
      Medico.find({ nombre: regex }),
      Hospital.find({ nombre: regex }),
    ]);
    
    res.json({
      ok: true,
      usuarios,
      medicos,
      hospitales
    });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const getDocColeccion = async (req = request, res = response, next) => {
  const tabla = req.params.tabla;
  const busqueda = req.params.busqueda;
  const regex = new RegExp(busqueda, 'i');
  try {
    let data = [];

    switch (tabla) {
      case 'medicos':
        data = await Medico.find({ nombre: regex })
          .populate('usuario', 'nombre img')
          .populate('hospital', 'nombre img').exec();
        break;

      case 'hospitales':
        data = await Hospital.find({ nombre: regex })
          .populate('usuario', 'nombre img').exec();
        break;

      case 'usuarios':
        data = await Usuario.find({ nombre: regex });
        break;
        
      default:
        const error = new Error();
        error.statusCode = 400;
        error.message = 'La tabla debe ser medicos, hospitales, usuarios';
        throw error;
    }

    res.json({
      ok: true,
      resultados: data
    });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = {
  getTodo,
  getDocColeccion
};