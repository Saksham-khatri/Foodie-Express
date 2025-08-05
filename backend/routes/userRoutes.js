const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  toggleWishlist,
  getWishlist,
  addAddress,
  getAddresses
} = require('../services/userService');

const User = require('../models/user');
const bcrypt = require('bcryptjs');

// Regex for strong password validation
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Register
router.post('/register', async (req, res) => {
  try {
    const { password } = req.body;

    //  Validate strong password
    if (!strongPasswordRegex.test(password)) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'
      });
    }

    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const result = await loginUser(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update profile (name, address)
router.put('/:id', async (req, res) => {
  try {
    const { name, address } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.name = name || user.name;
    user.address = address || user.address;

    const updatedUser = await user.save();
    res.json({ updatedUser });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Change password
router.put('/:id/password', async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Old password is incorrect' });

    // Check new password strength
    if (!strongPasswordRegex.test(newPassword)) {
      return res.status(400).json({
        error: 'New password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Delete account permanently
router.delete('/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Add/remove food item from wishlist
router.post('/wishlist/:foodId', toggleWishlist);
router.get('/wishlist', getWishlist);

// Add and get addresses
router.post('/address', addAddress);
router.get('/address/:userId', getAddresses);

//  Remove a saved address
router.put('/address/remove', async (req, res) => {
  try {
    const { userId, address } = req.body;

    const user = await User.findById(userId);
    if (!user || !user.addresses) {
      return res.status(404).json({ error: 'User or address list not found' });
    }

    // Remove exact matching address from the list
    user.addresses = user.addresses.filter((addr) => addr !== address);
    await user.save();

    res.json({ message: 'Address removed', addresses: user.addresses });
  } catch (err) {
    console.error('Address delete error:', err.message);
    res.status(500).json({ error: 'Failed to delete address' });
  }
});

module.exports = router;
