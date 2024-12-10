// controllers/ventaController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class VentaController {
    // Obtener todas las ventas
    async getAllVentas(req, res) {
        try {
            const ventas = await prisma.venta.findMany({
                include: {
                    cliente: true,
                    ventaItems: {
                        include: {
                            producto: true,
                            servicio: true
                        }
                    }
                },
                orderBy: {
                    fecha: 'desc'
                }
            });
            res.json(ventas);
        } catch (error) {
            console.error('Error al obtener ventas:', error);
            res.status(500).json({ message: 'Error al obtener las ventas' });
        }
    }

    // Crear nueva venta
    async createVenta(req, res) {
        const { 
            clienteId, 
            laborCost, 
            totalDiscount, 
            items 
        } = req.body;

        try {
            const venta = await prisma.$transaction(async (prisma) => {
                // Calcular total de la venta
                const totalVenta = items.reduce((total, item) => {
                    const itemTotal = item.quantity * item.unitPrice * (1 - item.discount / 100);
                    return total + itemTotal;
                }, 0) + parseFloat(laborCost || 0);

                // Crear venta
                const nuevaVenta = await prisma.venta.create({
                    data: {
                        clienteId: parseInt(clienteId),
                        totalVenta: totalVenta,
                        costoLabor: parseFloat(laborCost || 0),
                        descuentoTotal: parseFloat(totalDiscount || 0),
                        fechaVenta: new Date(),
                        ventaItems: {
                            create: items.map(item => ({
                                productoId: item.productId ? parseInt(item.productId) : null,
                                servicioId: item.serviceId ? parseInt(item.serviceId) : null,
                                cantidad: parseFloat(item.quantity),
                                precioUnitario: parseFloat(item.unitPrice),
                                descuento: parseFloat(item.discount)
                            }))
                        }
                    },
                    include: {
                        cliente: true,
                        ventaItems: true
                    }
                });

                return nuevaVenta;
            });

            res.status(201).json(venta);
        } catch (error) {
            console.error('Error al crear venta:', error);
            res.status(500).json({ message: 'Error al crear la venta', error: error.message });
        }
    }

    // Actualizar venta
    async updateVenta(req, res) {
        const ventaId = parseInt(req.params.id);
        const { 
            clienteId, 
            laborCost, 
            totalDiscount, 
            items 
        } = req.body;

        try {
            const venta = await prisma.$transaction(async (prisma) => {
                // Calcular total de la venta
                const totalVenta = items.reduce((total, item) => {
                    const itemTotal = item.quantity * item.unitPrice * (1 - item.discount / 100);
                    return total + itemTotal;
                }, 0) + parseFloat(laborCost || 0);

                // Eliminar items existentes
                await prisma.ventaItem.deleteMany({
                    where: { ventaId }
                });

                // Actualizar venta
                const ventaActualizada = await prisma.venta.update({
                    where: { id: ventaId },
                    data: {
                        clienteId: parseInt(clienteId),
                        totalVenta: totalVenta,
                        costoLabor: parseFloat(laborCost || 0),
                        descuentoTotal: parseFloat(totalDiscount || 0),
                        ventaItems: {
                            create: items.map(item => ({
                                productoId: item.productId ? parseInt(item.productId) : null,
                                servicioId: item.serviceId ? parseInt(item.serviceId) : null,
                                cantidad: parseFloat(item.quantity),
                                precioUnitario: parseFloat(item.unitPrice),
                                descuento: parseFloat(item.discount)
                            }))
                        }
                    },
                    include: {
                        cliente: true,
                        ventaItems: true
                    }
                });

                return ventaActualizada;
            });

            res.json(venta);
        } catch (error) {
            console.error('Error al actualizar venta:', error);
            res.status(500).json({ message: 'Error al actualizar la venta', error: error.message });
        }
    }

    // Eliminar venta
    async deleteVenta(req, res) {
        const ventaId = parseInt(req.params.id);

        try {
            // Eliminar primero los items de la venta
            await prisma.ventaItem.deleteMany({
                where: { ventaId }
            });

            // Luego eliminar la venta
            await prisma.venta.delete({
                where: { id: ventaId }
            });

            res.status(204).send();
        } catch (error) {
            console.error('Error al eliminar venta:', error);
            res.status(500).json({ message: 'Error al eliminar la venta', error: error.message });
        }
    }

    // Generar factura (PDF)
    async generarFacturaPDF(req, res) {
        const ventaId = parseInt(req.params.id);

        try {
            const venta = await prisma.venta.findUnique({
                where: { id: ventaId },
                include: {
                    cliente: true,
                    ventaItems: {
                        include: {
                            producto: true,
                            servicio: true
                        }
                    }
                }
            });

            if (!venta) {
                return res.status(404).json({ message: 'Venta no encontrada' });
            }

            // Aquí iría la lógica para generar el PDF
            // Por ejemplo, usando bibliotecas como PDFKit
            // Por ahora, solo devolveremos los datos de la venta
            res.json(venta);
        } catch (error) {
            console.error('Error al generar factura:', error);
            res.status(500).json({ message: 'Error al generar la factura', error: error.message });
        }
    }
}

module.exports = new VentaController();