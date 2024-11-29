import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import '../css/Login.css'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const { isLoggedIn, login, logout} = useContext(UserContext);
  


  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token && !isLoggedIn) {
      login(true); 
    }
  }, [isLoggedIn, login]);


  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Both email and password are required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email');
      return;
    }

    setError('');

    try {
      
      const response = await axios.post('http://localhost:3000/api/v1/user/login', {
        email: email,
        password: password,
      });

 
      if (response.status === 200) {
        setSuccessMessage('Login successful!');
        login(); 
        navigate('/employees'); 
      }
    } catch (err) {
   
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'An error occurred');
      } else {
        setError('Network error or server down');
      }
    }
  };

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(email);
  };




  if (isLoggedIn || localStorage.getItem('token')) {
    return (
      <div className="welcome-container">
        <h2>Welcome back!</h2>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  return (
    <div className="login-container">
      <h2>Login Page</h2>
      {error && <div className="error">{error}</div>}
      {successMessage && <div className="success">{successMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={handleEmailChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={handlePasswordChange} required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
