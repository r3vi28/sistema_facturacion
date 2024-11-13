const { Sequelize, DataTypes } = require('sequelize');

// Configuración de la base de datos
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite', // Archivo donde se almacenarán los datos
});

// Conexión a la base de datos
sequelize.authenticate()
    .then(() => console.log("Conexión establecida con la base de datos"))
    .catch((error) => console.error("Error al conectar a la base de datos:", error));

// Definir las tablas de la base de datos

// Tabla Clientes
const Cliente = sequelize.define('Cliente', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: true,
    }
});

// Tabla Inventario
const Producto = sequelize.define('Producto', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    cantidad: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    precio: {
        type: DataTypes.FLOAT,
        allowNull: false,
    }
});

// Tabla Servicios
const Servicio = sequelize.define('Servicio', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    precio: {
        type: DataTypes.FLOAT,
        allowNull: false,
    }
});

// Tabla Ventas
const Venta = sequelize.define('Venta', {
    clienteId: {
        type: DataTypes.INTEGER,
        references: {
            model: Cliente,
            key: 'id',
        },
    },
    total: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    fecha: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
    },
});

// Tabla Detalle de Venta (relaciona productos y servicios con la venta)
const DetalleVenta = sequelize.define('DetalleVenta', {
    ventaId: {
        type: DataTypes.INTEGER,
        references: {
            model: Venta,
            key: 'id',
        },
    },
    productoId: {
        type: DataTypes.INTEGER,
        references: {
            model: Producto,
            key: 'id',
        },
        allowNull: true,
    },
    servicioId: {
        type: DataTypes.INTEGER,
        references: {
            model: Servicio,
            key: 'id',
        },
        allowNull: true,
    },
    cantidad: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
    precio: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    descuento: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
});

// Tabla Gastos
const Gasto = sequelize.define('Gasto', {
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    monto: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    fecha: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
    },
});

// Relaciones entre tablas

// Relación entre Cliente y Venta
Cliente.hasMany(Venta, { foreignKey: 'clienteId' });
Venta.belongsTo(Cliente, { foreignKey: 'clienteId' });

// Relación entre Venta y DetalleVenta
Venta.hasMany(DetalleVenta, { foreignKey: 'ventaId' });
DetalleVenta.belongsTo(Venta, { foreignKey: 'ventaId' });

// Relación entre Producto y DetalleVenta
Producto.hasMany(DetalleVenta, { foreignKey: 'productoId' });
DetalleVenta.belongsTo(Producto, { foreignKey: 'productoId' });

// Relación entre Servicio y DetalleVenta
Servicio.hasMany(DetalleVenta, { foreignKey: 'servicioId' });
DetalleVenta.belongsTo(Servicio, { foreignKey: 'servicioId' });

// Sin relación directa entre Gasto y otras tablas por ahora, solo es una tabla independiente

// Sincronizar las tablas con la base de datos
sequelize.sync()
    .then(() => console.log("Tablas creadas correctamente"))
    .catch((error) => console.error("Error al sincronizar las tablas:", error));

module.exports = {
    Cliente,
    Producto,
    Servicio,
    Venta,
    DetalleVenta,
    Gasto,
    sequelize
};
