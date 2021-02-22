require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// crear el servidor de express
const app = express();
const port = process.env.PORT || 3000;
//Base de datos
const { dbConnection } = require('./database/config');

// Config CORS en un Middleware
app.use(cors());

//Lectura y parseo del Body de Requests
app.use(express.json());

//Rutas
const usuariosRoutes = require('./routes/usuarios');
const authRoutes = require('./routes/auth');

//Rutas Middlewares
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/auth', authRoutes);


//Middleware para manejar errores
app.use((err, req, res, next) => {
  const { statusCode, message } = err;
  const code = statusCode;

  if (err.errores) {
    const errors = err.errores;
    return res.status(code).json({
      ok: false,
      errors
    });
  }

  res.status(code).json({
    ok: false,
    error: message,
  });
});

//Conexión de DB y servidor express

dbConnection()
  .then(value => {
    console.log('Connected to MongoDB Atlas');
    app.listen(port, () => {
      console.log('Servidor corriendo en puerto ' + port);
    });
  })
  .catch(reason => {
    console.log('Error con db connection', reason);
  });