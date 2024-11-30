// controllers/productoController.js
const { Producto } = require('../models');

// Crear un nuevo producto
exports.createProducto = async (req, res) => {
    try {
        const { nombre, precio, cantidad } = req.body;
        const producto = await Producto.create({
            nombre,
            precio,
            cantidad
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
        const productos = await Producto.findAll();
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
        const producto = await Producto.findByPk(id);
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
        const producto = await Producto.findByPk(id);
        if (producto) {
            producto.nombre = nombre;
            producto.precio = precio;
            producto.cantidad = cantidad;
            await producto.save();
            res.status(200).json(producto);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ message: 'Error al actualizar producto' });
    }
};

// Eliminar un producto
exports.deleteProducto = async (req, res) => {
    const { id } = req.params;
    try {
        const producto = await Producto.findByPk(id);
        if (producto) {
            await producto.destroy();
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ message: 'Error al eliminar producto' });
    }
};
