// models/index.js
const { Sequelize, DataTypes } = require('sequelize');

// Conexión a SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite', // Ruta donde se guardará tu base de datos
});

// Importación de modelos
const Cliente = require('./cliente')(sequelize, DataTypes);
const Producto = require('./producto')(sequelize, DataTypes);
const Servicio = require('./servicio')(sequelize, DataTypes);
const Venta = require('./venta')(sequelize, DataTypes);
const DetalleVenta = require('./detalleVenta')(sequelize, DataTypes);
const Gasto = require('./gasto')(sequelize, DataTypes);

// Relacionar los modelos
Venta.hasMany(DetalleVenta);
DetalleVenta.belongsTo(Venta);

Producto.hasMany(DetalleVenta);
DetalleVenta.belongsTo(Producto);

Servicio.hasMany(DetalleVenta);
DetalleVenta.belongsTo(Servicio);

module.exports = { sequelize, Cliente, Producto, Servicio, Venta, DetalleVenta, Gasto };
