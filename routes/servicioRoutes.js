// routes/servicioRoutes.js
const express = require('express');
const router = express.Router();
const servicioController = require('../controllers/servicioController');

// Rutas para servicio
router.post('/servicios', servicioController.createServicio);
router.get('/servicios', servicioController.getServicios);
router.get('/servicios/:id', servicioController.getServicioById);
router.put('/servicios/:id', servicioController.updateServicio);
router.delete('/servicios/:id', servicioController.deleteServicio);

module.exports = router;
