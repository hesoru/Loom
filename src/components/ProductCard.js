import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart } from '../redux/cartSlice';
import { useNotification } from './NotificationProvider';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [selectedSize, setSelectedSize] = useState('');
  const { showNotification } = useNotification();

  const handleAddToCart = () => {
    if (!selectedSize) {
      showNotification('Please select a size.', 'error');
      return;
    }
    
    dispatch(addToCart({ ...product, quantity: 1, size: selectedSize }));
    showNotification('Item added to cart!', 'success');
  };

  return (
    <div style={styles.cardWrapper}>
      <Link to={`/product/${product.id}`} style={styles.cardLink}>
        <div style={styles.card}>
          <img src={product.image} alt={product.name} style={styles.image} />
          <div style={styles.content}>
            <h3 style={styles.title}>{product.name}</h3>
            <p style={styles.price}>${product.price.toFixed(2)}</p>
            <div style={styles.sizeContainer}>
              {product.availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedSize(size);
                  }}
                  style={{
                    ...styles.sizeButton,
                    ...(selectedSize === size ? styles.selectedSize : {}),
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Link>
        <div style={styles.actions}>
          <button onClick={handleAddToCart} style={styles.addButton}>
            Add to Cart
          </button>
        </div>
    </div>
  );
};

const styles = {
  sizeContainer: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
    marginBottom: '1rem',
  },
  sizeButton: {
    padding: '0.3rem 0.6rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  selectedSize: {
    backgroundColor: '#9d7d63',
    color: 'white',
    borderColor: '#9d7d63',
  },
  cardWrapper: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#fff',
    transition: 'transform 0.2s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
  },
  cardLink: {
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
  },
  card: {
    height: '100%',
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  content: {
    padding: '1rem',
  },
  title: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.1rem',
  },
  price: {
    margin: '0 0 1rem 0'
  },
  actions: {
    padding: '1rem',
    borderTop: '1px solid #eee',
  },
  addButton: {
    padding: '0.75rem 1rem',
    backgroundColor: '#9d7d63',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    width: '100%',
    fontSize: '1rem',
    transition: 'background-color 0.2s ease',
  },
};

export default ProductCard;