import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AdminOrdersPage.css';

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders');
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching all orders:', err.message);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, {
        status: newStatus,
      });
      fetchAllOrders();
    } catch (err) {
      console.error('Update error:', err.response?.data || err.message);
      alert('Failed to update status');
    }
  };

  return (
    <div className="admin-orders-container">
      <h2>All Orders</h2>

      {orders.length === 0 ? (
        <p>No orders placed yet.</p>
      ) : (
        <div className="admin-order-list">
          {orders.map((order, index) => (
            <div key={index} className="admin-order-card">
              <p><strong>User:</strong> {order.customerId?.name || 'Guest User'}</p>

              <p><strong>Status:</strong></p>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                className="status-dropdown"
              >
                <option value="Placed">Placed</option>
                <option value="Preparing">Preparing</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <p><strong>Payment:</strong> {order.paymentMethod}</p>
              <p><strong>Total:</strong> ₹{order.totalAmount}</p>
              <p><strong>Ordered On:</strong> {new Date(order.orderedOn).toLocaleString()}</p>

              <div className="ordered-items">
                <strong>Items:</strong>
                <ul>
                  {order.items.map((item, idx) => {
                    const food = item.foodId;
                    const imageUrl = food?.image
                      ? `http://localhost:5000/uploads/${food.image}`
                      : 'https://via.placeholder.com/60';

                    return (
                      <li key={idx}>
                        <div className="item-info">
                          <img
                            src={imageUrl}
                            alt={food?.foodName || 'Deleted'}
                            className="food-image"
                          />
                          <span>
                            {food?.foodName || 'Deleted Item'} × {item.quantity}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                <button
                  className="cancel-button"
                  onClick={() => handleStatusChange(order._id, 'Cancelled')}
                >
                  Cancel Order
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminOrdersPage;
