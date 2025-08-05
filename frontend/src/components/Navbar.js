// src/components/Navbar.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const adminToken = localStorage.getItem('adminToken');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      {/* Left - Logo */}
      <div className="nav-left">
        <Link to="/" className="logo-container">
          <img
            src="/logo.jpg" // public folder path
            alt="logo"
            className="logo-img"
          />
          <span className="logo-text">Foodie Express</span>
        </Link>
      </div>

      {/* Center Links */}
      <div className="nav-center">
        {user && !adminToken && (
          <>
            <Link to="/" className="navlink">Home</Link>
            <Link to="/cart" className="navlink">Cart</Link>
            <Link to="/orders" className="navlink">My Orders</Link>
            <Link to="/wishlist" className="navlink">Wishlist</Link>
            <Link to="/profile" className="navlink">Profile</Link>
          </>
        )}
        {adminToken && (
          <>
            <Link to="/admin" className="navlink">Admin Panel</Link>
            
          </>
        )}
      </div>

      {/* Right - Auth */}
      <div className="nav-right">
        {!user && !adminToken && (
          <>
            <Link to="/login" className="navlink">Login</Link>
            <Link to="/register" className="navlink">Register</Link>
          </>
        )}
        {(user || adminToken) && (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
