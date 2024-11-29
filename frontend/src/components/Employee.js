import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Employee.css';
import { UserContext } from './UserContext';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    position: '',
    department: '',
  });
  const [searchQuery, setSearchQuery] = useState({ name: '', position: '' });
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();
  const { isLoggedIn } = useContext(UserContext);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
    } else {
      fetchEmployees();
    }
  }, [navigate]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/emp/employees');
      setEmployees(response.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery({ ...searchQuery, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const { name, position } = searchQuery;
      const queryParams = new URLSearchParams({ name, position });
      const response = await axios.get(`http://localhost:3000/api/v1/emp/employees/search?${queryParams}`);
      setEmployees(response.data);
      setError('');
    } catch (err) {
      setError('No employees found matching the search criteria.');
      setEmployees([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (selectedEmployee) {
        await axios.put(`http://localhost:3000/api/v1/emp/employees/${selectedEmployee._id}`, formData);
        setSuccess('Employee updated successfully!');
      } else {
        await axios.post('http://localhost:3000/api/v1/emp/employees', formData);
        setSuccess('Employee added successfully!');
      }
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        position: '',
        department: '',
      });
      setSelectedEmployee(null);
      fetchEmployees();
    } catch (err) {
      setError('Failed to save employee. Please check your inputs.');
    }
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setFormData({
      first_name: employee.first_name,
      last_name: employee.last_name,
      email: employee.email,
      position: employee.position,
      department: employee.department,
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/emp/employees/${id}`);
      setSuccess('Employee deleted successfully!');
      fetchEmployees();
    } catch (err) {
      setError('Failed to delete employee.');
    }
  };

  const handleReset = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      position: '',
      department: '',
    });
    setSelectedEmployee(null);
  };

  return (
    <div className="container">
      <h1 className="heading">Employee Management</h1>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      {/* Search Form */}
      <div className="form">
        <h2>Search Employees</h2>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            name="name"
            placeholder="Search by Name"
            value={searchQuery.name}
            onChange={handleSearchInputChange}
            className="input"
          />
          <input
            type="text"
            name="position"
            placeholder="Search by Position"
            value={searchQuery.position}
            onChange={handleSearchInputChange}
            className="input"
          />
          <button type="submit" className="button primary-button">
            Search
          </button>
        </form>
      </div>

      <div className="form">
        <h2>{selectedEmployee ? 'Edit Employee' : 'Add Employee'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleInputChange}
            required
            className="input"
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleInputChange}
            required
            className="input"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="input"
          />
          <input
            type="text"
            name="position"
            placeholder="Position"
            value={formData.position}
            onChange={handleInputChange}
            required
            className="input"
          />
          <input
            type="text"
            name="department"
            placeholder="Department"
            value={formData.department}
            onChange={handleInputChange}
            required
            className="input"
          />
          <button type="submit" className="button primary-button">
            {selectedEmployee ? 'Update' : 'Add'}
          </button>
          <button type="button" onClick={handleReset} className="button secondary-button">
            Reset
          </button>
        </form>
      </div>

      <div>
        <h2>Employee List</h2>
        <table className="table">
          <thead>
            <tr>
              <th className="th">First Name</th>
              <th className="th">Last Name</th>
              <th className="th">Email</th>
              <th className="th">Position</th>
              <th className="th">Department</th>
              <th className="th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee._id}>
                <td className="td">{employee.first_name}</td>
                <td className="td">{employee.last_name}</td>
                <td className="td">{employee.email}</td>
                <td className="td">{employee.position}</td>
                <td className="td">{employee.department}</td>
                <td className="td">
                  <div className="actions">
                    <button
                      onClick={() => handleEdit(employee)}
                      className="button primary-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(employee._id)}
                      className="button secondary-button"
                    >
                      Delete
                    </button>
                  </div>
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
