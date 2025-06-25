import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import axios from 'axios';
import './MyOrders.css';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login?redirect=orders');
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/orders/user/${user._id}`);
        setOrders(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load your orders. Please try again later.');
        showNotification('Failed to load your orders', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, navigate, user, showNotification]);

  if (loading) {
    return (
      <div className="my-orders-container">
        <h1>My Orders</h1>
        <div className="loading">Loading your orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-orders-container">
        <h1>My Orders</h1>
        <div className="error">{error}</div>
        <button 
          className="retry-button" 
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="my-orders-container">
        <h1>My Orders</h1>
        <div className="no-orders">
          <p>You haven't placed any orders yet.</p>
          <Link to="/" className="shop-now-button">Shop Now</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders-container">
      <h1>My Orders</h1>
      
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <div>
                <h2>Order #{order.orderNumber}</h2>
                <p className="order-date">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="order-total">
                ${order.totalAmount.toFixed(2)}
              </div>
            </div>
            
            <div className="order-items">
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <div className="item-info">
                    <span className="item-quantity">{item.quantity}x</span>
                    <span className="item-name">{item.productName}</span>
                    {item.attributeValue !== 'Standard' && (
                      <span className="item-attribute">{item.attributeValue}</span>
                    )}
                  </div>
                  <div className="item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="order-status">
              <span className="status-badge">
                {order.status || 'Processing'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
