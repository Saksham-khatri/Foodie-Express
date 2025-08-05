import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/OrderHistoryPage.css';
import { useNavigate } from 'react-router-dom';

function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || !user._id) {
      navigate('/login');
    } else {
      fetchOrders(user._id);
    }
  }, []);

  const fetchOrders = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/orders/customer/${userId}`);
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching orders:', err.message);
    }
  };

  // Status badge color based on order status
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'placed':
        return 'status-placed';
      case 'delivered':
        return 'status-delivered';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-default';
    }
  };

  return (
    <div className="order-history-container">
      <h2 className="order-history-heading">Order History</h2>

      {orders.length === 0 ? (
        <p className="no-orders">No orders found</p>
      ) : (
        <div className="order-list">
          {orders.map((order, index) => (
            <div key={index} className="order-card">
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Payment:</strong> {order.paymentMethod}</p>
              <p><strong>Ordered On:</strong> {new Date(order.orderedOn).toLocaleString()}</p>
              <p><strong>Delivery Address:</strong> {order.address}</p>

              <div className="order-items">
                {order.items.map((item, idx) => {
                  const imageUrl = item.foodId?.image
                    ? `http://localhost:5000/uploads/${item.foodId.image}`
                    : 'https://via.placeholder.com/100x80?text=No+Image';

                  return (
                    <div key={idx} className="order-item">
                      <img
                        src={imageUrl}
                        alt={item.foodId?.foodName || 'Deleted Item'}
                        className="order-item-img"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/100x80?text=No+Image';
                        }}
                      />
                      <div className="order-item-details">
                        <p><strong>{item.foodId?.foodName || 'Deleted Item'}</strong></p>
                        <p>₹{item.foodId?.price || 0} × {item.quantity}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="order-total">Total Amount: ₹{order.totalAmount}</p>

              {/* Status badge */}
              <div className={`order-status-badge ${getStatusClass(order.status)}`}>
                {order.status.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderHistoryPage;
