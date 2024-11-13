const express = require('express');
const app = express();
const { sequelize } = require('./models');
const clienteRoutes = require('./routes/clienteRoutes');
const productoRoutes = require('./routes/productoRoutes');
const gastoRoutes = require('./routes/gastoRoutes');
const servicioRoutes = require('./routes/servicioRoutes');
const ventaRoutes = require('./routes/ventaRoutes');

// Middleware para parsear el cuerpo de las solicitudes
app.use(express.json());

// Rutas
app.use(clienteRoutes);
app.use(productoRoutes);
app.use(gastoRoutes);
app.use(servicioRoutes);
app.use(ventaRoutes);

// Sincronizar la base de datos
sequelize.sync({ force: false }).then(() => {
    console.log('Base de datos sincronizada');
});

// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
