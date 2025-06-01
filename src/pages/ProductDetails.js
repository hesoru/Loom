import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { products } from '../data/products';
import { useNotification } from '../components/NotificationProvider';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const { showNotification } = useNotification();

  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return <div>Product not found.</div>;
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      showNotification('Please select a size.', 'error');
      return;
    }
    
    dispatch(addToCart({ ...product, quantity, size: selectedSize }));
    showNotification('Item added to cart!', 'success');
  }

  return (
    <div style={styles.container}>
      
      <div style={styles.productContainer}>
        <img src={product.image} alt={product.name} style={styles.image} />
        <div style={styles.details}>
          <h1 style={styles.title}>{product.name}</h1>
          <p style={styles.category}>{product.category}</p>
          <p style={styles.description}>{product.description}</p>
          <p style={styles.price}>${product.price.toFixed(2)}</p>
          
          <div style={styles.sizeContainer}>
            <p style={styles.sizeLabel}>Select Size:</p>
            <div style={styles.sizeButtons}>
              {product.availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
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
          
          <div style={styles.addToCart}>
            <div style={styles.quantity}>
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={styles.quantityButton}
              >
                -
              </button>
              <span style={styles.quantityValue}>{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                style={styles.quantityButton}
              >
                +
              </button>
            </div>
            <button onClick={handleAddToCart} style={styles.addButton}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  sizeContainer: {
    marginBottom: '2rem',
  },
  sizeLabel: {
    fontSize: '1rem',
    color: '#666',
    marginBottom: '0.5rem',
  },
  sizeButtons: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  sizeButton: {
    padding: '0.5rem 1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
  },
  selectedSize: {
    backgroundColor: '#9d7d63',
    color: 'white',
    borderColor: '#9d7d63',
  },
  container: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  productContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '2rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  image: {
    width: '100%',
    height: 'auto',
    borderRadius: '4px',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  title: {
    fontSize: '2rem',
    margin: '0',
  },
  category: {
    color: '#666',
    margin: '0',
  },
  description: {
    fontSize: '1.1rem',
    lineHeight: '1.5',
    margin: '1rem 0',
  },
  price: {
    fontSize: '1.5rem',
    color: '#000',
    fontWeight: 'bold',
    margin: '1rem 0',
  },
  addToCart: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    marginTop: 'auto',
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
  addButton: {
    padding: '0.75rem 2rem',
    backgroundColor: '#9d7d63',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    flex: 1,
  },
};

export default ProductDetails;
