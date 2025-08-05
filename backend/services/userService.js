const User = require('../models/user');
const Food = require('../models/food');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'myjwtsecret';

// Register user
async function registerUser({ name, email, password }) {
  // Field validation
  if (!name || !email || !password) {
    throw new Error('All fields are required');
  }

  // Email format check
  const emailPattern = /^[a-zA-Z][a-zA-Z0-9_]*@gmail\.com$/;
  if (!emailPattern.test(email)) {
    throw new Error('Invalid email format');
  }

  const existing = await User.findOne({ email });
  if (existing) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: 'user',
  });

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });

  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

// Login user
async function loginUser({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });

  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

// Toggle wishlist item
const toggleWishlist = async (req, res) => {
  try {
    const userId = req.body.userId;
    const foodId = req.params.foodId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const alreadyAdded = user.wishlist.includes(foodId);

    if (alreadyAdded) {
      user.wishlist.pull(foodId);
    } else {
      user.wishlist.push(foodId);
    }

    await user.save();

    res.status(200).json({ message: 'Wishlist updated', wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all wishlist items with food details
const getWishlist = async (req, res) => {
  try {
    const userId = req.query.userId;

    const user = await User.findById(userId).populate('wishlist');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Add new address
const addAddress = async (req, res) => {
  const { userId, address } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.addresses.push(address);
    await user.save();

    res.status(200).json({ addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all saved addresses
const getAddresses = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  toggleWishlist,
  getWishlist,
  addAddress,
  getAddresses,
};
