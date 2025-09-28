import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllEmployees, createEmployee, updateEmployee, deleteEmployee } from '../../services/employeeService';
import { Employee } from '../../types/Employee';
import './EmployeeManagement.css';
import Swal from 'sweetalert2';

const EmployeeManagement: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);

  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [department, setDepartment] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    fetchEmployees();
  }, [user, navigate]);

  const fetchEmployees = async () => {
    try {
      const data = await getAllEmployees();
      setEmployees(data);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch employees. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setCurrentEmployee(null);
    setName('');
    setPosition('');
    setDepartment('');
    setShowForm(true);
  };

  const handleEditClick = (employee: Employee) => {
    setCurrentEmployee(employee);
    setName(employee.name);
    setPosition(employee.position);
    setDepartment(employee.department);
    setShowForm(true);
  };

  const handleDeleteClick = async (id: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });
    if (result.isConfirmed) {
      try {
        await deleteEmployee(id);
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Employee has been deleted.',
        });
        fetchEmployees();
      } catch (err) {
        console.error('Failed to delete employee:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete employee. Please try again later.',
        });
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (currentEmployee) {
        await updateEmployee(currentEmployee.id, { name, position, department });
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Employee has been updated.',
        });
      } else {
        await createEmployee({ name, position, department });
        Swal.fire({
          icon: 'success',
          title: 'Created!',
          text: 'Employee has been created.',
        });
      }
      setShowForm(false);
      setCurrentEmployee(null);
      fetchEmployees();
    } catch (err) {
      console.error('Failed to save employee:', err);
      let errorMessage = 'Failed to save employee.';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setCurrentEmployee(null);
  };

  if (!user || user.role !== 'admin') {
    navigate('/admin/login');
    return null;
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-employee-management">
      <div className="admin-employee-management-container">
        <div className="admin-employee-breadcrumb">
          <Link to="/admin/dashboard">Dashboard <span>/</span></Link> Employee Management
        </div>
        <h2>Employee Management</h2>
        <button onClick={handleAddClick} className="admin-employee-add-btn">Add Employee</button>

        {showForm && (
          <div className="admin-employee-form-overlay">
            <div className="admin-employee-form">
              <h3>{currentEmployee ? 'Edit Employee' : 'Add Employee'}</h3>
              <form onSubmit={handleFormSubmit}>
                <div>
                  <label>Name:</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>Position:</label>
                  <input
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>Department:</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" disabled={loading}>Save</button>
                <button type="button" onClick={handleCancelForm} disabled={loading}>Cancel</button>
              </form>
            </div>
          </div>
        )}

        <table className="admin-employee-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Position</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>{employee.name}</td>
                <td>{employee.position}</td>
                <td>{employee.department}</td>
                <td>
                  <button onClick={() => handleEditClick(employee)} className="admin-employee-edit-btn">Edit</button>
                  <button onClick={() => handleDeleteClick(employee.id)} className="admin-employee-delete-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeManagement;