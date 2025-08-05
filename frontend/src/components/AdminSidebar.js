import React from 'react';
import '../styles/AdminSidebar.css';

function AdminSidebar({ activeTab, setActiveTab }) {
  return (
    <div className="admin-sidebar">
      <h3 className="sidebar-title">Admin Menu</h3>
      <ul className="sidebar-list">
        <li
          className={activeTab === 'food' ? 'active' : ''}
          onClick={() => setActiveTab('food')}
        >
          Food Items
        </li>
        {/* Orders tab removed as per request */}
        <li
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          Users
        </li>
      </ul>
    </div>
  );
}

export default AdminSidebar;
