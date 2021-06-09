const {request, response} = require('express');
const path = require('path');
const Usuario = require('../models/usuario');
const fs = require('fs');
const { v4: uuidv4, v4 } = require('uuid');
const { actualizarImagen } = require('../helpers/actualizar-imagen');

const fileUpload = async (req = request, res = response, next) => {
  const tipo = req.params.tipo;
  const id = req.params.id;
  try {
    //validar tipo
    const usuario = await Usuario.findById(id);

    if (!usuario) {
      const error = new Error();
      error.statusCode = 404;
      error.message = 'No se encontró un usuario existente';
      throw error;
    }

    const tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    
    if (!tiposValidos.includes(tipo)) {
      const error = new Error();
      error.statusCode = 400;
      error.message = 'El tipo de upload debe ser medico, usuario u hospital';
      throw error;
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      const error = new Error();
      error.statusCode = 400;
      error.message = 'No se guardó ningun archivo';
      throw error;
    }

    // Procesar la imagen
    const archivo = req.files.imagen;
    const nombreArchivoArray = archivo.name.split('.');
    const extension = nombreArchivoArray[nombreArchivoArray.length - 1];
    
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
    
    if (!extensionesValidas.includes(extension)) {
      const error = new Error();
      error.statusCode = 400;
      error.message = 'No es una extension permitida';
      throw error;
    }
    
    //generar el nombre del archivo
    const fileName = `${uuidv4()}.${extension}`;
    
    const uploadPath = path.resolve(__dirname, '..', 'uploads', tipo, fileName);
    
    //mover la imagen
    archivo.mv(uploadPath,(err) => {
      if (err) {
        err.statusCode = 400;
        throw error;
      }

      //Actualizar la base de datos
      actualizarImagen(tipo, id, fileName);
      
      res.json({
        ok: true,
        msg: 'Archivo subido',
        nombreArchivo: fileName
      });

    });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }


};

const retornaImagen = (req = request, res = response, next) => {
  const tipo = req.params.tipo;
  const img = req.params.img;

  const pathImg = path.join(__dirname, '..', 'uploads', tipo, img);
  //validar que el path exista
  if (fs.existsSync(pathImg)) {
    res.sendFile(pathImg);
  } else {
    const noImg = path.join(__dirname, '..', 'uploads', 'no-img.jpg');
    res.sendFile(noImg);
  }

};

module.exports = {
  fileUpload,
  retornaImagen
}