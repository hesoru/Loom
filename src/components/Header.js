import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useReduxCart } from '../hooks/useReduxCart';
import { useAuth } from '../hooks/useAuth';

const Header = () => {
  const { cart } = useReduxCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Calculate total items in cart
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  return (
    <header style={styles.header}>
      <h1 style={styles.logo}>
        <Link to="/" style={styles.logo}>Loom</Link>
      </h1>
      <nav style={styles.nav}>
        <Link to="/categories" style={styles.link}>Categories</Link>
        <Link to="/category/Best Sellers" style={styles.link}>Best Sellers</Link>
        <Link to="/search" style={styles.link}>Search</Link>
        <Link to="/admin" style={styles.link}>Admin</Link>
        <Link to="/cart" style={styles.link}>
          Cart ({cart && cart.length ? getTotalItems() : 0})
        </Link>
        
        {isAuthenticated ? (
          <div style={styles.userContainer}>
            <button 
              onClick={toggleDropdown} 
              style={styles.userButton}
            >
              {user.name.split(' ')[0]}
            </button>
            {showDropdown && (
              <div style={styles.dropdown}>
                <Link to="/profile" style={styles.dropdownItem}>My Profile</Link>
                <Link to="/my-orders" style={styles.dropdownItem}>My Orders</Link>
                <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <div style={styles.authLinks}>
            <Link to="/login" style={styles.authLink}>Login</Link>
          </div>
        )}
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
    alignItems: 'center',
  },
  link: {
    textDecoration: 'none',
    color: '#333',
    fontWeight: '500',
    transition: 'color 0.3s ease',
  },
  authLinks: {
    display: 'flex',
    gap: '1rem',
  },
  authLink: {
    textDecoration: 'none',
    color: '#4a90e2',
    fontWeight: '500',
    transition: 'color 0.3s ease',
  },
  userContainer: {
    position: 'relative',
  },
  userButton: {
    background: '#4a90e2',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    fontWeight: '500',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    backgroundColor: 'white',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    borderRadius: '4px',
    width: '150px',
    zIndex: 10,
    marginTop: '0.5rem',
  },
  dropdownItem: {
    display: 'block',
    padding: '0.75rem 1rem',
    textDecoration: 'none',
    color: '#333',
    borderBottom: '1px solid #eee',
  },
  logoutButton: {
    width: '100%',
    textAlign: 'left',
    background: 'none',
    border: 'none',
    padding: '0.75rem 1rem',
    color: '#e74c3c',
    cursor: 'pointer',
    fontSize: '1rem',
  },
};

export default Header;
