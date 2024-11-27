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
            allowNull: false,
            validate: {
                isFloat: true,
                min: 0
            }
        }
    }, {
        tableName: 'ventas',
        timestamps: true
    });

    Venta.associate = models => {
        Venta.belongsTo(models.Cliente, {
            foreignKey: 'clienteId',
            as: 'cliente'
        });
    };

    return Venta;
};
