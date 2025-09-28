import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import { User } from '../../types/User';
import './Login.css';
import Swal from 'sweetalert2';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const loginResponse = await login({ username, password });
      if (loginResponse.role === 'admin' || loginResponse.role === 'employee') {
        const userData: User = {
          ...loginResponse,
          role: loginResponse.role as 'admin' | 'employee',
        };
        localStorage.setItem('user', JSON.stringify(userData));
        if (userData.role === 'admin') {
          navigate('/admin/dashboard');
          Swal.fire({
            icon: 'success',
            title: 'Login Successful!',
            text: `Welcome back, ${userData.username}!`,
          });
        } else {
          setError('Invalid user role for admin login.');
          Swal.fire({
            icon: 'error',
            title: 'Access Denied',
            text: 'You do not have admin privileges.',
          });
        }
      } else {
        setError('Invalid user role for admin login.');
      }
    } catch (err) {
      setError('Login failed. Please check your credentials.');
      console.error(err);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login-container">
        <h2>Admin HRD Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;