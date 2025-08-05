const mongoose = require('mongoose');

// User schema: name, email, password, role, wishlist, addresses
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },

    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Food',
      },
    ],

    // New field: saved addresses
    addresses: [{ type: String }],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

module.exports = mongoose.model('User', userSchema);
