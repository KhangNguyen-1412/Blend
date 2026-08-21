const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.post('/', orderController.createOrder);
router.patch('/:id/advance', orderController.advanceOrderStatus);
router.patch('/:id/status', orderController.updateOrderStatus);
router.patch('/:id/refund', orderController.refundOrder);
router.delete('/:id', orderController.deleteOrder);

module.exports = router;
