// server.js

const express = require('express');
const app = express();
const { sequelize } = require('./models');
const clienteRoutes = require('./routes/clienteRoutes');
const productoRoutes = require('./routes/productoRoutes');
const gastoRoutes = require('./routes/gastoRoutes');
const servicioRoutes = require('./routes/servicioRoutes');
const ventaRoutes = require('./routes/ventaRoutes');
const authRoutes = require('./routes/authRoutes'); // Importar rutas de autenticación

// Middleware para parsear el cuerpo de las solicitudes
app.use(express.json());

// Rutas
app.use(clienteRoutes);
app.use(productoRoutes);
app.use(gastoRoutes);
app.use(servicioRoutes);
app.use(ventaRoutes);
app.use(authRoutes); // Añadir la ruta de autenticación

// Sincronizar la base de datos
sequelize.sync({ force: false }).then(() => {
    console.log('Base de datos sincronizada');
})  .catch((error) => {
    console.error('Error al sincronizar la base de datos:', error);
});

// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
