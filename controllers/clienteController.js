// controllers/clienteController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Crear un nuevo gasto
exports.createCliente = async (req, res) => {
    try {
        const { nombre, direccion, telefono, email } = req.body;

        if (!nombre || !telefono) {
            return res.status(400).json({ message: 'Nombre y teléfono son obligatorios' });
        }

        const cliente = await prisma.cliente.create({
            data: { nombre, direccion, telefono, email }
        });
        res.status(201).json(cliente);
    } catch (error) {
        console.error('Error detallado:', error);
        res.status(500).json({ 
            message: 'Error al crear cliente',
            error: error.message
        });
    }
};

// Obtener todos los gastos
exports.getClientes = async (req, res) => {
    try {
        const clientes = await prisma.cliente.findMany();
        res.status(200).json(clientes);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener clientes' });
    }
};

// Obtener un gasto por su ID
exports.getClienteById = async (req, res) => {
    try {
        const cliente = await prisma.cliente.findUnique({
            where: { id: parseInt(req.params.id) }
        });
        cliente ? res.status(200).json(cliente) : res.status(404).json({ message: 'Cliente no encontrado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener cliente' });
    }
};

// Actualizar un gasto
exports.updateCliente = async (req, res) => {
    try {
        const cliente = await prisma.cliente.update({
            where: { id: parseInt(req.params.id) },
            data: req.body
        });
        res.status(200).json(cliente);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar cliente' });
    }
};

// Eliminar un gasto
exports.deleteCliente = async (req, res) => {
    try {
        await prisma.cliente.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar cliente' });
    }
};
