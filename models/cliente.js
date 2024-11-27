// models/cliente.js
module.exports = (sequelize, DataTypes) => {
    const Cliente = sequelize.define('Cliente', {
        nombre: { 
            type: DataTypes.STRING, 
            allowNull: false,
            validate: {
                notEmpty: { msg: 'El nombre no puede estar vacío' },
                len: {
                    args: [2, 50],
                    msg: 'El nombre debe tener entre 2 y 50 caracteres'
                }
            }
        },
        direccion: { 
            type: DataTypes.STRING, 
            allowNull: true,
            validate: {
                len: {
                    args: [0, 100],
                    msg: 'La dirección no puede superar 100 caracteres'
                }
            }
        },
        telefono: { 
            type: DataTypes.STRING, 
            allowNull: false,
            validate: {
                notEmpty: { msg: 'El teléfono no puede estar vacío' },
                is: {
                    args: /^[0-9+\-\s]+$/,
                    msg: 'El formato de teléfono no es válido'
                }
            }
        },
        email: { 
            type: DataTypes.STRING, 
            allowNull: true,
            validate: {
                isEmail: { msg: 'El email no tiene un formato válido' }
            }
        }
    });
    return Cliente;
};