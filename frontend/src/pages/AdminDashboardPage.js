// src/pages/AdminDashboardPage.js

import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import '../styles/AdminDashboardPage.css';

function AdminDashboardPage() {
  const location = useLocation();

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <h2 className="admin-title">Admin Panel</h2>
        <nav>
          <Link
            to="/admin/foods"
            className={location.pathname.includes('foods') ? 'active' : ''}
          >
            Manage Foods
          </Link>
          <Link
            to="/admin/orders"
            className={location.pathname.includes('orders') ? 'active' : ''}
          >
            Manage Orders
          </Link>
          <Link
            to="/admin/users"
            className={location.pathname.includes('users') ? 'active' : ''}
          >
            Manage Users
          </Link>
        </nav>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminDashboardPage;
