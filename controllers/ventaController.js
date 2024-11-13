// controllers/ventaController.js
const { Venta, DetalleVenta } = require('../models');

// Crear una nueva venta
exports.createVenta = async (req, res) => {
    const { clienteId, productos, total, fecha } = req.body;
    try {
        const venta = await Venta.create({
            clienteId,
            total,
            fecha
        });

        // Registrar los productos en la venta
        productos.forEach(async (producto) => {
            await DetalleVenta.create({
                ventaId: venta.id,
                productoId: producto.id,
                cantidad: producto.cantidad,
                precioUnitario: producto.precio
            });
        });

        res.status(201).json(venta);
    } catch (error) {
        console.error('Error al crear venta:', error);
        res.status(500).json({ message: 'Error al crear venta' });
    }
};

// Obtener todas las ventas
exports.getVentas = async (req, res) => {
    try {
        const ventas = await Venta.findAll({
            include: ['cliente', 'detalles'] // Incluye cliente y detalles de la venta
        });
        res.status(200).json(ventas);
    } catch (error) {
        console.error('Error al obtener ventas:', error);
        res.status(500).json({ message: 'Error al obtener ventas' });
    }
};

// Obtener una venta por su ID
exports.getVentaById = async (req, res) => {
    const { id } = req.params;
    try {
        const venta = await Venta.findByPk(id, {
            include: ['cliente', 'detalles'] // Incluye cliente y detalles de la venta
        });
        if (venta) {
            res.status(200).json(venta);
        } else {
            res.status(404).json({ message: 'Venta no encontrada' });
        }
    } catch (error) {
        console.error('Error al obtener venta:', error);
        res.status(500).json({ message: 'Error al obtener venta' });
    }
};
