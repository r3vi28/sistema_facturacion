// models/servicio.js
module.exports = (sequelize, DataTypes) => {
    const Servicio = sequelize.define('Servicio', {
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        descripcion: {
            type: DataTypes.STRING,
            allowNull: true
        },
        precio: {
            type: DataTypes.FLOAT,
            allowNull: false
        }
    });

    return Servicio;
};
