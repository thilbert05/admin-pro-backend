const { request, response } = require('express');

// Modelo Hospital
const Hospital = require('../models/hospital');

const getHospitales = async (req = request, res = response, next) => {
  try {
    const hospitales = await Hospital.find({})
      .populate('usuario', 'nombre img')
      .exec();
    

    if (hospitales.length <= 0) {
      const error = new Error();
      error.statusCode = 404;
      error.message = "No se encontraron hospitales en la búsqueda";
      throw error;
    }

    res.json({
      ok: true,
      hospitales
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
  
  
};

const crearHospital = async (req = request, res = response, next) => {
  try {
    const uid = req.uid
    // const hospital = new Hospital(req.body);
    
    // hospital.usuario = uid;
    const hospitalNombre = req.body.nombre;
    const hospitalExiste = await Hospital.findOne({nombre: hospitalNombre});

    if (hospitalExiste) {
      const error = new Error();
      error.statusCode = 400;
      error.message = "El hospital ya existe";
      throw error;
    }

    const hospital = new Hospital({
      usuario: uid,
      ...req.body
    });

    const hospitalGuardado = await hospital.save();

    res.status(201).json({
      ok: true,
      hospital: hospitalGuardado
    });
    
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Contacte al administrador";
    }
    next(err);
  }
};

const actualizarHospital = async (req = request, res = response, next) => {
  const hospitalId = req.params.id;
  const uid = req.uid;

  try {
    const hospitalDB = await Hospital.findById(hospitalId);

    if (!hospitalDB) {
      const error = new Error();
      error.statusCode = 404;
      error.message = 'No existe un registro de este hospital';
      throw error;
    }

    const cambiosHospital = {
      ...req.body,
      usuario: uid
    };

    const hospitalActualizado = await Hospital.findByIdAndUpdate(hospitalId, cambiosHospital, {new: true});

    res.json({
      ok: true,
      msg: 'El nombre del hospital se ha actualizado con éxito',
      hospitalActualizado
    });

  } catch (err) {
    console.log(err.message);
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Contacte al administrador";
    }
    next(err);
  }
};

const borrarHospital = async (req = request, res = response, next) => {
  const hospitalId = req.params.id;

  try {
    const hospitalDB = await Hospital.findById(hospitalId);

    if (!hospitalDB) {
      const error = new Error();
      error.statusCode = 404;
      error.message = 'No existe un registro de este hospital';
      throw error;
    }

    const hospitalRemovido = await Hospital.findByIdAndRemove(hospitalId);

    if (!hospitalRemovido) {
      const error = new Error();
      error.statusCode = 404;
      error.message = 'No se pudo borrar el hospital';
      throw error;
    }

    res.json({
      ok: true,
      msg: 'El hospital ha sido borrado con éxito'
    });
    console.log('Hospital removido', hospitalRemovido);
    
  } catch (err) {
    console.log(err.message);
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Contacte al administrador";
    }
    next(err);
  }
  
};

module.exports = {
  getHospitales,
  crearHospital,
  actualizarHospital,
  borrarHospital
};