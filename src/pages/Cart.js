import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateQuantity, removeFromCart } from '../redux/cartSlice';

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
      <div style={styles.container}>
        <h1 style={styles.title}>Shopping Cart</h1>
        <p style={styles.emptyCart}>Your cart is empty</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Shopping Cart</h1>
      
      <div style={styles.cartItems}>
        {items.map(item => (
          <div key={item.id} style={styles.cartItem}>
            <img src={item.image} alt={item.name} style={styles.itemImage} />
            
            <div style={styles.itemDetails}>
              <h3 style={styles.itemName}>{item.name}</h3>
              <p style={styles.itemPrice}>${item.price.toFixed(2)}</p>
              <p style={styles.itemSize}>Size: {item.size}</p>
            </div>

            <div style={styles.quantity}>
              <button
                style={styles.quantityButton}
                onClick={() => handleUpdateQuantity(item.id, item.size, item.quantity - 1)}
              >
                -
              </button>
              <span style={styles.quantityValue}>{item.quantity}</span>
              <button
                style={styles.quantityButton}
                onClick={() => handleUpdateQuantity(item.id, item.size, item.quantity + 1)}
              >
                +
              </button>
            </div>

            <div style={styles.itemTotal}>
              ${(item.price * item.quantity).toFixed(2)}
            </div>

            <button
              style={styles.removeButton}
              onClick={() => handleRemove(item.id, item.size)}
            >
              Remove All
            </button>
          </div>
        ))}
      </div>

      <div style={styles.summary}>
        <h2 style={styles.summaryTitle}>Order Summary</h2>
        <div style={styles.summaryRow}>
          <span>Subtotal</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <button style={styles.checkoutButton}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '2rem',
    textAlign: 'center',
    color: '#6f462e'
  },
  emptyCart: {
    textAlign: 'center',
    color: '#666',
    fontSize: '1.2rem',
  },
  cartItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  cartItem: {
    display: 'grid',
    gridTemplateColumns: '100px 2fr 1fr 1fr auto',
    gap: '1rem',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  itemImage: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '4px',
  },
  itemDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  itemName: {
    margin: 0,
    fontSize: '1.1rem',
  },
  itemPrice: {
    margin: 0,
    color: '#666',
  },
  quantity: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  quantityButton: {
    padding: '0.5rem',
    width: '30px',
    height: '30px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: '#f8f9fa',
    cursor: 'pointer',
  },
  quantityValue: {
    padding: '0 1rem',
  },
  itemTotal: {
    fontWeight: 'bold',
    color: '#000',
  },
  removeButton: {
    padding: '0.5rem',
    backgroundColor: '#9d7d63',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  summary: {
    marginTop: '2rem',
    padding: '1.5rem',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  summaryTitle: {
    margin: '0 0 1rem 0',
    fontSize: '1.5rem',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1rem',
    fontSize: '1.1rem',
  },
  checkoutButton: {
    width: '100%',
    padding: '1rem',
    backgroundColor: '#866246',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1.1rem',
  },
};

export default Cart;
