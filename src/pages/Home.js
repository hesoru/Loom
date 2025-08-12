import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getProductsByCategory } from '../services/api';

const Home = () => {
  const [bestSellers, setBestSellers] = useState([]);
  const [bestSellersLoading, setBestSellersLoading] = useState(true);
  const [bestSellersError, setBestSellersError] = useState(null);
  
  // Fetch Best Sellers products
  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const data = await getProductsByCategory('Best Sellers');
        // Shuffle the array and take 3 random products if there are more than 3
        const shuffled = data.sort(() => 0.5 - Math.random());
        const randomBestSellers = shuffled.slice(0, 3);
        setBestSellers(randomBestSellers);
        setBestSellersLoading(false);
      } catch (err) {
        console.error('Error fetching best sellers:', err);
        setBestSellersError('Failed to load best sellers. Please try again.');
        setBestSellersLoading(false);
      }
    };
    
    fetchBestSellers();
  }, []);
  
  return (
    <div style={styles.container}>
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Welcome to Loom</h1>
        <p style={styles.heroText}>Sustainable and ethical fashion.</p>
        <Link to="/categories" style={styles.heroButton}>
          Shop Now
        </Link>
      </section>

      <section style={styles.bestSellers}>
        <h2 style={styles.sectionTitle}>Best Sellers</h2>
        {bestSellersLoading ? (
          <div style={styles.loadingContainer}>
            <p>Loading best sellers...</p>
          </div>
        ) : bestSellersError ? (
          <div style={styles.errorContainer}>
            <p>{bestSellersError}</p>
          </div>
        ) : (
          <div style={styles.productsGrid}>
            {bestSellers.length > 0 ? (
              bestSellers.map(product => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <p>No best sellers found.</p>
            )}
          </div>
        )}
        <div style={styles.viewAllContainer}>
          <Link to="/category/Best Sellers" style={styles.viewAllButton}>
            View All Best Sellers
          </Link>
        </div>
      </section>
    </div>
  );
};

const styles = {
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
  container: {
    padding: '2rem',
  },
  bestSellers: {
    marginTop: '3rem',
  },
  viewAllContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '1.5rem',
  },
  viewAllButton: {
    display: 'inline-block',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#4a4a4a',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    fontWeight: 'bold',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#333',
    },
  },
  hero: {
    textAlign: 'center',
    padding: '8rem 2rem',
    borderRadius: '8px',
    marginBottom: '2rem',
    backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url("https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: 'white',
  },
  heroTitle: {
    fontSize: '3.5rem',
    marginBottom: '1rem',
    color: 'white',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
  },
  heroText: {
    fontSize: '1.4rem',
    color: 'white',
    marginBottom: '2rem',
    textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
  },
  heroButton: {
    display: 'inline-block',
    padding: '1.2rem 3rem',
    backgroundColor: 'white',
    color: '#000',
    textDecoration: 'none',
    borderRadius: '50px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 8px rgba(0,0,0,0.2)',
    },
  },
  featured: {
    marginTop: '3rem',
  },
  sectionTitle: {
    fontSize: '2rem',
    marginBottom: '2rem',
    textAlign: 'center',
    color: '#6f462e',
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '2rem',
  },
};

export default Home;
