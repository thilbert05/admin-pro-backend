require('dotenv').config();
const mongoose = require('mongoose');

const dbConnection = async () => {
  try {
    await mongoose.connect(
      process.env.DB_CNN,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
      }
    );
    
  } catch (error) {
    throw new Error('Error en conexión a la base de datos');
  }
};

module.exports = {
  dbConnection
};