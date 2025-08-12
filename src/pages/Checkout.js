import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useReduxCart } from '../hooks/useReduxCart';
import { useNotification } from '../hooks/useNotification';
import { useAuth } from '../hooks/useAuth';
import { createOrder } from '../services/api';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart, loading } = useReduxCart();
  const { showNotification } = useNotification();
  const { user, isAuthenticated } = useAuth();
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  
  // Set user data when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setCustomerName(user.name || '');
      setCustomerEmail(user.email || '');
    }
  }, [isAuthenticated, user]);
  
  // Calculate total from cart items
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!customerName.trim() || !customerEmail.trim()) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }
    
    if (cart.length === 0) {
      showNotification('Your cart is empty', 'error');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Get the session ID from localStorage
      const sessionId = localStorage.getItem('cartSessionId');
      
      // Prepare order data
      const orderData = {
        customerName,
        customerEmail,
        sessionId
      };
      
      // Add user ID if authenticated
      if (isAuthenticated && user) {
        orderData.userId = user._id;
      }
      
      console.log('Submitting order with data:', orderData);
      
      // Create the order
      const response = await createOrder(orderData);
      
      console.log('Order created successfully:', response);
      
      // Show success notification
      showNotification('Order placed successfully!', 'success');
      
      // Store the order number
      setOrderNumber(response.orderNumber || (response && response._id));
      
      // Clear the cart
      clearCart();
      
    } catch (error) {
      console.error('Error creating order:', error);
      showNotification(error.message || 'Failed to place order', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // If order is complete, show confirmation
  if (orderNumber) {
    return (
      <div className="checkout-container">
        <div className="order-confirmation">
          <h1>Thank You For Your Order!</h1>
          <div className="order-details">
            <p className="order-number">Order Number: <strong>{orderNumber}</strong></p>
          </div>
          <button 
            className="continue-shopping" 
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="checkout-container">
        <h1>Checkout</h1>
        <p className="loading">Loading your cart...</p>
      </div>
    );
  }
  
  if (!cart || cart.length === 0) {
    return (
      <div className="checkout-container">
        <h1>Checkout</h1>
        <p className="empty-cart">Your cart is empty</p>
        <button 
          className="continue-shopping" 
          onClick={() => navigate('/')}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      
      <div className="checkout-content">
        <div className="checkout-form-container">
          <h2>Customer Information</h2>
            
            {/* Authentication Status Display */}
            {isAuthenticated ? (
              <div className="auth-status">
                <p>Logged in as <strong>{user.name}</strong></p>
              </div>
            ) : (
              <div className="auth-options">
                <p>Already have an account?</p>
                <Link to="/login?redirect=checkout" className="login-link">Log in for faster checkout</Link>
              </div>
            )}
            
            <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="customerName">Full Name</label>
              <input
                type="text"
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                disabled={isAuthenticated}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="customerEmail">Email Address</label>
              <input
                type="email"
                id="customerEmail"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                disabled={isAuthenticated}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="place-order-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>
        
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="cart-items-summary">
            {cart.map(item => (
              <div key={item._id} className="summary-item">
                <div className="summary-item-details">
                  <span className="item-quantity">{item.quantity}x</span>
                  <span className="item-name">{item.product?.name || 'Product'}</span>
                  <span className="item-size">{item.attribute?.attributeValue || 'Standard'}</span>
                </div>
                <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div className="summary-totals">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
