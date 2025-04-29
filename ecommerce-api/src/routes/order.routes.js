const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const protect = require('../middlewares/auth');

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Crear nueva orden
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - products
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: ID del producto
 *     responses:
 *       201:
 *         description: Orden creada exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
router.post('/', protect, orderController.create);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Obtener órdenes del usuario autenticado
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de órdenes
 *       401:
 *         description: No autorizado
 */
router.get('/', protect, orderController.list);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Obtener orden por ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Detalles de la orden
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Orden no encontrada
 */
router.get('/:id', protect, orderController.get);

module.exports = router;