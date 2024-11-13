// models/venta.js
module.exports = (sequelize, DataTypes) => {
    const Venta = sequelize.define('Venta', {
        fecha: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        clienteId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Clientes', // Nombre de la tabla de clientes
                key: 'id'
            }
        },
        total: {
            type: DataTypes.FLOAT,
            allowNull: false
        }
    });

    return Venta;
};
