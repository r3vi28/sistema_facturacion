// models/index.js
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// Configuración de la conexión con SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../database.sqlite'), // Ruta donde se guardará la base de datos
    logging: false // Desactivar logs de SQL en consola (opcional)
});

// Importación de modelos
const Cliente = require('./cliente')(sequelize, DataTypes);
const Producto = require('./producto')(sequelize, DataTypes);
const Servicio = require('./servicio')(sequelize, DataTypes);
const Venta = require('./venta')(sequelize, DataTypes);
const Gasto = require('./gasto')(sequelize, DataTypes);

// Definición de relaciones entre modelos

// Exportación de conexión y modelos
module.exports = {
    sequelize,
    Cliente,
    Producto,
    Servicio,
    Venta,
    Gasto
};