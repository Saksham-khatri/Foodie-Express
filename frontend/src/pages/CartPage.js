import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from '../context/CartContext';
import axios from 'axios';
import '../styles/CartPage.css';

function CartPage() {
  const {
    cartItems,
    removeFromCart,
    clearCart,
    addToCart,
    decreaseQuantity,
  } = useContext(CartContext);

  const [address, setAddress] = useState('');
  const [savedAddresses, setSavedAddresses] = useState([]);

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Load saved addresses from backend
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user._id) {
      axios
        .get(`http://localhost:5000/api/users/address/${user._id}`)
        .then((res) => {
          setSavedAddresses(res.data.addresses || []);
        })
        .catch((err) => {
          console.error('Error loading saved addresses:', err.message);
        });
    }
  }, []);

  const handlePlaceOrder = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user._id) {
        alert('Please login to place order');
        return;
      }

      if (!address.trim()) {
        alert('Please enter delivery address');
        return;
      }

      const customerId = user._id;
      const items = cartItems.map((item) => ({
        foodId: item._id,
        quantity: item.quantity,
      }));

      const res = await axios.post('http://localhost:5000/api/orders', {
        items,
        totalAmount,
        paymentMethod: 'Cash', // Fixed to Cash only
        address,
        customerId,
      });

      if (res.data?.order) {
        alert('Order placed successfully!');
        clearCart();
        setAddress('');
      } else {
        alert('Failed to place order');
      }
    } catch (err) {
      console.error('Order Error:', err.message);
      alert('Error placing order: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="cart-container">
      <h2 className="cart-heading">Your Cart</h2>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <img
            src="/empty-cart.png"
            alt="Empty Cart"
            className="empty-cart-img"
          />
          <h3>Your cart is empty</h3>
          <p>Looks like you haven't added anything yet.</p>
          <a href="/" className="go-home-btn">Go to Home</a>
        </div>
      ) : (
        <>
          <ul className="cart-items">
            {cartItems.map((item) => (
              <li key={item._id} className="cart-item">
                <img
                  src={
                    item.image?.startsWith('http')
                      ? item.image
                      : `http://localhost:5000/uploads/${item.image}`
                  }
                  alt={item.foodName}
                  className="cart-img"
                />

                <div className="cart-details">
                  <h4>{item.foodName}</h4>
                  <p>₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}</p>

                  <div className="qty-btns">
                    <button onClick={() => decreaseQuantity(item._id)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => addToCart(item)}>+</button>
                  </div>

                  <button onClick={() => removeFromCart(item._id)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>

          <div className="cart-summary">
            <p className="total">Total: ₹{totalAmount}</p>

            <div className="payment-method">
              <p><strong>Payment Method:</strong> Cash </p>
            </div>

            <div className="address-field">
              <label>
                Choose Saved Address:
                <select
                  onChange={(e) => setAddress(e.target.value)}
                  value={address}
                >
                  <option value="">-- Select Saved Address --</option>
                  {savedAddresses.map((addr, index) => (
                    <option key={index} value={addr}>
                      {addr}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Or Enter New Address:
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter full delivery address"
                  rows="3"
                />
              </label>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="place-order-btn"
              disabled={!address.trim() || cartItems.length === 0}
            >
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CartPage;
