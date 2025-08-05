const express = require('express');
const router = express.Router();
const {
  placeOrder,
  listOrders,
  getOrdersByCustomer,
  updateOrderStatus,
} = require('../services/orderService');

// 🔹 POST /api/orders - Place a new order
router.post('/', async (req, res) => {
  try {
    const { items, totalAmount, paymentMethod, customerId, address } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Items are required' });
    }

    if (!totalAmount || isNaN(totalAmount)) {
      return res.status(400).json({ message: 'Valid totalAmount is required' });
    }

    // Allow only "Cash" as payment method
    if (!paymentMethod || paymentMethod !== 'Cash') {
      return res.status(400).json({ message: 'Only Cash payment is allowed' });
    }

    if (!customerId) {
      return res.status(400).json({ message: 'customerId is required' });
    }

    if (!address || typeof address !== 'string' || address.trim() === '') {
      return res.status(400).json({ message: 'Delivery address is required' });
    }

    const orderData = { customerId, items, totalAmount, paymentMethod, address };
    const newOrder = await placeOrder(orderData);
    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    console.error('POST /api/orders error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

//  GET all orders (admin)
router.get('/', async (req, res) => {
  try {
    const orders = await listOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET orders by customer
router.get('/customer/:customerId', async (req, res) => {
  try {
    const orders = await getOrdersByCustomer(req.params.customerId);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

//  PUT for full status update (not used in frontend)
router.put('/:orderId/status', async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.orderId;
    const validStatuses = ['Placed', 'Preparing', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const updatedOrder = await updateOrderStatus(orderId, status);
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order status updated successfully', order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PATCH (used in frontend)
router.patch('/:orderId', async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.orderId;

    const updatedOrder = await updateOrderStatus(orderId, status);
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order status updated', order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
