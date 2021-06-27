require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');

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
const hospitalesRoutes = require('./routes/hospitales');
const medicosRoutes = require('./routes/medicos');
const busquedaRoutes = require('./routes/busquedas');
const uploadsRoutes = require('./routes/uploads');
const authRoutes = require('./routes/auth');

//Directorio publico
const publicPath = path.resolve(__dirname, '.', 'public');
console.log(publicPath);
app.use(express.static(publicPath));

//Rutas Middlewares
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/hospitales', hospitalesRoutes);
app.use('/api/medicos', medicosRoutes);
app.use('/api/todo', busquedaRoutes);
app.use('/api/upload', uploadsRoutes);
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
    app.listen(port, () => {
      console.log('Servidor corriendo en puerto ' + port);
      console.log('Connected to MongoDB Atlas');
    });
  })
  .catch(reason => {
    console.log('Error con db connection', reason);
  });