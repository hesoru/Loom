import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useReduxCart } from '../hooks/useReduxCart';
import { useNotification } from './NotificationProvider';
import { getProductAttributes } from '../services/api';

const ProductCard = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedAttributePrice, setSelectedAttributePrice] = useState(null);
  const [productAttributes, setProductAttributes] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(product ? product.price : 0);
  const { addItem } = useReduxCart();
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchProductAttributes = async () => {
      try {
        if (product && product._id) {
          const attributesData = await getProductAttributes(product._id);
          setProductAttributes(attributesData);
        }
      } catch (error) {
        console.error('Error fetching product attributes:', error);
      }
    };
    
    fetchProductAttributes();
  }, [product]);

  const handleSizeSelect = (attributeId, attributeValue, price) => {
    console.log('ProductCard - handleSizeSelect:', { attributeId, attributeValue, price });
    setSelectedSize(attributeValue);
    setSelectedAttributePrice(attributeId);
    setCurrentPrice(price);
  };

  const handleAddToCart = async () => {
    if (!selectedAttributePrice) {
      showNotification('Please select a size.', 'error');
      return;
    }
    
    console.log('ProductCard - handleAddToCart - selectedAttributePrice:', selectedAttributePrice);
    console.log('ProductCard - handleAddToCart - selectedAttributePrice type:', typeof selectedAttributePrice);
    
    try {
      const payload = {
        productAttributePriceId: selectedAttributePrice,
        quantity: 1
      };
      
      console.log('ProductCard - handleAddToCart - payload:', payload);
      
      await addItem(payload);
      showNotification('Item added to cart!', 'success');
    } catch (error) {
      console.error('Error adding item to cart:', error);
      showNotification('Failed to add item to cart.', 'error');
    }
  };

  return (
    <div style={styles.cardWrapper}>
      <Link to={`/products/${product._id}`} style={styles.cardLink}>
        <div style={styles.card}>
          <img src={product.image} alt={product.name} style={styles.image} />
          <div style={styles.content}>
            <h3 style={styles.title}>{product.name}</h3>
            <p style={styles.price}>
              {selectedSize ? `$${currentPrice.toFixed(2)}` : 'Select Size'}
            </p>
            <div style={styles.sizeContainer}>
              {productAttributes.length > 0 && productAttributes.map((attrPrice) => (
                <button
                  key={attrPrice._id}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSizeSelect(attrPrice._id, attrPrice.attribute.attributeValue, attrPrice.price);
                  }}
                  style={{
                    ...styles.sizeButton,
                    ...(selectedSize === attrPrice.attribute.attributeValue ? styles.selectedSize : {}),
                  }}
                >
                  {attrPrice.attribute.attributeValue}
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