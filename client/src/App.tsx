import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import EmployeeManagement from './pages/admin/EmployeeManagement';
import AttendanceMonitoring from './pages/admin/AttendanceMonitoring';
import EmployeeLogin from './pages/employees/Login';
import EmployeeDashboard from './pages/employees/Dashboard';


const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles: string[] }> = ({ children, allowedRoles }) => {
  const user = localStorage.getItem('user');
  if (!user) {
    return <Navigate to="/employees/login" replace />;
  }

  const userData = JSON.parse(user);
  if (!allowedRoles.includes(userData.role)) {
    return <Navigate to="/employees/login" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route Login Employee and Admin HRD */}
          <Route path="/employees/login" element={<EmployeeLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Route Dashboard Employee */}
          <Route path="/employees/dashboard" element={
            <ProtectedRoute allowedRoles={['employee']}>
              <EmployeeDashboard />
            </ProtectedRoute>
          } />

          {/* Route Dashboard Admin HRD */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Route Employee Management Admin HRD */}
          <Route path="/admin/employees" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <EmployeeManagement />
            </ProtectedRoute>
          } />

          {/* Route Attendance Monitoring Admin HRD */}
          <Route path="/admin/attendance" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AttendanceMonitoring />
            </ProtectedRoute>
          } />

          {/* Redirect default */}
          <Route path="/" element={<Navigate to="/employees/login" replace />} />
          <Route path="*" element={<Navigate to="/employees/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;