import React, { useState } from 'react';
import { register, login } from '../services/authService';

const AuthForm = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  // Email validation with regex
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!isLogin && !formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Input change handler with real-time validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Real-time validation for specific fields
    if (name === 'email' && value.trim() && !isValidEmail(value)) {
      setErrors({
        ...errors,
        email: 'Email is invalid'
      });
    } else if (name === 'password' && value.length > 0 && value.length < 8) {
      setErrors({
        ...errors,
        password: 'Password must be at least 8 characters'
      });
    } else {
      // Clear the error for this field if it's now valid
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset any existing API errors
    setApiError('');
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      let response;
      
      if (isLogin) {
        // Login
        response = await login({
          email: formData.email,
          password: formData.password
        });
      } else {
        // Register
        response = await register({
          username: formData.username,
          email: formData.email,
          password: formData.password
        });
      }
      
      // Call the onLogin callback with user data
      onLogin(response.user);
    } catch (error) {
      setApiError(error.error || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      
      {apiError && (
        <div className="alert alert-danger">
          {apiError}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              className={`form-control ${errors.username ? 'invalid' : ''}`}
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && <div className="error-message">{errors.username}</div>}
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className={`form-control ${errors.email ? 'invalid' : ''}`}
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className={`form-control ${errors.password ? 'invalid' : ''}`}
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <div className="error-message">{errors.password}</div>}
        </div>
        
        <div className="form-group">
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
          </button>
        </div>
      </form>
      
      <p>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          style={{
            background: 'none',
            border: 'none',
            color: '#3273dc',
            cursor: 'pointer',
            padding: 0,
            textDecoration: 'underline'
          }}
        >
          {isLogin ? 'Register here' : 'Login here'}
        </button>
      </p>
    </div>
  );
};

export default AuthForm;