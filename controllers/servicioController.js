// controllers/servicioController.js
const { Servicio } = require('../models');

// Crear un nuevo servicio
exports.createServicio = async (req, res) => {
    try {
        const { nombre, descripcion, precio } = req.body;
        const servicio = await Servicio.create({
            nombre,
            descripcion,
            precio
        });
        res.status(201).json(servicio);
    } catch (error) {
        console.error('Error al crear servicio:', error);
        res.status(500).json({ message: 'Error al crear servicio' });
    }
};

// Obtener todos los servicios
exports.getServicios = async (req, res) => {
    try {
        const servicios = await Servicio.findAll();
        res.status(200).json(servicios);
    } catch (error) {
        console.error('Error al obtener servicios:', error);
        res.status(500).json({ message: 'Error al obtener servicios' });
    }
};

// Obtener un servicio por su ID
exports.getServicioById = async (req, res) => {
    const { id } = req.params;
    try {
        const servicio = await Servicio.findByPk(id);
        if (servicio) {
            res.status(200).json(servicio);
        } else {
            res.status(404).json({ message: 'Servicio no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener servicio:', error);
        res.status(500).json({ message: 'Error al obtener servicio' });
    }
};

// Actualizar un servicio
exports.updateServicio = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio } = req.body;
    try {
        const servicio = await Servicio.findByPk(id);
        if (servicio) {
            servicio.nombre = nombre;
            servicio.descripcion = descripcion;
            servicio.precio = precio;
            await servicio.save();
            res.status(200).json(servicio);
        } else {
            res.status(404).json({ message: 'Servicio no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar servicio:', error);
        res.status(500).json({ message: 'Error al actualizar servicio' });
    }
};

// Eliminar un servicio
exports.deleteServicio = async (req, res) => {
    const { id } = req.params;
    try {
        const servicio = await Servicio.findByPk(id);
        if (servicio) {
            await servicio.destroy();
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Servicio no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar servicio:', error);
        res.status(500).json({ message: 'Error al eliminar servicio' });
    }
};
