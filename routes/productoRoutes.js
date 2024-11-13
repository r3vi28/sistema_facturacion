// routes/productoRoutes.js
const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');

// Rutas para productos
router.post('/productos', productoController.createProducto);
router.get('/productos', productoController.getProductos);
router.get('/productos/:id', productoController.getProductoById);
router.put('/productos/:id', productoController.updateProducto);
router.delete('/productos/:id', productoController.deleteProducto);

module.exports = router;
