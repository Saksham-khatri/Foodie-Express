// src/components/FoodCard.js

import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import '../styles/FoodCard.css';
import axios from 'axios';

function FoodCard({ item }) {
  const { cartItems, addToCart, decreaseQuantity } = useContext(CartContext);
  const user = JSON.parse(localStorage.getItem('user'));
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    const cartItem = cartItems.find((cartItem) => cartItem._id === item._id);
    setQuantity(cartItem ? cartItem.quantity : 0);
  }, [cartItems, item._id]);

  // Wishlist toggle
  const handleWishlist = async () => {
    try {
      await axios.post(`http://localhost:5000/api/users/wishlist/${item._id}`, {
        userId: user._id,
      });
      setIsWishlisted(!isWishlisted);
    } catch (err) {
      console.error('Wishlist toggle failed:', err);
    }
  };

  // Image logic with fallback
  const imageUrl = item?.image
    ? item.image.startsWith('http')
      ? item.image
      : `http://localhost:5000/uploads/${item.image}`
    : 'https://via.placeholder.com/100x80?text=No+Image';

  return (
    <div className="foodcard">
      {/* Food Image */}
      <img
        src={imageUrl}
        alt={item.foodName}
        className="foodcard-image"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://via.placeholder.com/100x80?text=No+Image';
        }}
      />

      {/* Wishlist button */}
      {user && (
        <button className="wishlist-button" onClick={handleWishlist}>
          {isWishlisted ? '❤️' : '🤍'}
        </button>
      )}

      {/* Food Name */}
      <h3 className="foodcard-name">
        {item.foodName}
      </h3>

      {/* Description */}
      <p className="foodcard-description">{item.description}</p>

      {/* Price */}
      <p className="foodcard-price">₹{item.price}</p>

      {/* Add to Cart / Quantity */}
      <div className="foodcard-actions">
        {quantity === 0 ? (
          <button className="foodcard-button" onClick={() => addToCart(item)}>
            Add to Cart
          </button>
        ) : (
          <div className="quantity-controller">
            <button onClick={() => decreaseQuantity(item._id)}>-</button>
            <span>{quantity}</span>
            <button onClick={() => addToCart(item)}>+</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default FoodCard;
