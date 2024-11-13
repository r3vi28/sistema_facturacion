// routes/ventaRoutes.js
const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/ventaController');

// Rutas para venta
router.post('/ventas', ventaController.createVenta);
router.get('/ventas', ventaController.getVentas);
router.get('/ventas/:id', ventaController.getVentaById);

module.exports = router;
