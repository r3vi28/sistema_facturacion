// models/gasto.js
module.exports = (sequelize, DataTypes) => {
    const Gasto = sequelize.define('Gasto', {
        descripcion: {
            type: DataTypes.STRING,
            allowNull: false
        },
        monto: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        categoria: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fecha: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    });

    return Gasto;
};
