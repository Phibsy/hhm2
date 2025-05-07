const express = require('express');
const {
  createOrder,
  getOrders,
  updateOrderStatus
} = require('../controllers/orderController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .post(createOrder)
  .get(protect, authorize('admin'), getOrders);

router
  .route('/:id')
  .put(protect, authorize('admin'), updateOrderStatus);

module.exports = router;
