import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOrders } from '../services/api';
import './AdminLists.css';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getOrders();
        setOrders(data);
      } catch (err) {
        setError('Failed to fetch orders. Please try again later.');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="admin-loading">Loading orders...</div>;
  if (error) return <div className="admin-error">{error}</div>;

  return (
    <div className="admin-list-container">
      <div className="admin-header">
        <h1>Orders</h1>
        <Link to="/admin" className="back-button">Back to Admin</Link>
      </div>

      {orders.length === 0 ? (
        <div className="admin-empty">No orders found.</div>
      ) : (
        <div className="admin-cards">
          {orders.map((order) => (
            <div key={order._id} className="admin-card">
              <div className="card-header">
                <h2>Order #{order.orderNumber}</h2>
                <span className="order-status">{order.status}</span>
              </div>
              
              <div className="order-info">
                <p><strong>Customer:</strong> {order.customerName}</p>
                <p><strong>Email:</strong> {order.customerEmail}</p>
                <p><strong>Date:</strong> {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</p>
                <p><strong>Total:</strong> ${order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}</p>
              </div>
              
              <div className="items-container">
                <h3>Items ({order.items.length})</h3>
                {order.items.length === 0 ? (
                  <p>No items in order</p>
                ) : (
                  <ul className="items-list">
                    {order.items.map((item, index) => (
                      <li key={index} className="item">
                        <div className="item-image">
                          {item.productImage ? (
                            <img src={item.productImage} alt={item.productName} />
                          ) : (
                            <div className="no-image">No Image</div>
                          )}
                        </div>
                        <div className="item-details">
                          <h4>{item.productName || 'Unknown Product'}</h4>
                          <p>
                            {item.attributeValue && (
                              <span className="attribute">{item.attributeValue}</span>
                            )}
                            <span className="quantity">Qty: {item.quantity || 0}</span>
                            <span className="price">${item.price ? item.price.toFixed(2) : '0.00'}</span>
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersList;
