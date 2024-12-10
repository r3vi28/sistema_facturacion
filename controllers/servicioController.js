// controllers/servicioController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Crear un nuevo servicio
exports.createServicio = async (req, res) => {
    try {
        const { nombre, descripcion, precio } = req.body;
        const servicio = await prisma.servicio.create({
            data: { nombre, descripcion, precio }
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
        const servicios = await prisma.servicio.findMany();
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
        const servicio = await prisma.servicio.findUnique({
            where: { id: parseInt(id) }
        });
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
        const servicio = await prisma.servicio.update({
            where: { id: parseInt(id) },
            data: { nombre, descripcion, precio }
        });
        res.status(200).json(servicio);
    } catch (error) {
        console.error('Error al actualizar servicio:', error);
        res.status(500).json({ message: 'Error al actualizar servicio' });
    }
};

// Eliminar un servicio
exports.deleteServicio = async (req, res) => {
    const { id } = req.params;
    try {
        const servicio = await prisma.servicio.findUnique({
            where: { id: parseInt(id) }
        });
        if (servicio) {
            await prisma.servicio.delete({
                where: { id: parseInt(id) }
            });
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Servicio no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar servicio:', error);
        res.status(500).json({ message: 'Error al eliminar servicio' });
    }
};
