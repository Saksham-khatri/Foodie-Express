// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminFoodsPage from './pages/AdminFoodsPage'; 
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminLogin from './pages/AdminLogin';
import UserProfilePage from './pages/UserProfilePage';
import WishlistPage from './pages/WishlistPage';
import AdminDashboardPage from './pages/AdminDashboardPage'; 
import AdminUsersPage from './pages/AdminUsersPage';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import { CartProvider } from './context/CartContext';

// CSS
import './styles/Navbar.css';
import './styles/Footer.css';
import './styles/Banner.css';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="main-container">
          <Navbar />

          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<HomePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/orders" element={<OrderHistoryPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<UserProfilePage />} />

            {/* Admin Login */}
            <Route path="/admin-login" element={<AdminLogin />} />

            {/* Admin Panel with Sidebar Layout */}
            <Route path="/admin" element={<AdminDashboardPage />}>
              <Route index element={<Navigate to="foods" />} />
              <Route path="foods" element={<AdminFoodsPage />} /> 
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="users" element={<AdminUsersPage />} />
            </Route>
          </Routes>

          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
