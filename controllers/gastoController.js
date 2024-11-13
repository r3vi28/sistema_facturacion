// controllers/gastoController.js
const { Gasto } = require('../models');

// Crear un nuevo gasto
exports.createGasto = async (req, res) => {
    try {
        const { descripcion, monto, fecha } = req.body;
        const gasto = await Gasto.create({
            descripcion,
            monto,
            fecha
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
        const gastos = await Gasto.findAll();
        res.status(200).json(gastos);
    } catch (error) {
        console.error('Error al obtener gastos:', error);
        res.status(500).json({ message: 'Error al obtener gastos' });
    }
};

// Obtener un gasto por su ID
exports.getGastoById = async (req, res) => {
    const { id } = req.params;
    try {
        const gasto = await Gasto.findByPk(id);
        if (gasto) {
            res.status(200).json(gasto);
        } else {
            res.status(404).json({ message: 'Gasto no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener gasto:', error);
        res.status(500).json({ message: 'Error al obtener gasto' });
    }
};

// Actualizar un gasto
exports.updateGasto = async (req, res) => {
    const { id } = req.params;
    const { descripcion, monto, fecha } = req.body;
    try {
        const gasto = await Gasto.findByPk(id);
        if (gasto) {
            gasto.descripcion = descripcion;
            gasto.monto = monto;
            gasto.fecha = fecha;
            await gasto.save();
            res.status(200).json(gasto);
        } else {
            res.status(404).json({ message: 'Gasto no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar gasto:', error);
        res.status(500).json({ message: 'Error al actualizar gasto' });
    }
};

// Eliminar un gasto
exports.deleteGasto = async (req, res) => {
    const { id } = req.params;
    try {
        const gasto = await Gasto.findByPk(id);
        if (gasto) {
            await gasto.destroy();
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Gasto no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar gasto:', error);
        res.status(500).json({ message: 'Error al eliminar gasto' });
    }
};
