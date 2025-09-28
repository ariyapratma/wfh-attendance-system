import React, { useState, useEffect, ChangeEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { checkIn, checkOut, getAttendanceByEmployeeId } from '../../services/attendanceService';
import { Attendance } from '../../types/Attendance';
import './Dashboard.css';

const EmployeeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [history, setHistory] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'employee' || !user.employeeId) {
      navigate('/employee/login');
      return;
    }
    fetchAttendanceHistory();
  }, [user, navigate]);

  const fetchAttendanceHistory = async () => {
    if (!user.employeeId) {
      console.error('User employeeId is missing');
      return;
    }
    try {
      const data = await getAttendanceByEmployeeId(user.employeeId);
      setHistory(data);
    } catch (err) {
      console.error('Failed to fetch attendance history:', err);
    }
  };

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPhoto(file);

    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleCheckIn = async () => {
    if (!user.employeeId) return;
    if (loading) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('employeeId', user.employeeId.toString());
    formData.append('date', new Date().toISOString().split('T')[0]);
    if (photo) {
      formData.append('photo', photo);
    }

    try {
      const date = new Date().toISOString().split('T')[0];
      const newAttendance = await checkInWithPhoto(formData);
      setAttendance(newAttendance);
      setPhoto(null);
      setPreviewUrl(null);
      fetchAttendanceHistory();
    } catch (err) {
      console.error('Check-in failed:', err);
    }
    setLoading(false);
  };

  const checkInWithPhoto = async (formData: FormData): Promise<Attendance> => {
    const response = await fetch('http://localhost:3003/attendances/check-in', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Check-in failed');
    }

    return response.json();
  };

  const handleCheckOut = async () => {
    if (!attendance || !attendance.id) return;
    setLoading(true);
    try {
      const time = new Date().toTimeString().split(' ')[0];
      const updatedAttendance = await checkOut(attendance.id, { checkOutTime: time });
      setAttendance(updatedAttendance);
      fetchAttendanceHistory();
    } catch (err) {
      console.error('Check-out failed:', err);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/employee/login');
  };

  if (!user || user.role !== 'employee') {
    return <Navigate to="/employee/login" replace />;
  }

  return (
    <div className="employee-dashboard">
      <div className="employee-dashboard-container">
        <header className="employee-dashboard-header">
          <div>
            <h2 className="employee-dashboard-title">Employee Dashboard</h2>
            <p className="employee-dashboard-welcome">Welcome, {user.username}!</p>
          </div>
          <button onClick={handleLogout} className="employee-dashboard-logout-btn">
            Logout
          </button>
        </header>

        <main>
          <section className="employee-dashboard-card">
            <h3 className="employee-dashboard-card-title">Today's Attendance</h3>
            <div className="employee-dashboard-attendance-info">
              {attendance ? (
                <>
                  <p><strong>Date:</strong> {attendance.date}</p>
                  <p><strong>Check-in:</strong> {attendance.checkInTime || 'Not yet'}</p>
                  <p><strong>Check-out:</strong> {attendance.checkOutTime || 'Not yet'}</p>
                  {attendance.photoPath && (<>
                    <p><strong>Photo:</strong></p>
                    <img src={`http://localhost:3003/${attendance.photoPath}`} alt="Attendance Proof" className="employee-dashboard-photo" />
                  </>)}
                </>
              ) : (
                <p>No check-in record for today.</p>
              )}
            </div>
            <div>
              {!attendance || !attendance.checkInTime ? (
                <>
                  <div className="employee-dashboard-file-upload">
                    <label htmlFor="photo-upload" className="employee-dashboard-file-upload-btn">
                      Choose File
                    </label>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="employee-dashboard-file-upload-input"
                    />
                  </div>
                  {previewUrl && (
                    <div className="employee-dashboard-photo-preview">
                      <strong>Preview:</strong>
                      <img src={previewUrl} alt="Preview" style={{ width: '200px', height: 'auto', display: 'block', marginTop: '10px' }} />
                    </div>
                  )}
                  <button onClick={handleCheckIn} disabled={loading || !photo} className="employee-dashboard-check-btn">
                    {loading ? 'Processing...' : 'Check In'}
                  </button>
                  {!photo && <p className="employee-dashboard-error-message">Please upload a photo to check in.</p>}
                </>
              ) : !attendance.checkOutTime ? (
                <button onClick={handleCheckOut} disabled={loading} className="employee-dashboard-check-btn">
                  {loading ? 'Processing...' : 'Check Out'}
                </button>
              ) : (
                <p>Attendance completed for today.</p>
              )}
            </div>
          </section>

          <section className="employee-dashboard-history-card">
            <h3 className="employee-dashboard-history-title">Attendance History</h3>
            <ul className="employee-dashboard-history-list">
              {history.length > 0 ? (
                history.map((item) => (
                  <li key={item.id}>
                    <span className="employee-dashboard-history-item-date">{item.date}</span>
                    <span className="employee-dashboard-history-item-times">
                      Check-in: {item.checkInTime || 'N/A'}, Check-out: {item.checkOutTime || 'N/A'}
                      {item.photoPath && (
                        <img src={`http://localhost:3003/${item.photoPath}`} alt="Attendance Proof" style={{ width: '50px', height: 'auto', marginLeft: '10px', verticalAlign: 'middle' }} />
                      )}
                    </span>
                  </li>
                ))
              ) : (
                <li>No attendance records found.</li>
              )}
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
};

export default EmployeeDashboard;