import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/RegisterPage.css';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert('Please fill all fields');
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailPattern.test(email)) {
      alert('Please enter a valid email address');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/users/register', {
        name,
        email,
        password,
      });

      if (res.data && res.data.token && res.data.user) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setName('');
        setEmail('');
        setPassword('');
        setModalMessage('Registration successful!');
        setShowModal(true);

        setTimeout(() => {
          if (res.data.user.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        }, 2500);
      } else {
        alert('Registration failed: Invalid response');
      }
    } catch (err) {
      alert('Registration failed: ' + (err.response?.data?.error || 'Server error'));
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-heading">Register</h2>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="register-input"
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="register-input"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="register-input"
      />

      <button onClick={handleRegister} className="register-btn">
        Register
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

export default RegisterPage;
