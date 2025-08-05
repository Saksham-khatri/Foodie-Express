import React, { useEffect, useState } from 'react';
import '../styles/UserProfilePage.css';
import axios from 'axios';

function UserProfilePage() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: '', address: '' });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
  });

  const [addressInput, setAddressInput] = useState('');
  const [savedAddresses, setSavedAddresses] = useState([]);

  // Load user and addresses on page load
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
    setForm({ name: storedUser?.name || '', address: storedUser?.address || '' });

    if (storedUser) {
      fetchSavedAddresses(storedUser._id);
    }
  }, []);

  const fetchSavedAddresses = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/address/${userId}`);
      setSavedAddresses(res.data.addresses);
    } catch (err) {
      console.error('Failed to load addresses:', err.message);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/api/users/${user._id}`, form);
      alert('Profile updated');
      localStorage.setItem('user', JSON.stringify(res.data.updatedUser));
      setUser(res.data.updatedUser);
      setEditMode(false);
    } catch (err) {
      alert('Error updating profile');
    }
  };

  const handlePasswordChange = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/api/users/${user._id}/password`, passwordForm);
      alert(res.data.message);
      setPasswordForm({ oldPassword: '', newPassword: '' });
    } catch (err) {
      alert(err.response?.data?.error || 'Password update failed');
    }
  };

  const handleAddAddress = async () => {
    if (!addressInput.trim()) return alert('Address cannot be empty');
    try {
      await axios.post('http://localhost:5000/api/users/address', {
        userId: user._id,
        address: addressInput,
      });
      setAddressInput('');
      fetchSavedAddresses(user._id);
    } catch (err) {
      alert('Failed to save address');
    }
  };

  const handleDeleteAddress = async (address) => {
    const confirmDelete = window.confirm(`Delete this address?\n\n"${address}"`);
    if (!confirmDelete) return;

    try {
      await axios.put(`http://localhost:5000/api/users/address/remove`, {
        userId: user._id,
        address: address,
      });
      fetchSavedAddresses(user._id);
    } catch (err) {
      alert('Failed to delete address');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to permanently delete your account?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/users/${user._id}`);
      alert("Account deleted successfully");
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = '/register';
    } catch (err) {
      alert("Failed to delete account");
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-pic">
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>

        {user ? (
          <>
            {editMode ? (
              <>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Name"
                  className="input-field"
                />
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Address"
                  className="input-field"
                />
                <button className="update-btn" onClick={handleProfileUpdate}>Save Changes</button>
                <button className="logout-btn" onClick={() => setEditMode(false)}>Cancel</button>
              </>
            ) : (
              <>
                <h2>{user.name}</h2>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Address:</strong> {user.address || 'N/A'}</p>
                <p><strong>Joined:</strong> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                <button className="edit-btn" onClick={() => setEditMode(true)}>Edit Profile</button>
              </>
            )}

            <hr />

            <div className="password-section">
              <h4>Change Password</h4>
              <input
                type="password"
                placeholder="Old Password"
                className="input-field"
                value={passwordForm.oldPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
              />
              <input
                type="password"
                placeholder="New Password"
                className="input-field"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              />
              <button className="update-btn" onClick={handlePasswordChange}>Update Password</button>
            </div>

            <hr />

            <div className="address-section">
              <h4>Saved Addresses</h4>
              <input
                type="text"
                placeholder="Enter new address"
                className="input-field"
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
              />
              <button className="update-btn" onClick={handleAddAddress}>Add Address</button>

              <ul className="address-list">
                {savedAddresses.map((addr, index) => (
                  <li key={index} className="address-item">
                    {addr}
                    <button className="delete-address-btn" onClick={() => handleDeleteAddress(addr)}>Delete</button>
                  </li>
                ))}
              </ul>
            </div>

            <hr />

            <button className="logout-btn" onClick={handleLogout}>Logout</button>
            <button className="delete-btn" onClick={handleDeleteAccount}>Delete Account</button>
          </>
        ) : (
          <p>Please login to view profile.</p>
        )}
      </div>
    </div>
  );
}

export default UserProfilePage;
