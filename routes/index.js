// routes/index.js
const express = require('express');
const router = express.Router();

const clienteRoutes = require('./clienteRoutes');
const gastoRoutes = require('./gastoRoutes');
const productoRoutes = require('./productoRoutes');
const servicioRoutes = require('./servicioRoutes');
const ventaRoutes = require('./ventaRoutes');

// Uso de las rutas
router.use('/api', clienteRoutes);
router.use('/api', gastoRoutes);
router.use('/api', productoRoutes);
router.use('/api', servicioRoutes);
router.use('/api', ventaRoutes);

module.exports = router;
