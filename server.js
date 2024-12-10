// server.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const clienteRoutes = require('./routes/clienteRoutes');
const gastoRoutes = require('./routes/gastoRoutes');
const productoRoutes = require('./routes/productoRoutes');
const servicioRoutes = require('./routes/servicioRoutes');
const ventaRoutes = require('./routes/ventaRoutes');  // Asegúrate de importar correctamente las rutas

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

// Middleware de logueo para ver las rutas
app.use((req, res, next) => {
    console.log(`Solicitud: ${req.method} ${req.originalUrl}`);
    next();
});

// Usando rutas
app.use(clienteRoutes);
app.use(gastoRoutes);
app.use(productoRoutes);
app.use(servicioRoutes);
app.use(ventaRoutes);  // Usa las rutas de ventas

// Ruta de prueba para asegurar que el servidor está funcionando
app.get('/', (req, res) => {
    res.send('Servidor funcionando');
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
