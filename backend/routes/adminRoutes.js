const express = require('express');
const router = express.Router();
const Food = require('../models/food');
const User = require('../models/user');
const Order = require('../models/order');
const upload = require('../middleware/uploadMiddleware');
const path = require('path');
const fs = require('fs');

// Admin Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123') {
    res.json({ success: true, token: 'admin-token' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Add Food Item (save only filename in DB)
router.post('/add-food', upload.single('image'), async (req, res) => {
  try {
    const { foodName, price, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const ext = path.extname(req.file.originalname);
    const fileName = Date.now() + ext;

    // Move uploaded file to /uploads with new name
    const newPath = path.join(__dirname, '..', 'uploads', fileName);
    fs.renameSync(req.file.path, newPath);

    if (!foodName || !price || !category) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Save only filename in DB
    const newFood = new Food({
      foodName,
      price,
      category,
      image: fileName
    });

    await newFood.save();
    res.status(201).json({ message: 'Food item added successfully', food: newFood });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all users (excluding password)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

// Update order status
router.patch('/orders/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    const validStatuses = ['Placed', 'Preparing', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    await order.save();

    res.json({ message: 'Order status updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update order status', error: err.message });
  }
});

module.exports = router;
