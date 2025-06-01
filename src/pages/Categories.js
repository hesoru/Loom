import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';

const Categories = () => {
  const categories = [...new Set(products.map(product => product.category))];
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  const filteredProducts = products.filter(
    product => product.category === selectedCategory
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Product Categories</h1>
      
      <div style={styles.categoryButtons}>
        {categories.map(category => (
          <button
            key={category}
            style={{
              ...styles.categoryButton,
              backgroundColor: selectedCategory === category ? '#9d7d63' : '#f8f9fa',
              color: selectedCategory === category ? '#fff' : '#333',
            }}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div style={styles.productsGrid}>
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '2rem',
    textAlign: 'center',
    color: '#6f462e'
  },
  categoryButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
  },
  categoryButton: {
    padding: '0.5rem 1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '2rem',
  },
};

export default Categories;
