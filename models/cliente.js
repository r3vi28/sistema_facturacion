// models/cliente.js
module.exports = (sequelize, DataTypes) => {
    const Cliente = sequelize.define('Cliente', {
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        direccion: {
            type: DataTypes.STRING,
            allowNull: true
        },
        telefono: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });

    return Cliente;
};
