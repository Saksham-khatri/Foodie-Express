// services/orderService.js

const mongoose = require('mongoose');
const Order = require('../models/order');

// Place a new order
async function placeOrder(data) {
  if (!data.customerId || !data.items || data.items.length === 0) {
    throw new Error('Missing required order fields');
  }

  const order = new Order({
    customerId: data.customerId,
    items: data.items,
    totalAmount: data.totalAmount,
    paymentMethod: data.paymentMethod,
    address: data.address,
    status: 'Placed'
  });

  return await order.save();
}

// Get all orders (admin view)
async function listOrders() {
  return await Order.find()
    .sort({ orderedOn: -1 }) // latest first
    .populate({
      path: 'items.foodId',
      model: 'Food',
      select: 'foodName image price category'
    })
    .populate('customerId', 'name email'); // get customer name + email
}

// Get orders by specific customer
async function getOrdersByCustomer(customerId) {
  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    throw new Error('Invalid customerId');
  }

  return await Order.find({ customerId })
    .sort({ orderedOn: -1 })
    .populate({
      path: 'items.foodId',
      model: 'Food',
      select: 'foodName image price category'
    });
}

// Update order status (Admin)
async function updateOrderStatus(orderId, status) {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new Error('Invalid orderId');
  }

  const allowedStatuses = ['Placed', 'Preparing', 'Delivered', 'Cancelled'];
  if (!allowedStatuses.includes(status)) {
    throw new Error('Invalid status value');
  }

  return await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  )
    .populate({
      path: 'items.foodId',
      model: 'Food',
      select: 'foodName image price category'
    })
    .populate('customerId', 'name email');
}

module.exports = {
  placeOrder,
  listOrders,
  getOrdersByCustomer,
  updateOrderStatus
};
