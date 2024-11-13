// models/detalleVenta.js
module.exports = (sequelize, DataTypes) => {
    const DetalleVenta = sequelize.define('DetalleVenta', {
        cantidad: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        precio: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        descuento: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        }
    });

    return DetalleVenta;
};
