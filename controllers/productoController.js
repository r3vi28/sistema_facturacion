// controllers/productoController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Crear un nuevo producto
exports.createProducto = async (req, res) => {
    try {
        const { nombre, precio, cantidad } = req.body;
        const producto = await prisma.producto.create({
            data: { nombre, precio, cantidad }
        });
        res.status(201).json(producto);
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ message: 'Error al crear producto' });
    }
};

// Obtener todos los productos
exports.getProductos = async (req, res) => {
    try {
        const productos = await prisma.producto.findMany();
        res.status(200).json(productos);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ message: 'Error al obtener productos' });
    }
};

// Obtener un producto por su ID
exports.getProductoById = async (req, res) => {
    const { id } = req.params;
    try {
        const producto = await prisma.producto.findUnique({
            where: { id: parseInt(id) }
        });
        if (producto) {
            res.status(200).json(producto);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(500).json({ message: 'Error al obtener producto' });
    }
};

// Actualizar un producto
exports.updateProducto = async (req, res) => {
    const { id } = req.params;
    const { nombre, precio, cantidad } = req.body;
    try {
        const producto = await prisma.producto.update({
            where: { id: parseInt(id) },
            data: { nombre, precio, cantidad }
        });
        res.status(200).json(producto);
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ message: 'Error al actualizar producto' });
    }
};

// Eliminar un producto
exports.deleteProducto = async (req, res) => {
    const { id } = req.params;
    try {
        const producto = await prisma.producto.findUnique({
            where: { id: parseInt(id) }
        });
        if (producto) {
            await prisma.producto.delete({
                where: { id: parseInt(id) }
            });
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ message: 'Error al eliminar producto' });
    }
};

