import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllCarts } from '../services/api';
import './AdminLists.css';

const CartsList = () => {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCarts = async () => {
      try {
        setLoading(true);
        const data = await getAllCarts();
        setCarts(data);
      } catch (err) {
        setError('Failed to fetch carts. Please try again later.');
        console.error('Error fetching carts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCarts();
  }, []);

  if (loading) return <div className="admin-loading">Loading carts...</div>;
  if (error) return <div className="admin-error">{error}</div>;

  return (
    <div className="admin-list-container">
      <div className="admin-header">
        <h1>Shopping Carts</h1>
        <Link to="/admin" className="back-button">Back to Admin</Link>
      </div>

      {carts.length === 0 ? (
        <div className="admin-empty">No active shopping carts found.</div>
      ) : (
        <div className="admin-cards">
          {carts.map((cart) => (
            <div key={cart.sessionId} className="admin-card">
              <div className="card-header">
                <h2>Cart ID: {cart.sessionId}</h2>
                <span className="cart-total">${cart.total?.toFixed(2) || '0.00'}</span>
              </div>
              
              <div className="items-container">
                <h3>Items ({cart.items.length})</h3>
                {cart.items.length === 0 ? (
                  <p>No items in cart</p>
                ) : (
                  <ul className="items-list">
                    {cart.items.map((item, index) => (
                      <li key={index} className="item">
                        <div className="item-image">
                          {item.product?.image ? (
                            <img src={item.product.image} alt={item.product.name} />
                          ) : (
                            <div className="no-image">No Image</div>
                          )}
                        </div>
                        <div className="item-details">
                          <h4>{item.product?.name || 'Unknown Product'}</h4>
                          <p>
                            {item.attribute?.attributeValue && (
                              <span className="attribute">{item.attribute.attributeValue}</span>
                            )}
                            <span className="quantity">Qty: {item.quantity}</span>
                            <span className="price">${item.price?.toFixed(2) || '0.00'}</span>
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

export default CartsList;
