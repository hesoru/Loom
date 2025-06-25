import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getProductsByCategory } from '../services/api';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        const data = await getProductsByCategory(categoryName);
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error(`Error fetching products for category ${categoryName}:`, err);
        setError(`Failed to load products for ${categoryName}. Please try again.`);
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [categoryName]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{categoryName}</h1>
      
      {loading ? (
        <div style={styles.loadingContainer}>
          <p>Loading products...</p>
        </div>
      ) : error ? (
        <div style={styles.errorContainer}>
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div style={styles.productsCount}>
            {products.length} {products.length === 1 ? 'product' : 'products'} found
          </div>
          
          <div style={styles.productsGrid}>
            {products.length > 0 ? (
              products.map(product => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <p>No products found in this category.</p>
            )}
          </div>
        </>
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
    marginBottom: '1.5rem',
    textAlign: 'center',
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '2rem',
    fontSize: '1.2rem',
  },
  errorContainer: {
    textAlign: 'center',
    padding: '2rem',
    color: 'red',
    fontSize: '1.2rem',
  },
  productsCount: {
    marginBottom: '1rem',
    color: '#666',
    fontSize: '0.9rem',
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '2rem',
  },
};

export default CategoryPage;
