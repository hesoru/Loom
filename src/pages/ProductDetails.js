import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById, getProductAttributes } from '../services/api';
import { useReduxCart } from '../hooks/useReduxCart';
import { useNotification } from '../components/NotificationProvider';
import { useSelector } from 'react-redux';

const ProductDetails = () => {
  const { id } = useParams();
  const { addItem, updateItemQuantity } = useReduxCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedAttributePrice, setSelectedAttributePrice] = useState(null);
  const { showNotification } = useNotification();
  
  // Get cart items from Redux store
  const cartItems = useSelector(state => state.cart.items);
  const [existingCartItem, setExistingCartItem] = useState(null);
  
  const [product, setProduct] = useState(null);
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(0);

  // Fetch product details
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        console.log('Fetching product with ID:', id);
        const productData = await getProductById(id);
        console.log('Product data received:', productData);
        setProduct(productData);
        setCurrentPrice(productData.price);
        
        // Fetch product attributes
        console.log('Fetching attributes for product ID:', id);
        const attributesData = await getProductAttributes(id);
        console.log('Attributes data received:', attributesData);
        setAttributes(attributesData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load product details');
        setLoading(false);
        console.error('Error fetching product details:', err);
      }
    };

    fetchProductDetails();
  }, [id]);

  // Update selected attribute price when size changes
  useEffect(() => {
    console.log('Selected size changed:', selectedSize);
    console.log('Available attributes:', attributes);
    
    const attributePrice = attributes.find(attr => 
      attr.attribute.attributeValue === selectedSize
    );
    
    if (attributePrice) {
      // Store just the ID, not the entire object
      setSelectedAttributePrice(attributePrice._id);
      setCurrentPrice(attributePrice.price);
      
      // Check if this item is already in the cart
      const itemInCart = cartItems.find(item => 
        item.productAttributePriceId === attributePrice._id
      );
      
      if (itemInCart) {
        console.log('Item already in cart:', itemInCart);
        setExistingCartItem(itemInCart);
        setQuantity(itemInCart.quantity); // Set initial quantity to match cart
      } else {
        setExistingCartItem(null);
        setQuantity(1); // Reset quantity if not in cart
      }
    }
  }, [selectedSize, attributes, cartItems]);

  const handleSizeSelect = (attributeId, attributeValue, price) => {
    console.log('Size selected:', { attributeId, attributeValue, price });
    setSelectedSize(attributeValue);
    setSelectedAttributePrice(attributeId); // Store just the ID
    setCurrentPrice(price);
  };

  if (loading) {
    return <div style={styles.loading}>Loading product details...</div>;
  }

  if (error || !product) {
    return <div style={styles.error}>{error || 'Product not found.'}</div>;
  }

  const handleAddToCart = () => {
    if (!selectedAttributePrice) {
      showNotification('Please select a size.', 'error');
      return;
    }
    
    if (existingCartItem) {
      // Update quantity of existing item
      console.log('Updating cart item quantity:', { itemId: existingCartItem._id, quantity });
      updateItemQuantity({
        itemId: existingCartItem._id,
        quantity: quantity
      });
      showNotification('Cart updated!', 'success');
    } else {
      // Add new item to cart
      console.log('Adding new item to cart:', { productAttributePriceId: selectedAttributePrice, quantity });
      addItem({
        productAttributePriceId: selectedAttributePrice,
        quantity
      });
      showNotification('Item added to cart!', 'success');
    }
  }

  return (
    <div style={styles.container}>
      
      <div style={styles.productContainer}>
        <img src={product.image} alt={product.name} style={styles.image} />
        <div style={styles.details}>
          <h1 style={styles.title}>{product.name}</h1>
          <p style={styles.category}>{product.category}</p>
          <p style={styles.description}>{product.description}</p>
          <p style={styles.price}>
            {selectedSize ? `$${currentPrice.toFixed(2)}` : 'Select Size'}
          </p>
          
          <div style={styles.sizeContainer}>
           <div style={styles.sizeButtons}>
              {attributes.map((attrPrice) => (
                <button
                  key={attrPrice._id}
                  onClick={() => handleSizeSelect(attrPrice._id, attrPrice.attribute.attributeValue, attrPrice.price)}
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
              {existingCartItem ? 'Update Cart' : 'Add to Cart'}
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
