// models/producto.js
module.exports = (sequelize, DataTypes) => {
    const Producto = sequelize.define('Producto', {
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
        },
        cantidad: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    });

    return Producto;
};
