// controllers/clienteController.js
const { Cliente } = require('../models');

exports.createCliente = async (req, res) => {
    try {
        const { nombre, direccion, telefono, email } = req.body;

        // Validaciones adicionales
        if (!nombre || !telefono) {
            return res.status(400).json({ message: 'Nombre y teléfono son obligatorios' });
        }

        const cliente = await Cliente.create({ nombre, direccion, telefono, email });
        res.status(201).json(cliente);
    } catch (error) {
        console.error('Error detallado:', error);
        res.status(500).json({ 
            message: 'Error al crear cliente',
            error: error.errors ? error.errors.map(e => e.message) : error.message
        });
    }
};

exports.getClientes = async (req, res) => {
    try {
        const clientes = await Cliente.findAll();
        res.status(200).json(clientes);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener clientes' });
    }
};

exports.getClienteById = async (req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id);
        cliente ? res.status(200).json(cliente) : res.status(404).json({ message: 'Cliente no encontrado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener cliente' });
    }
};

exports.updateCliente = async (req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id);
        if (cliente) {
            Object.assign(cliente, req.body);
            await cliente.save();
            res.status(200).json(cliente);
        } else {
            res.status(404).json({ message: 'Cliente no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar cliente' });
    }
};

exports.deleteCliente = async (req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id);
        cliente ? await cliente.destroy() && res.status(204).send() : res.status(404).json({ message: 'Cliente no encontrado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar cliente' });
    }
};
