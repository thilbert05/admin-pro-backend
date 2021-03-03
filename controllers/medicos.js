const { request, response } = require('express');
const Medico = require('../models/medico');

const getMedicos = async (req = request, res = response, next) => {
  try {
    const medicos = await Medico.find({})
      .populate('usuario', 'nombre img')
      .populate('hospital', 'nombre img')
      .exec();
  
    if (medicos.length <= 0) {
      const error = new Error();
      error.statusCode = 404;
      error.message = "No se encontraron médicos en la búsqueda";
      throw error;
    }

    res.json({
      ok: true,
      medicos
    });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
  
};

const crearMedico = async (req = request, res = response, next) => {
  try {
    const {nombre, hospital} = req.body;
    const uid = req.uid;
    const medicoExiste = await Medico.findOne({nombre, hospital});

    if (medicoExiste) {
      const error = new Error();
      error.statusCode = 400;
      error.message = "El médico ya existe";
      throw error;
    }

    const medico = new Medico({
      usuario: uid,
      ...req.body
    });

    const medicoGuardado = await medico.save();

    res.status(201).json({
      ok: true,
      medico: medicoGuardado
    });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
  
};

const actualizarMedico = async (req = request, res = response, next) => {
  res.json({
    ok: true,
    msg: 'actualizarMedico'
  });
};

const borrarMedico = async (req = request, res = response, next) => {
  res.json({
    ok: true,
    msg: 'borrarMedico'
  });
};

module.exports = {
  getMedicos,
  crearMedico,
  actualizarMedico,
  borrarMedico
};


