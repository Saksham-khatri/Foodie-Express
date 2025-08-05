import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AdminUsersPage.css';

function AdminUsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Users ko fetch karo
  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err.message);
      alert('Failed to load users');
    }
  };

  // Kisi user ko delete karo
  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`);
      fetchUsers(); // refresh user list
    } catch (err) {
      console.error('Error deleting user:', err.message);
      alert('Failed to delete user');
    }
  };

  return (
    <div className="admin-users-container">
      <h2>All Registered Users</h2>

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Registered On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleString()
                    : 'N/A'}
                </td>
                <td>
                  <button className="delete-btn" onClick={() => handleDelete(user._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminUsersPage;
