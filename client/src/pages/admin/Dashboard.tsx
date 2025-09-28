import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/admin/login');
    };

    if (!user || user.role !== 'admin') {
        navigate('/admin/login');
        return null;
    }

    return (
        <div className="admin-dashboard">
            <div className="admin-dashboard-container">
                <header className="admin-dashboard-header">
                    <div>
                        <h2>Admin HRD Dashboard</h2>
                        <p className="admin-dashboard-welcome">Welcome, {user.username}!</p>
                    </div>
                    <button onClick={handleLogout} className="admin-dashboard-logout-btn">
                        Logout
                    </button>
                </header>

                <main>
                    <nav className="admin-dashboard-nav">
                        <ul>
                            <li><Link to="/admin/employees">Manage Employees</Link></li>
                            <li><Link to="/admin/attendance">Monitor Attendance</Link></li>
                        </ul>
                    </nav>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;