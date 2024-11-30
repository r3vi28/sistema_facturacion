// server.js
const express = require('express');
const { sequelize } = require('./models');
const clienteRoutes = require('./routes/clienteRoutes');
const gastoRoutes = require('./routes/gastoRoutes');
const productoRoutes = require('./routes/productoRoutes');
const servicioRoutes = require('./routes/servicioRoutes');
const ventaRoutes = require('./routes/ventaRoutes');

const app = express();
app.use(express.json());
app.use(clienteRoutes);
app.use(gastoRoutes);
app.use(productoRoutes);
app.use(servicioRoutes);
app.use(ventaRoutes);

sequelize.sync({ force: false })
    .then(() => console.log('Base de datos sincronizada'))
    .catch(err => console.error('Error al sincronizar la base de datos:', err));

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});