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

//Rutas

app.get('/', (req, res) => {
  res.json({
    ok: true,
    msg: 'Hola Mundo'
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