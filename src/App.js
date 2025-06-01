import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import NotificationProvider from './components/NotificationProvider';
import Header from './components/Header';
import Home from './pages/Home';
import Categories from './pages/Categories';
import ProductDetails from './pages/ProductDetails';
import Search from './pages/Search';
import Cart from './pages/Cart';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <NotificationProvider>
          <div className="App">
            <Header />
            <main style={styles.main}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/search" element={<Search />} />
                <Route path="/cart" element={<Cart />} />
              </Routes>
            </main>
          </div>
        </NotificationProvider>
      </Router>
    </Provider>
  );
}

const styles = {
  main: {
    minHeight: 'calc(100vh - 64px)',
    backgroundColor: '#f8f9fa',
  },
};

export default App;
