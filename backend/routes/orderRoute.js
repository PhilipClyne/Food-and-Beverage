const express = require('express');
const router = express.Router();
const {
    createOrder,
    getAllOrders,
    getOrdersByStatus,
    getOrderById,
    updateOrder,
    confirmOrder,
    cancelOrder,
    getTotalRevenue
} = require('../controllers/orderController');

// Create a new order
router.post('/', createOrder);
router.get('/', getAllOrders);
router.get('/status/', getOrdersByStatus);
router.get('/:orderId', getOrderById);
router.put('/:orderId', updateOrder);
router.put('/:orderId/confirm', confirmOrder);
router.put('/:orderId/cancel', cancelOrder);
router.get('/revenue/date', getTotalRevenue);

module.exports = router;
