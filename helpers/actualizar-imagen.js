const path = require('path');
const fs = require('fs');
const Usuario  = require('../models/usuario');
const Medico   = require('../models/medico');
const Hospital = require('../models/hospital');

const borrarImagen = (tipo, imgName) => {
  const pathViejo = path.resolve(__dirname, '..', 'uploads', tipo, imgName);

  if (fs.existsSync(pathViejo)) {
    //borrar la imagen anterior
    fs.unlinkSync(pathViejo);
  }
};

const actualizarImagen = async (tipo, id, nombreArchivo) => {
  switch (tipo) {
    case 'usuarios':
      const usuario = await Usuario.findById(id);
      if (!usuario) {
        console.log('No es un usuario por id');
        return false;
      }
      if (usuario.img) {
        borrarImagen(tipo, usuario.img);
      }
      usuario.img = nombreArchivo;
      await usuario.save();
      return true;

    case 'medicos':
      const medico = await Medico.findById(id);
      if (!medico) {
        console.log('No es un médico por id');
        return false;
      }
      if (medico.img) {
        borrarImagen(tipo, medico.img);
      }
      medico.img = nombreArchivo;
      await medico.save();
      return true;

    case 'hospitales':
      const hospital = await Hospital.findById(id);
      if (!hospital) {
        console.log('No es un hospital por id');
        return false;
      }
      if (hospital.img) {
        borrarImagen(tipo, hospital.img);
      }
      hospital.img = nombreArchivo;
      await hospital.save();
      return true;

    default:
      break;
  }
};

module.exports = {
  actualizarImagen,
};