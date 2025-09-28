import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllAttendances } from '../../services/attendanceService';
import { Attendance } from '../../types/Attendance';
import './AttendanceMonitoring.css';

const AttendanceMonitoring: React.FC = () => {
  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate('admin/dashboard');
  }
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    fetchAttendances();
  }, [user, navigate]);

  const fetchAttendances = async () => {
    try {
      const data = await getAllAttendances();
      setAttendances(data);
    } catch (err) {
      console.error('Failed to fetch attendances:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    navigate('/admin/login');
    return null;
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-attendance-monitoring">
      <div className="admin-attendance-monitoring-container">
        <div className="admin-attendance-monitoring-breadcrumb">
          <Link to="/admin/dashboard">Dashboard <span>/</span></Link> Attendance Monitoring
        </div>
        <h2>Attendance Monitoring</h2>
        <table className="admin-attendance-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Employee ID</th>
              <th>Date</th>
              <th>Check-in Time</th>
              <th>Check-out Time</th>
              <th>Proof Photo</th>
            </tr>
          </thead>
          <tbody>
            {attendances.map((attendance) => (
              <tr key={attendance.id}>
                <td>{attendance.id}</td>
                <td>{attendance.employeeId}</td>
                <td>{attendance.date}</td>
                <td>{attendance.checkInTime || 'N/A'}</td>
                <td>{attendance.checkOutTime || 'N/A'}</td>
                <td>
                  {attendance.photoPath ? (
                    <img
                      src={`http://localhost:3003/${attendance.photoPath}`}
                      alt="Attendance Proof"
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                  ) : (
                    'No Photo'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceMonitoring;