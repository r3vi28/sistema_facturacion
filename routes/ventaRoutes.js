// routes/ventaRoutes.js

const express = require('express');
const router = express.Router();
const VentaController = require('../controllers/ventaController');

// Asegúrate de que las rutas estén bien definidas
router.get('/ventas', VentaController.getAllVentas);  // Ruta para obtener todas las ventas
router.post('/ventas', VentaController.createVenta);  // Ruta para crear una venta
router.put('/ventas/:id', VentaController.updateVenta);  // Ruta para actualizar una venta
router.delete('/ventas/:id', VentaController.deleteVenta);  // Ruta para eliminar una venta
router.get('/ventas/:id/factura', VentaController.generarFacturaPDF);  // Ruta para generar factura PDF

module.exports = router;
