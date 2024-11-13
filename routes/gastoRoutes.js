// routes/gastoRoutes.js
const express = require('express');
const router = express.Router();
const gastoController = require('../controllers/gastoController');

// Rutas para gasto
router.post('/gastos', gastoController.createGasto);
router.get('/gastos', gastoController.getGastos);
router.get('/gastos/:id', gastoController.getGastoById);
router.put('/gastos/:id', gastoController.updateGasto);
router.delete('/gastos/:id', gastoController.deleteGasto);

module.exports = router;
