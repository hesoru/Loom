import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateQuantity, removeFromCart } from '../redux/cartSlice';
import './Cart.css';

const Cart = () => {
  const dispatch = useDispatch();
  const { items, total } = useSelector(state => state.cart);

  const handleUpdateQuantity = (id, size, quantity) => {
    dispatch(updateQuantity({ id, size, quantity }));
  };

  const handleRemove = (id, size) => {
    dispatch(removeFromCart({ id, size }));
  };

  if (items.length === 0) {
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
        {items.map(item => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.name} className="item-image" />
            
            <div className="item-details">
              <h3 className="item-name">{item.name}</h3>
              <p className="item-price">${item.price.toFixed(2)}</p>
              <p className="item-size">Size: {item.size}</p>
            </div>

            <div className="quantity-controls">
              <button
                className="quantity-button"
                onClick={() => handleUpdateQuantity(item.id, item.size, item.quantity - 1)}
              >
                -
              </button>
              <span className="quantity-value">{item.quantity}</span>
              <button
                className="quantity-button"
                onClick={() => handleUpdateQuantity(item.id, item.size, item.quantity + 1)}
              >
                +
              </button>
            </div>

            <div className="item-total">
              ${(item.price * item.quantity).toFixed(2)}
            </div>

            <button
              className="remove-button"
              onClick={() => handleRemove(item.id, item.size)}
            >
              Remove All
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h2 className="summary-title">Order Summary</h2>
        <div className="summary-row">
          <span>Subtotal</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <button className="checkout-button">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
