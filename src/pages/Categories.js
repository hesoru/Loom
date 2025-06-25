import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { getProductsByCategory, getCategories } from '../services/api';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
        if (categoriesData.length > 0) {
          setSelectedCategory(categoriesData[0].name);
        }
      } catch (err) {
        setError('Failed to load categories');
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products when selected category changes
  useEffect(() => {
    const fetchProductsByCategory = async () => {
      if (!selectedCategory) return;
      
      setLoading(true);
      try {
        console.log(selectedCategory);
        const productsData = await getProductsByCategory(selectedCategory);
        setProducts(productsData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load products');
        setLoading(false);
        console.error('Error fetching products:', err);
      }
    };

    fetchProductsByCategory();
  }, [selectedCategory]);

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Product Categories</h1>
      
      <div style={styles.categoryButtons}>
        {categories.map(category => (
          <button
            key={category._id}
            style={{
              ...styles.categoryButton,
              backgroundColor: selectedCategory === category.name ? '#9d7d63' : '#f8f9fa',
              color: selectedCategory === category.name ? '#fff' : '#333',
            }}
            onClick={() => setSelectedCategory(category.name)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={styles.loading}>Loading products...</div>
      ) : (
        <div style={styles.productsGrid}>
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
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
