import React, { useEffect, useState } from 'react';
import { useReduxCart } from '../hooks/useReduxCart';
import { useNotification } from '../components/NotificationProvider';
import './Cart.css';

const Cart = () => {
  const { cart, updateItem, removeItem, loading } = useReduxCart();
  const { showNotification } = useNotification();
  const [total, setTotal] = useState(0);
  
  useEffect(() => {
    if (cart && cart.length > 0) {
      // Calculate total locally from cart items
      const calculatedTotal = cart.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
      }, 0);
      setTotal(calculatedTotal);
    } else {
      setTotal(0);
    }
  }, [cart]);

  const handleUpdateQuantity = (itemId, quantity) => {
    updateItem(itemId, quantity);
    showNotification('Cart updated', 'success');
  };

  const handleRemove = (itemId) => {
    console.log('Removing item with ID:', itemId);
    removeItem(itemId);
    showNotification('Item removed from cart', 'success');
  };

  if (loading) {
    return (
      <div className="cart-container">
        <h1 className="cart-title">Shopping Cart</h1>
        <p className="loading-cart">Loading your cart...</p>
      </div>
    );
  }
  
  if (!cart || cart.length === 0) {
    return (
      <div className="cart-container">
        <h1 className="cart-title">Shopping Cart</h1>
        <p className="empty-cart">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1 className="cart-title">Shopping Cart</h1>
      
      <div className="cart-items">
        {cart.map(item => {
          console.log('Cart item:', item);
          // Handle the new cart item structure from Redux
          const product = item.product || {};
          const attribute = item.attribute || {};
          const price = item.price || 0;
          
          return (
            <div key={item._id} className="cart-item">
              <img src={product.image} alt={product.name} className="item-image" />
              
              <div className="item-details">
                <h3 className="item-name">{product.name}</h3>
                <p className="item-price">${price.toFixed(2)}</p>
                <p className="item-size">Size: {attribute.attributeValue || 'Standard'}</p>
              </div>

              <div className="quantity-controls">
                <button
                  className="quantity-button"
                  onClick={() => handleUpdateQuantity(item._id, Math.max(1, item.quantity - 1))}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span className="quantity-value">{item.quantity}</span>
                <button
                  className="quantity-button"
                  onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                >
                  +
                </button>
              </div>

              <div className="item-total">
                ${(price * item.quantity).toFixed(2)}
              </div>

              <button
                className="remove-button"
                onClick={() => handleRemove(item._id)}
              >
                Remove All
              </button>
            </div>
          );
        })}
      </div>

      <div className="cart-summary">
        <h2 className="summary-title">Order Summary</h2>
        <div className="summary-row">
          <span>Subtotal</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <button 
          className="checkout-button"
          onClick={() => window.location.href = '/checkout'}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
