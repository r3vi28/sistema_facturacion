const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

sequelize.authenticate()
  .then(() => console.log('Conectado a la base de datos SQLite'))
  .catch(err => console.error('Error de conexión a la base de datos:', err));

module.exports = sequelize;
