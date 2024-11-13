// controllers/clienteController.js
const { Cliente } = require('../models');

// Crear un nuevo cliente
exports.createCliente = async (req, res) => {
    try {
        const { nombre, direccion, telefono, email } = req.body;
        const cliente = await Cliente.create({
            nombre,
            direccion,
            telefono,
            email
        });
        res.status(201).json(cliente);
    } catch (error) {
        console.error('Error al crear cliente:', error);
        res.status(500).json({ message: 'Error al crear cliente' });
    }
};

// Obtener todos los clientes
exports.getClientes = async (req, res) => {
    try {
        const clientes = await Cliente.findAll();
        res.status(200).json(clientes);
    } catch (error) {
        console.error('Error al obtener clientes:', error);
        res.status(500).json({ message: 'Error al obtener clientes' });
    }
};

// Obtener un cliente por su ID
exports.getClienteById = async (req, res) => {
    const { id } = req.params;
    try {
        const cliente = await Cliente.findByPk(id);
        if (cliente) {
            res.status(200).json(cliente);
        } else {
            res.status(404).json({ message: 'Cliente no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener cliente:', error);
        res.status(500).json({ message: 'Error al obtener cliente' });
    }
};

// Actualizar un cliente
exports.updateCliente = async (req, res) => {
    const { id } = req.params;
    const { nombre, direccion, telefono, email } = req.body;
    try {
        const cliente = await Cliente.findByPk(id);
        if (cliente) {
            cliente.nombre = nombre;
            cliente.direccion = direccion;
            cliente.telefono = telefono;
            cliente.email = email;
            await cliente.save();
            res.status(200).json(cliente);
        } else {
            res.status(404).json({ message: 'Cliente no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar cliente:', error);
        res.status(500).json({ message: 'Error al actualizar cliente' });
    }
};

// Eliminar un cliente
exports.deleteCliente = async (req, res) => {
    const { id } = req.params;
    try {
        const cliente = await Cliente.findByPk(id);
        if (cliente) {
            await cliente.destroy();
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Cliente no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar cliente:', error);
        res.status(500).json({ message: 'Error al eliminar cliente' });
    }
};
