import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Header = () => {
  const cartItems = useSelector(state => state.cart.items);

  return (
    <header style={styles.header}>
      <h1 style={styles.logo}>
        <Link to="/" style={styles.logo}>Loom</Link>
      </h1>
      <nav style={styles.nav}>
        <Link to="/categories" style={styles.link}>Categories</Link>
        <Link to="/search" style={styles.link}>Search</Link>
        <Link to="/cart" style={styles.link}>
          Cart ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
        </Link>
      </nav>
    </header>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#f8f9fa',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  logo: {
    margin: 0,
    fontSize: '1.5rem',
    color: '#6f462e',
  },
  nav: {
    display: 'flex',
    gap: '1.5rem',
  },
  link: {
    textDecoration: 'none',
    color: '#333',
    fontWeight: '500',
    transition: 'color 0.3s ease',
  },
};

export default Header;
