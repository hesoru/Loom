import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    const results = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
    setHasSearched(true);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Search Products</h1>
      
      <form onSubmit={handleSearch} style={styles.searchForm}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for products..."
          style={styles.searchInput}
        />
        <button type="submit" style={styles.searchButton}>
          Search
        </button>
      </form>

      {hasSearched && (
        <div style={styles.results}>
          <h2 style={styles.resultsTitle}>
            {searchResults.length} result(s) found
          </h2>
          
          <div style={styles.productsGrid}>
            {searchResults.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {searchResults.length === 0 && (
            <p style={styles.noResults}>
              No products found matching your search.
            </p>
          )}
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
  searchForm: {
    display: 'flex',
    gap: '1rem',
    maxWidth: '600px',
    margin: '0 auto 2rem',
  },
  searchInput: {
    flex: 1,
    padding: '0.75rem',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  searchButton: {
    padding: '0.75rem 2rem',
    backgroundColor: '#9d7d63',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem'
  },
  results: {
    marginTop: '2rem',
  },
  resultsTitle: {
    fontSize: '1.2rem',
    marginBottom: '1rem',
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '2rem',
  },
  noResults: {
    textAlign: 'center',
    color: '#666',
    marginTop: '2rem',
  },
};

export default Search;
