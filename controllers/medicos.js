const { request, response } = require('express');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

const getMedicos = async (req = request, res = response, next) => {
  try {
    const desde = +req.query.desde || 0;
    const limit = +req.query.limit || 5;
    const [medicos, totalMedicos] = await Promise.all([
      Medico.find({})
       .skip(desde)
       .limit(limit)
       .populate('usuario', 'nombre img')
       .populate('hospital', 'nombre img')
       .exec(),
       Medico.countDocuments(),
      ]);
  
    if (medicos.length <= 0) {
      const error = new Error();
      error.statusCode = 404;
      error.message = "No se encontraron médicos en la búsqueda";
      throw error;
    }

    res.json({
      ok: true,
      medicos,
      totalMedicos
    });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
  
};

const getMedico = async (req = request, res = response, next ) => {
  const id = req.params.id;
  
  try {
    const medicoDB = await Medico.findById(id)
                            .populate('usuario', 'nombre img')
                            .populate('hospital', 'nombre img')
                            .exec();

    if (!medicoDB) {
      const error = new Error();
      error.statusCode = 404;
      error.message = "No se encontró un médico con este ID";
      throw error;
    }

    res.json({
      ok: true,
      medico: medicoDB
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
  const medicoId = req.params.id;
  const {nombre, hospital} = req.body;
  const uid = req.uid;
  
  try {
    const medicoExiste = await Medico.findById(medicoId);

    if (!medicoExiste) {
      const error = new Error();
      error.statusCode = 404;
      error.message = 'No se encontró datos para este médico';
      throw error;
    }

    //Verificar si el hospital existe

    const hospitalExiste = await Hospital.findById(hospital);
    if (!hospitalExiste) {
      const error = new Error();
      error.statusCode = 404;
      error.message = 'No se encontró datos del hospital';
      throw error;
    }

    const cambiosMedico = {
      usuario: uid,
      ...req.body
    };

    const medicoActualizado = await Medico.findByIdAndUpdate(medicoId, cambiosMedico, {new: true});

    res.json({
      ok: true,
      msg: 'El médico se actualizó con éxito',
      medico: medicoActualizado
    });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }

};

const borrarMedico = async (req = request, res = response, next) => {
  const medicoId = req.params.id;

  try {
    const medicoDB = await Medico.findById(medicoId);

    if (!medicoDB) {
      const error = new Error();
      error.statusCode = 404;
      error.message = 'No existe un registro de este médico';
      throw error;
    }

    const medicoRemovido = await Medico.findByIdAndRemove(medicoId);

    if (!medicoRemovido) {
      const error = new Error();
      error.statusCode = 404;
      error.message = 'No se pudo borrar el medico';
      throw error;
    }

    res.json({
      ok: true,
      msg: 'El médico ha sido borrado con éxito'
    });

    console.log('Medico removido:', medicoRemovido);
    
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
  getMedicos,
  getMedico,
  crearMedico,
  actualizarMedico,
  borrarMedico
};


