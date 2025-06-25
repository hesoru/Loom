import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NotificationProvider from './components/NotificationProvider';
import Header from './components/Header';
import Home from './pages/Home';
import Categories from './pages/Categories';
import CategoryPage from './pages/CategoryPage';
import ProductDetails from './pages/ProductDetails';
import Search from './pages/Search';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Admin from './pages/Admin';
import CartsList from './pages/CartsList';
import OrdersList from './pages/OrdersList';
import Login from './pages/Login';
import Register from './pages/Register';
import MyOrders from './pages/MyOrders';
import './App.css';

function App() {
  return (
    <Router>
      <NotificationProvider>
        <div className="App">
          <Header />
          <main style={styles.main}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/category/:categoryName" element={<CategoryPage />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/search" element={<Search />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/carts" element={<CartsList />} />
              <Route path="/admin/orders" element={<OrdersList />} />
            </Routes>
          </main>
        </div>
      </NotificationProvider>
    </Router>
  );
}

const styles = {
  main: {
    minHeight: 'calc(100vh - 64px)',
    backgroundColor: '#f8f9fa',
  },
};

export default App;
