// controllers/gastoController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Crear un nuevo gasto
exports.createGasto = async (req, res) => {
    try {
        const { concepto, monto, categoria, fecha } = req.body;
        const gasto = await prisma.gasto.create({
            data: { concepto, monto, categoria, fecha }
        });
        res.status(201).json(gasto);
    } catch (error) {
        console.error('Error al crear gasto:', error);
        res.status(500).json({ message: 'Error al crear gasto' });
    }
};

// Obtener todos los gastos
exports.getGastos = async (req, res) => {
    try {
        const gastos = await prisma.gasto.findMany();
        res.status(200).json(gastos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener gastos' });
    }
};

// Obtener un gasto por su ID
exports.getGastoById = async (req, res) => {
    try {
        const gasto = await prisma.gasto.findUnique({
            where: { id: parseInt(req.params.id) }
        });
        gasto ? res.status(200).json(gasto) : res.status(404).json({ message: 'Gasto no encontrado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener gasto' });
    }
};

// Actualizar un gasto
exports.updateGasto = async (req, res) => {
    const { id } = req.params;
    const { concepto, monto, categoria, fecha } = req.body;
    try {
        const gasto = await prisma.gasto.update({
            where: { id: parseInt(id) },
            data: { concepto, monto, categoria, fecha }
        });
        res.status(200).json(gasto);
    } catch (error) {
        console.error('Error al actualizar gasto:', error);
        res.status(500).json({ message: 'Error al actualizar gasto' });
    }
};

// Eliminar un gasto
exports.deleteGasto = async (req, res) => {
    const { id } = req.params;
    try {
        const gasto = await prisma.gasto.findUnique({ where: { id: parseInt(id) } });
        if (gasto) {
            await prisma.gasto.delete({ where: { id: parseInt(id) } });
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Gasto no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar gasto:', error);
        res.status(500).json({ message: 'Error al eliminar gasto' });
    }
};
