import React from 'react';
import { Link } from 'react-router-dom';
import './Admin.css';

const Admin = () => {
  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>
      <div className="admin-menu">
        <Link to="/admin/carts" className="admin-link">
          <div className="admin-card">
            <h2>Shopping Carts</h2>
            <p>View all active shopping carts and their items</p>
          </div>
        </Link>
        <Link to="/admin/orders" className="admin-link">
          <div className="admin-card">
            <h2>Orders</h2>
            <p>View all completed orders and their details</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Admin;
