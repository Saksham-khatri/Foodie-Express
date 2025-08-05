import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      if (email === 'admin' && password === 'admin123') {
        const res = await axios.post('http://localhost:5000/api/admin/login', {
          username: email,
          password,
        });

        if (res.data.success) {
          localStorage.setItem('adminToken', res.data.token);
          setModalMessage('Admin login successful!');
          setShowModal(true);

          setTimeout(() => {
            navigate('/admin');
          }, 2500);
          return;
        } else {
          alert('Admin login failed!');
          return;
        }
      }

      const res = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password,
      });

      if (res.data && res.data.token && res.data.user) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setEmail('');
        setPassword('');
        setModalMessage('Login successful!');
        setShowModal(true);

        setTimeout(() => {
          if (res.data.user.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        }, 2500);
      } else {
        alert('Login failed: Invalid response');
      }
    } catch (err) {
      alert('Login failed: ' + (err.response?.data?.error || 'Server error'));
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-heading">Login</h2>

      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="login-input"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="login-input"
      />

      <button onClick={handleLogin} className="login-button">
        Login
      </button>

      {showModal && (
        <div className="popup-modal">
          <div className="popup-box">
            <p>{modalMessage}</p>
            <p className="popup-note">Redirecting...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
