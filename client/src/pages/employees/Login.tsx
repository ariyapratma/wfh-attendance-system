import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import './Login.css';
import Swal from "sweetalert2";

const EmployeeLogin: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('')
        try {
            const userData = await login({ username, password });
            if (!userData.employeeId) {
                throw new Error('Employee ID not found in user data');
            }
            localStorage.setItem('user', JSON.stringify(userData));
            if (userData.role === 'employee') {
                navigate('/employees/dashboard');
                Swal.fire({
                    icon: 'success',
                    title: 'Login Successful!',
                    text: `Welcome back, ${userData.username}!`,
                });
            } else {
                setError('Invalid role for employee login.');
                Swal.fire({
                    icon: 'error',
                    title: 'Access Denied',
                    text: 'You do not have employee privileges.',
                });
            }
        } catch (err) {
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="employee-login">
            <div className="employee-login-container">
                <h2>Employee Login</h2>
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

export default EmployeeLogin;