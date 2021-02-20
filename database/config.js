require('dotenv').config();
const mongoose = require('mongoose');

const dbConnection = async () => {
  try {
    return await mongoose.connect(
      process.env.DB_CNN,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      }
    );
    
  } catch (error) {
    throw new Error('Error en connexión a la base de datos');
  }
};

module.exports = {
  dbConnection
};